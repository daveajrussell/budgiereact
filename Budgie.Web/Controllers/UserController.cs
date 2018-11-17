using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Budgie.Core;
using Budgie.Core.Constants;
using Budgie.Core.Contracts.Security;
using Budgie.Core.Contracts.Settings;
using Budgie.Framework.Base;
using Budgie.Framework.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Budgie.Web.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class UserController : ApiControllerBase
    {
        private readonly IAppSettings _appSettings;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;

        public UserController(
            IAppSettings appSettings,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IMapper mapper,
            ITokenResolverMiddleware tokenResolver)
            : base(tokenResolver)
        {
            _appSettings = appSettings;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthenticateAsync([FromBody]ApiUser apiUser)
        {
            var result = await _signInManager.PasswordSignInAsync(apiUser.Username, apiUser.Password, false, false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(apiUser.Username);

                var claims = new[]
                {
                    new Claim(BudgieClaimTypes.SubjectId, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName)
                };

                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

                var token = new JwtSecurityToken(
                    issuer: "budgie.com",
                    audience: "budgie.com",
                    claims: claims,
                    expires: DateTime.UtcNow.AddMonths(1),
                    signingCredentials: creds);

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                return new JsonResult(new
                {
                    Id = user.Id,
                    Username = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Token = tokenString
                });
            }

            return new BadRequestResult();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody]ApiUser apiUser)
        {
            var user = new User
            {
                Email = apiUser.Username,
                UserName = apiUser.Username,
                FirstName = apiUser.FirstName,
                LastName = apiUser.LastName
            };

            try
            {
                var result = await _userManager.CreateAsync(user, apiUser.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, BudgieRoles.User);
                    return new OkResult();
                }
                else
                {
                    var message = string.Join(",", result.Errors.Select(x => x.Description));
                    return new BadRequestObjectResult(message);
                }
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
    }
}