using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Budgie.Api.Enums;
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

        [HttpPost]
        public IActionResult Dashboard([FromBody] ApiDashboardSearchParams dashParams)
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

            _uow.Outgoings
                .GetAll()
                .Where(x => x.UserId == Token.UserId)
                .Where(x => x.Date >= from)
                .Where(x => x.Date <= now)
                .Where(x => x.Category.Type == CategoryType.Variable)
                .ToList();

            return null;
        }
    }
}