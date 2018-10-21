using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Budgie.Data.Abstractions
{
	public interface IRepository<T> where T : class
	{
		IQueryable<T> GetAll();
		T GetById(int id);
		Task<T> GetByIdAsync(int id);
		void Add(T entity);
		Task AddAsync(T entity);
		Task AddRangeAsync(IEnumerable<T> entities);
		void Update(T entity);
		void Delete(T entity);
		void Delete(int id);
	}
}
