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

            if (budget == null)
            {
                budget = new Budget
                {
                    UserId = Token.UserId,
                    Year = year,
                    Month = month,
                    DateAdded = DateTime.UtcNow
                };

                var categories = _uow.Categories
                    .GetAll()
                    .Where(x => x.UserId == Token.UserId)
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

                await _uow.Incomes.AddRangeAsync(incomes);

                var outgoings = categories
                    .Where(x => x.Type == CategoryType.Dedicated || x.Type == CategoryType.Variable)
                    .Select(x => new Outgoing
                    {
                        BudgetId = budget.Id,
                        UserId = Token.UserId,
                        DateAdded = DateTime.UtcNow,
                        CategoryId = x.Id
                    })
                    .ToList();

                await _uow.Outgoings.AddRangeAsync(outgoings);

                var savings = categories
                    .Where(x => x.Type == CategoryType.Savings)
                    .Select(x => new Saving
                    {
                        BudgetId = budget.Id,
                        UserId = Token.UserId,
                        DateAdded = DateTime.UtcNow,
                        CategoryId = x.Id
                    })
                    .ToList();

                await _uow.Savings.AddRangeAsync(savings);

                budget.Incomes = incomes;
                budget.Outgoings = outgoings;
                budget.Savings = savings;

                var transactions = categories
                    .Select(x => new Transaction
                    {
                        BudgetId = budget.Id,
                        Budget = budget,
                        UserId = Token.UserId,
                        CategoryId = x.Id,
                        Category = x
                    })
                    .ToList();

                budget.Transactions = transactions;

                await _uow.Transactions.AddRangeAsync(transactions);
                await _uow.Budgets.AddAsync(budget);
                await _uow.CommitAsync();
            }

            var model = _mapper.Map<Budget, ApiBudget>(budget);

            return new JsonResult(model);
        }

        [HttpPut]
        [Route("add")]
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
                Notes = model.Notes,
                UserId = Token.UserId
            };

            await _uow.Transactions.AddAsync(transaction);

            UpdateTransaction(model);

            await _uow.CommitAsync();

            model = _mapper.Map<Transaction, ApiTransaction>(transaction);

            return new JsonResult(model);
        }

        [HttpPatch]
        [Route("edit")]
        public async Task<IActionResult> EditTransaction([FromBody] ApiTransaction model)
        {
            var transaction = await _uow.Transactions.GetByIdAsync(model.Id);
            var category = await _uow.Categories.GetByIdAsync(model.Category.Id);

            if (transaction != null)
            {
                transaction.DateModified = DateTime.UtcNow;
                transaction.Date = model.Date;
                transaction.CategoryId = category.Id;
                transaction.Category = category;
                transaction.Amount = model.Amount;
                transaction.Notes = model.Notes;

                _uow.Transactions.Update(transaction);

                UpdateTransaction(model);

                await _uow.CommitAsync();

                model = _mapper.Map<Transaction, ApiTransaction>(transaction);
                return new JsonResult(model);
            }

            return new NotFoundResult();
        }

        [HttpPatch]
        [Route("outgoing/{id:int}/edit")]
        public async Task<IActionResult> EditOutgoing(int id, [FromBody] ApiOutgoing model)
        {
            var outgoing = _uow.Outgoings.GetAll()
                .Where(x => x.UserId == Token.UserId)
                .Where(x => x.Id == id)
                .FirstOrDefault();

            if (outgoing != null)
            {
                outgoing.DateModified = DateTime.UtcNow;
                outgoing.Budgeted = model.Budgeted;
                _uow.Outgoings.Update(outgoing);
                await _uow.CommitAsync();

                return new OkResult();
            }

            return new NotFoundResult();
        }

        private void UpdateTransaction(ApiTransaction model)
        {
            if (model.Category.Type == CategoryType.Income)
            {
                var income = _uow.Incomes.GetAll()
                    .Where(x => x.BudgetId == model.BudgetId)
                    .Where(x => x.CategoryId == model.Category.Id)
                    .FirstOrDefault();

                if (income != null)
                {
                    income.Resolved = model.Resolved;
                    income.DateModified = DateTime.UtcNow;
                    income.Total = model.Amount;

                    _uow.Incomes.Update(income);
                }
            }
            else if (model.Category.Type == CategoryType.Dedicated || model.Category.Type == CategoryType.Variable)
            {
                var outgoing = _uow.Outgoings.GetAll()
                    .Where(x => x.BudgetId == model.BudgetId)
                    .Where(x => x.CategoryId == model.Category.Id)
                    .FirstOrDefault();

                if (outgoing != null)
                {
                    outgoing.DateModified = DateTime.UtcNow;
                    outgoing.Resolved = model.Resolved;
                    outgoing.Actual += model.Amount;
                    outgoing.Remaining = outgoing.Remaining - model.Amount;

                    _uow.Outgoings.Update(outgoing);
                }
            }
            else if (model.Category.Type == CategoryType.Savings)
            {
                var saving = _uow.Savings.GetAll()
                    .Where(x => x.BudgetId == model.BudgetId)
                    .Where(x => x.CategoryId == model.Category.Id)
                    .FirstOrDefault();

                if (saving != null)
                {
                    saving.DateModified = DateTime.UtcNow;
                    saving.Resolved = model.Resolved;
                    saving.Total = model.Amount;

                    _uow.Savings.Update(saving);
                }
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task DeleteTransaction(int id, [FromBody] ApiTransaction model)
        {
            UpdateTransaction(model);
            _uow.Transactions.Delete(id);
            await _uow.CommitAsync();
        }
    }
}