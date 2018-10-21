using Budgie.Core;
using Budgie.Data.Abstractions;
using System.Threading.Tasks;

public interface IBudgetRepository : IRepository<Budget>
{
    Task<Budget> GetBudget(int year, int month);
}