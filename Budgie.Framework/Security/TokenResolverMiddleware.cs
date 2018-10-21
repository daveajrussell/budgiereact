using Budgie.Core;
using Budgie.Core.Contracts.Security;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Budgie.Framework.Security
{
    public class TokenResolverMiddleware : ITokenResolverMiddleware
    {
        private readonly HttpContext _context;
        private User _user;

        public TokenResolverMiddleware(IHttpContextAccessor accessor)
        {
            _context = accessor.HttpContext;
        }

        public async Task<User> ResolveAsync()
        {
            if (_user == null && _context.User.Identity.IsAuthenticated)
            {
                string userId = _context.User.FindFirst(x => x.Type == BudgieClaimTypes.SubjectId)?.Value;

                _user = new User
                {
                    Id = int.Parse(userId)
                };
            }

            return await Task.FromResult(_user);
        }
    }
}