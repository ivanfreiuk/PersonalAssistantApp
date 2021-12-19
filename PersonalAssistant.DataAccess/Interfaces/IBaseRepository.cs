using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PersonalAssistant.DataAccess.Interfaces
{
    public interface IBaseRepository<TEntity> where TEntity : class, new()
    {
        public ValueTask<TEntity> GetAsync(int id);

        public Task<IEnumerable<TEntity>> GetAllAsync();

        public Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);

        public Task AddAsync(TEntity entity);

        public Task AddRangeAsync(IEnumerable<TEntity> entities);

        public Task UpdateAsync(TEntity entity);

        public Task RemoveAsync(TEntity entity);
    }
}
