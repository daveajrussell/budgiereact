using System;
using Budgie.Data.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Budgie.Data.Helpers
{
    public class RepositoryProvider : IRepositoryProvider
    {
        protected Dictionary<Type, object> Repositories { get; }

        private readonly RepositoryFactories _repositoryFactories;

        public RepositoryProvider(RepositoryFactories repositoryFactories)
        {
            _repositoryFactories = repositoryFactories;
            Repositories = new Dictionary<Type, object>();
        }

        public IRepository<T> GetRepositoryForEntityType<T>(DbContext context, HttpContext httpContext) where T : class
        {
            return GetRepository<IRepository<T>>(context, httpContext, _repositoryFactories.GetRepositoryFactoryForEntityType<T>());
        }

        public virtual T GetRepository<T>(DbContext context, HttpContext httpContext, Func<DbContext, HttpContext, object> factory = null) where T : class
        {
            Repositories.TryGetValue(typeof(T), out object repoObj);

            if (repoObj != null)
                return (T) repoObj;

            return MakeRepository<T>(factory, context, httpContext);
        }

        protected virtual T MakeRepository<T>(Func<DbContext, HttpContext, object> factory, DbContext dbContext, HttpContext httpContext)
        {
            var f = factory ?? _repositoryFactories.GetRepositoryFactory<T>();

            if (f == null)
                throw new NotImplementedException("No factory for repository type, " + typeof(T).FullName);

            var repo = (T) f(dbContext, httpContext);

            Repositories[typeof(T)] = repo;

            return repo;
        }
    }
}