using System;
using System.Linq;
using Budgie.Core;
using Budgie.Core.Constants;
using Budgie.Data.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Budgie.Data.Helpers
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<BudgieDbContext>();
            context.Database.EnsureCreated();
            if (!context.Roles.Any())
            {
                context.Roles.Add(new Role { Name = BudgieRoles.Admin, NormalizedName = BudgieRoles.Admin.ToUpper() });
                context.Roles.Add(new Role { Name = BudgieRoles.User, NormalizedName = BudgieRoles.User.ToUpper() });
                context.SaveChanges();
            }
        }
    }
}
