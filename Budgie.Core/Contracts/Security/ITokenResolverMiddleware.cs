using Budgie.Core;
using System.Threading.Tasks;

namespace Budgie.Core.Contracts.Security
{
    public interface ITokenResolverMiddleware
    {
        Task<User> ResolveAsync();
    }
}