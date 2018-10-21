using Budgie.Core;
using Budgie.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class CategoryRepository : EFRepository<Category>, ICategoryRepository
{
    public CategoryRepository(DbContext dbContext, HttpContext httpContext) : base(dbContext, httpContext)
    {

    }

    public override IQueryable<Category> GetAll()
    {
        return DbSet.Where(x => x.UserId == UserId);
    }

    public override async Task<Category> GetByIdAsync(int id)
    {
        return await DbSet.Where(x => x.UserId == UserId)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();
    }
}