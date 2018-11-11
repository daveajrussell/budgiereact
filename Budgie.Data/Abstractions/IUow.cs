using Budgie.Core;
using System.Threading.Tasks;

namespace Budgie.Data.Abstractions
{
    public interface IUow
    {
        void Commit();
        Task CommitAsync();

        IRepository<User> Users { get; }
        IBudgetRepository Budgets { get; }
        ICategoryRepository Categories { get; }
        IRepository<Outgoing> Outgoings { get; }
        ITransactionRepository Transactions { get; }
    }
}