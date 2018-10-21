using System;
using Budgie.Core;
using Budgie.Data.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace Budgie.Data.Services
{
    public class Uow : IUow, IDisposable
    {
        private BudgieDbContext DbContext { get; }

        private HttpContext HttpContext { get; }

        protected IRepositoryProvider RepositoryProvider { get; set; }

        /* Core */
        public IRepository<User> Users => GetStandardRepo<User>();
        public IBudgetRepository Budgets => GetRepo<IBudgetRepository>();
        public ICategoryRepository Categories => GetRepo<ICategoryRepository>();
        public ITransactionRepository Transactions => GetRepo<ITransactionRepository>();
        public IRepository<Income> Incomes => GetStandardRepo<Income>();
        public IRepository<Outgoing> Outgoings => GetStandardRepo<Outgoing>();
        public IRepository<Saving> Savings => GetStandardRepo<Saving>();

        public Uow(IRepositoryProvider repositoryProvider, BudgieDbContext budgieDbContext, IHttpContextAccessor httpContextAccessor)
        {
            RepositoryProvider = repositoryProvider;
            DbContext = budgieDbContext;
            HttpContext = httpContextAccessor.HttpContext;
        }

        protected T GetRepo<T>() where T : class
        {
            return RepositoryProvider.GetRepository<T>(DbContext, HttpContext);
        }

        protected IRepository<T> GetStandardRepo<T>() where T : class
        {
            return RepositoryProvider.GetRepositoryForEntityType<T>(DbContext, HttpContext);
        }

        public void Commit()
        {
            DbContext.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await DbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                DbContext?.Dispose();
            }
        }
    }
}