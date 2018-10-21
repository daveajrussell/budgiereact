using Budgie.Core;
using Budgie.Data.Abstractions;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Budgie.Data.Services
{
    public class BudgieDbContext : IdentityDbContext<User, Role, int>, ICoreDbContext
    {
        /* Core */
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Outgoing> Outgoings { get; set; }
        public DbSet<Saving> Savings { get; set; }

        public BudgieDbContext(DbContextOptions<BudgieDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasMany(b => b.Budgets).WithOne(u => u.User)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Budget>().HasMany(i => i.Incomes).WithOne(b => b.Budget)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Budget>().HasMany(o => o.Outgoings).WithOne(b => b.Budget)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Budget>().HasMany(s => s.Savings).WithOne(b => b.Budget)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Budget>().HasMany(t => t.Transactions).WithOne(b => b.Budget)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Transaction>().HasOne(c => c.Category).WithMany(t => t.Transactions)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(builder);
        }
    }
}
