using System;
using AutoMapper;
using Budgie.Core;
using Budgie.Core.Contracts.Security;
using Budgie.Core.Enums;
using Budgie.Data.Abstractions;
using Budgie.Framework.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Budgie.Api.Models;

namespace Budgie.Api.Controllers
{
    [Route("api/[controller]")]
    public class BudgetsController : ApiControllerBase
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;

        public BudgetsController(IUow uow, IMapper mapper, ITokenResolverMiddleware tokenResolver) : base(tokenResolver)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("{year:int}/{month:int}")]
        public async Task<IActionResult> GetBudget(int year, int month)
        {
            var budget = await _uow.Budgets.GetBudget(year, month);

            var categories = _uow.Categories
                    .GetAll()
                    .Where(x => x.UserId == Token.UserId)
                    .ToList();

            if (budget == null)
            {
                budget = new Budget
                {
                    UserId = Token.UserId,
                    Year = year,
                    Month = month,
                    DateAdded = DateTime.UtcNow
                };

                var outgoings = categories
                    .Where(x => x.Type == CategoryType.Outgoing)
                    .Select(x => new Outgoing
                    {
                        BudgetId = budget.Id,
                        UserId = Token.UserId,
                        DateAdded = DateTime.UtcNow,
                        CategoryId = x.Id
                    })
                    .ToList();

                var incomes = categories
                .Where(x => x.Type == CategoryType.Income)
                .Select(x => new Income
                {
                    BudgetId = budget.Id,
                    UserId = Token.UserId,
                    DateAdded = DateTime.UtcNow,
                    CategoryId = x.Id
                })
                .ToList();

                await _uow.Outgoings.AddRangeAsync(outgoings);
                await _uow.Incomes.AddRangeAsync(incomes);

                budget.Outgoings = outgoings;
                budget.Incomes = incomes;

                await _uow.Budgets.AddAsync(budget);
                await _uow.CommitAsync();
            }

            var budgetOutgoingCatIds = budget.Outgoings.Select(x => x.CategoryId).ToArray();
            var budgetIncomeCatdIds = budget.Incomes.Select(X => X.CategoryId).ToArray();
            var outgoingCatIds = categories.Where(x => x.Type == CategoryType.Outgoing).Select(x => x.Id).ToArray();
            var incomeCatIds = categories.Where(x => x.Type == CategoryType.Income).Select(x => x.Id).ToArray();

            var missingOutgoingKeys = outgoingCatIds.Where(x => !budgetOutgoingCatIds.Contains(x)).Select(x => x);
            var missingIncomeKeys = incomeCatIds.Where(x => !budgetIncomeCatdIds.Contains(x)).Select(x => x);

            if (missingOutgoingKeys.Any())
            {
                var outgoings = categories
                    .Where(x => missingOutgoingKeys.Contains(x.Id))
                    .Select(x => new Outgoing
                    {
                        BudgetId = budget.Id,
                        UserId = Token.UserId,
                        DateAdded = DateTime.UtcNow,
                        CategoryId = x.Id
                    })
                    .ToList();

                await _uow.Outgoings.AddRangeAsync(outgoings);
                budget.Outgoings.Concat(outgoings);
                await _uow.CommitAsync();
            }

            if (missingIncomeKeys.Any())
            {
                var incomes = categories
                    .Where(x => missingIncomeKeys.Contains(x.Id))
                    .Select(x => new Income
                    {
                        BudgetId = budget.Id,
                        UserId = Token.UserId,
                        DateAdded = DateTime.UtcNow,
                        CategoryId = x.Id
                    })
                    .ToList();

                await _uow.Incomes.AddRangeAsync(incomes);
                budget.Incomes.Concat(incomes);
                await _uow.CommitAsync();
            }

            var apiBudget = _mapper.Map<Budget, ApiBudget>(budget);
            var apiCategories = _mapper.Map<IEnumerable<Category>, IEnumerable<ApiCategory>>(categories);

            apiBudget.Categories = apiCategories;

            return new JsonResult(apiBudget);
        }

        [HttpPost]
        [Route("transaction")]
        public async Task<IActionResult> AddTransaction([FromBody] ApiTransaction model)
        {
            var budget = await _uow.Budgets.GetByIdAsync(model.BudgetId);
            var category = await _uow.Categories.GetByIdAsync(model.Category.Id);
            var transaction = new Transaction
            {
                DateAdded = DateTime.UtcNow,
                BudgetId = budget.Id,
                Budget = budget,
                CategoryId = category.Id,
                Category = category,
                Date = model.Date,
                Amount = model.Amount,
                UserId = Token.UserId
            };

            await _uow.Transactions.AddAsync(transaction);

            UpdateTransaction(model, category, 0);

            await _uow.CommitAsync();

            model = _mapper.Map<Transaction, ApiTransaction>(transaction);

            return new JsonResult(model);
        }

        [HttpPut]
        [Route("transaction/{id:int}")]
        public async Task<IActionResult> EditTransaction(int id, [FromBody] ApiTransaction model)
        {
            var transaction = await _uow.Transactions.GetByIdAsync(model.Id);
            var category = await _uow.Categories.GetByIdAsync(model.Category.Id);

            if (transaction != null)
            {
                transaction.DateModified = DateTime.UtcNow;
                transaction.Date = model.Date;
                transaction.CategoryId = category.Id;
                transaction.Category = category;

                decimal delta = 0;
                if (transaction.Amount != model.Amount)
                {
                    delta = transaction.Amount - model.Amount;
                }

                transaction.Amount = model.Amount;

                _uow.Transactions.Update(transaction);

                UpdateTransaction(model, category, delta);

                await _uow.CommitAsync();

                model = _mapper.Map<Transaction, ApiTransaction>(transaction);
                return new JsonResult(model);
            }

            return new NotFoundResult();
        }

        [HttpDelete]
        [Route("transaction/{id:int}")]
        public async Task<IActionResult> DeleteTransaction(int id, [FromBody] ApiTransaction model)
        {
            var transaction = await _uow.Transactions.GetByIdAsync(id);
            var category = await _uow.Categories.GetByIdAsync(model.Category.Id);

            if (transaction != null)
            {
                UpdateTransaction(model, category, transaction.Amount);
                model.Amount = 0;
            }

            _uow.Transactions.Delete(id);
            await _uow.CommitAsync();

            return new JsonResult(model);
        }

        [HttpPut]
        [Route("outgoings/{id:int}")]
        public async Task<IActionResult> EditOutgoing(int id, [FromBody] ApiOutgoing model)
        {
            var outgoing = await _uow.Outgoings.GetByIdAsync(id);
            outgoing.Budgeted = model.Budgeted;

            _uow.Outgoings.Update(outgoing);

            await _uow.CommitAsync();

            return new JsonResult(model);
        }

        private void UpdateTransaction(ApiTransaction model, Category category, decimal delta)
        {
            if (category.Type == CategoryType.Outgoing)
            {
                var outgoing = _uow.Outgoings.GetAll()
                    .Where(x => x.BudgetId == model.BudgetId)
                    .Where(x => x.CategoryId == model.Category.Id)
                    .FirstOrDefault();

                if (outgoing != null)
                {
                    outgoing.DateModified = DateTime.UtcNow;

                    if (delta == 0)
                    {
                        outgoing.Actual += model.Amount;
                        outgoing.Remaining = outgoing.Remaining - model.Amount;
                    }
                    else
                    {
                        outgoing.Actual -= delta;
                        outgoing.Remaining -= delta;
                    }

                    _uow.Outgoings.Update(outgoing);
                }
            }

            if (category.Type == CategoryType.Income)
            {
                var income = _uow.Incomes.GetAll()
                .Where(x => x.BudgetId == model.BudgetId)
                .Where(x => x.CategoryId == model.Category.Id)
                .FirstOrDefault();

                if (income != null)
                {
                    income.DateModified = DateTime.UtcNow;
                    income.Actual = model.Amount;

                    _uow.Incomes.Update(income);
                }
            }
        }
    }
}