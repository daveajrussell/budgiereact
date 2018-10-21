using Budgie.Core;
using Budgie.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class BudgetRepository : EFRepository<Budget>, IBudgetRepository
{
    public BudgetRepository(DbContext dbContext, HttpContext httpContext) : base(dbContext, httpContext)
    {

    }

    public async Task<Budget> GetBudget(int year, int month)
    {
        return await DbSet
            .Include(x => x.Incomes).ThenInclude(y => y.Category)
            .Include(x => x.Outgoings).ThenInclude(y => y.Category)
            .Include(x => x.Savings).ThenInclude(y => y.Category)
            .Include(x => x.Transactions)
            .Where(x => x.UserId == UserId)
            .Where(x => x.Year == year)
            .Where(x => x.Month == month)
            .FirstOrDefaultAsync();
    }
}