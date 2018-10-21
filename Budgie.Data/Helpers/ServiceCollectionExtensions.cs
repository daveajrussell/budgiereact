using Budgie.Data.Abstractions;
using Budgie.Data.Factories;
using Budgie.Data.Services;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;

namespace Budgie.Data.Helpers
{
    public static class ServiceCollectionExtensionMethods
    {
        public static void AddDataLayer(this IServiceCollection services)
        {
            services.AddScoped<RepositoryFactories>();
            services.AddScoped<IDesignTimeDbContextFactory<BudgieDbContext>, BudgieDbContextFactory>();
            services.AddTransient<IRepositoryProvider, RepositoryProvider>();
            services.AddTransient<IUow, Uow>();
        }

        public static void AddDevelopmentDataLayer(this IServiceCollection services)
        {
            services.AddScoped<RepositoryFactories>();
            services.AddTransient<IRepositoryProvider, RepositoryProvider>();
            services.AddTransient<IUow, Uow>();
        }
    }
}
