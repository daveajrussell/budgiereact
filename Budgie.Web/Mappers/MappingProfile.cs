using AutoMapper;
using Budgie.Core;
using System.Linq;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, ApiUser>();
        CreateMap<Category, ApiCategory>();
        CreateMap<Outgoing, ApiOutgoing>();
        CreateMap<Transaction, ApiTransaction>();
        CreateMap<Budget, ApiBudget>()
        .ForMember(dest => dest.TotalBudgeted, src => src.MapFrom(x => x.Outgoings.Sum(y => y.Budgeted)))
        .ForMember(dest => dest.TotalActuals, src => src.MapFrom(x => x.Outgoings.Sum(y => y.Actual)));
    }
}