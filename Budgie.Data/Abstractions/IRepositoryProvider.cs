using System;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Budgie.Data.Abstractions
{
    public interface IRepositoryProvider
    {
        IRepository<T> GetRepositoryForEntityType<T>(DbContext context, HttpContext httpContext) where T : class;

        T GetRepository<T>(DbContext context, HttpContext httpContext, Func<DbContext, HttpContext, object> factory = null) where T : class;
    }
}