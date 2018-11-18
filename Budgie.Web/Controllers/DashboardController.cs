using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Budgie.Api.Enums;
using Budgie.Api.Models;
using Budgie.Core;
using Budgie.Core.Contracts.Security;
using Budgie.Core.Enums;
using Budgie.Data.Abstractions;
using Budgie.Framework.Base;
using Microsoft.AspNetCore.Mvc;

namespace Budgie.Api.Controllers
{
    [Route("api/[controller]")]
    public class DashboardController : ApiControllerBase
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;

        public DashboardController(IUow uow, IMapper mapper, ITokenResolverMiddleware tokenResolver) : base(tokenResolver)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Dashboard([FromQuery] ApiDashboardSearchParams dashParams)
        {
            // get all variable outgoings
            var now = DateTime.UtcNow;
            var from = now;

            switch (dashParams.Range)
            {
                case DashboardRange.SevenDays:
                    from = now.AddDays(-7);
                    break;
                case DashboardRange.OneMonth:
                    from = now.AddMonths(-1);
                    break;
                case DashboardRange.ThreeMonths:
                    from = now.AddMonths(-3);
                    break;
                case DashboardRange.OneYear:
                    from = now.AddYears(-1);
                    break;
                default:
                    from = now.AddDays(-7);
                    break;
            }

            var dates = Enumerable.Range(0, (int)(now - from).TotalDays).Select(x => DateTime.UtcNow.AddDays(-x)).OrderBy(x => x);

            var model = new ApiDashboard
            {
                Labels = dates.Select(x => x.ToString("dd/MM/yyyy")).ToList()
            };

            var transactions = _uow.Transactions.GetAll()
            .Where(t => t.UserId == Token.UserId)
            .Where(t => t.Category.Type != CategoryType.Income)
            .Where(t => t.Date >= from)
            .Where(t => t.Date <= now)
            .GroupBy(t => t.CategoryId)
            .ToList();

            model.Datasets = transactions.Select(ts =>
            {
                return GetDataset(dates, ts);
            })
            .ToList();

            return new JsonResult(model);
        }

        private ApiDataset GetDataset(IEnumerable<DateTime> dates, IEnumerable<Transaction> transactions)
        {
            var data = new List<decimal>();
            var category = transactions.First().Category;

            foreach (var date in dates)
            {
                if (transactions.Any(x => x.Date.Date == date.Date))
                {
                    data.Add(transactions.Where(x => x.Date.Date == date.Date).Sum(x => x.Amount));
                }
                else
                {
                    data.Add(0);
                }
            }

            return new ApiDataset
            {
                Label = category.Name,
                BackgroundColor = category.ColourHex,
                Data = data
            };
        }
    }
}