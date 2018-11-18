using AutoMapper;
using Budgie.Api.Models;
using Budgie.Core;
using System.Linq;

namespace Budgie.Api.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, ApiUser>();
            CreateMap<Category, ApiCategory>();
            CreateMap<Outgoing, ApiOutgoing>();
            CreateMap<Income, ApiIncome>();
            CreateMap<Transaction, ApiTransaction>();
            CreateMap<Budget, ApiBudget>()
            .ForMember(dest => dest.TotalBudgeted, src => src.MapFrom(x => x.Outgoings.Sum(y => y.Budgeted)))
            .ForMember(dest => dest.TotalActuals, src => src.MapFrom(x => x.Outgoings.Sum(y => y.Actual)));
        }
    }
}