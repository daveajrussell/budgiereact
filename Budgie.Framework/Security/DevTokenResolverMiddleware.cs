using Budgie.Core;
using Budgie.Core.Contracts.Security;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Budgie.Framework.Security
{
    public class DevTokenResolverMiddleware : ITokenResolverMiddleware
    {
        private User _user;

        public DevTokenResolverMiddleware()
        { }

        public async Task<User> ResolveAsync()
        {
            _user = new User
            {
                Id = 1
            };

            return await Task.FromResult(_user);
        }
    }
}