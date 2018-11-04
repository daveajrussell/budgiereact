using System;
using System.Linq;
using Budgie.Core;
using Budgie.Core.Constants;
using Budgie.Data.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Budgie.Data.Helpers
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<BudgieDbContext>();
            var userService = serviceProvider.GetRequiredService<UserManager<User>>();

            context.Database.EnsureCreated();

            if (!context.Roles.Any())
            {
                context.Roles.Add(new Role { Name = BudgieRoles.Admin, NormalizedName = BudgieRoles.Admin.ToUpper() });
                context.Roles.Add(new Role { Name = BudgieRoles.User, NormalizedName = BudgieRoles.User.ToUpper() });
                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                var user = new User
                {
                    UserName = "test@budgie.com",
                    Email = "test@budgie.com",
                    FirstName = "Dave",
                    LastName = "Russell"
                };

                userService.CreateAsync(user, "Testing1!");
                userService.AddToRoleAsync(user, BudgieRoles.User);
            }
        }
    }
}
