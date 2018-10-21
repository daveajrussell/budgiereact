using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Budgie.Data.Helpers
{
    public class RepositoryFactories
    {
        public RepositoryFactories()
        {
            _repositoryFactories = GetBudgieFactories();
        }

        private IDictionary<Type, Func<DbContext, HttpContext, object>> GetBudgieFactories()
        {
            return new Dictionary<Type, Func<DbContext, HttpContext, object>>
            { 
                { typeof(IBudgetRepository), (dbContext, httpContext) => new BudgetRepository(dbContext, httpContext) },
                { typeof(ICategoryRepository), (dbContext, httpContext) => new CategoryRepository(dbContext, httpContext) },
                { typeof(ITransactionRepository), (dbContext, httpContext) => new TransactionRepository(dbContext, httpContext) }
            };
        }

        private readonly IDictionary<Type, Func<DbContext, HttpContext, object>> _repositoryFactories;

        public Func<DbContext, HttpContext, object> GetRepositoryFactory<T>()
        {
            _repositoryFactories.TryGetValue(typeof(T), out Func<DbContext, HttpContext, object> factory);

            return factory;
        }

        public Func<DbContext, HttpContext, object> GetRepositoryFactoryForEntityType<T>() where T : class
        {
            return GetRepositoryFactory<T>() ?? DefaultEntityRepositoryFactory<T>();
        }

        protected virtual Func<DbContext, HttpContext, object> DefaultEntityRepositoryFactory<T>() where T : class
        {
            return (dbContext, httpContext) => new EFRepository<T>(dbContext, httpContext);
        }
    }
}