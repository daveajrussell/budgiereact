using System;
using System.Collections.Generic;
using System.Linq;
using Budgie.Core;
using Budgie.Core.Constants;
using Budgie.Core.Enums;
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

            var categories = new List<Category>()
            {
                new Category
                {
                    Name = "Groceries",
                    UserId = 1,
                    Type = CategoryType.Outgoing,
                    DateAdded = DateTime.UtcNow,
                    DateModified = DateTime.UtcNow,
                    ColourHex = "#ffb500"
                },
                new Category
                {
                    Name = "Gadgets",
                    UserId = 1,
                    Type = CategoryType.Outgoing,
                    DateAdded = DateTime.UtcNow,
                    DateModified = DateTime.UtcNow,
                    ColourHex = "#b490ff"
                }
            };

            if (!context.Categories.Any())
            {
                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }
    }
}