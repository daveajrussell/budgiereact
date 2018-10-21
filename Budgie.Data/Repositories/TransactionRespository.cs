using Budgie.Core;
using Budgie.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class TransactionRepository : EFRepository<Transaction>, ITransactionRepository
{
    public TransactionRepository(DbContext dbContext, HttpContext httpContext) : base(dbContext, httpContext)
    {

    }

    public override IQueryable<Transaction> GetAll()
    {
        return DbSet.Where(x => x.UserId == UserId);
    }

    public override async Task<Transaction> GetByIdAsync(int id)
    {
        return await DbSet.Where(x => x.UserId == UserId)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();
    }
}