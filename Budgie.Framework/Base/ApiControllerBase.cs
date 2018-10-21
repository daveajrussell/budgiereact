using System;
using Budgie.Core;
using Budgie.Core.Contracts.Security;
using Budgie.Framework.Models;
using Budgie.Framework.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Budgie.Framework.Base
{
    [SecurityHeaders]
    public abstract class ApiControllerBase
    {
        private readonly ITokenResolverMiddleware _tokenResolver;

        public ApiControllerBase(ITokenResolverMiddleware tokenResolver)
        {
            _tokenResolver = tokenResolver;
        }

        [ActionContext]
        public ActionContext ActionContext { get; set; }

        public HttpContext HttpContext => ActionContext?.HttpContext;

        public HttpRequest Request => ActionContext?.HttpContext?.Request;

        public HttpResponse Response => ActionContext?.HttpContext?.Response;

        public IServiceProvider Resolver => ActionContext?.HttpContext?.RequestServices;

        private User _currentUser;

        public Token Token
        {
            get
            {
                if (_currentUser == null)
                    _currentUser = _tokenResolver.ResolveAsync().Result;

                return new Token
                {
                    UserId = _currentUser.Id
                };
            }
        }
    }
}