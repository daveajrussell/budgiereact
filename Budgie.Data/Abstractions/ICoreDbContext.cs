using Budgie.Core;
using Microsoft.EntityFrameworkCore;

namespace Budgie.Data.Abstractions
{
    public interface ICoreDbContext
    {
        /* Core */
        DbSet<User> Users { get; set; }
        DbSet<Budget> Budgets { get; set; }
        DbSet<Income> Incomes { get; set; }
        DbSet<Outgoing> Outgoings { get; set; }
        DbSet<Saving> Savings { get; set; }
        DbSet<Category> Categories { get; set; }
        DbSet<Transaction> Transactions { get; set; }
        DbSet<Role> Roles { get; set; }
    }
}
