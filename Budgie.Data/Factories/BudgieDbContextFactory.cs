using System.IO;
using Budgie.Data.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Budgie.Data.Factories
{
    public class BudgieDbContextFactory : IDesignTimeDbContextFactory<BudgieDbContext>
    {
        public BudgieDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true)
                .Build();

            var builder = new DbContextOptionsBuilder<BudgieDbContext>();

            var connectionString = configuration.GetSection("AppSettings:ConnectionString").Value;

            builder.UseSqlServer(connectionString);

            return new BudgieDbContext(builder.Options);
        }
    }
}