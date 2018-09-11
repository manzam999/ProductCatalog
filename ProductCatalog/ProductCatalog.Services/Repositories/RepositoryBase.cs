using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Data;
using ProductCatalog.Data.Entities;
using ProductCatalog.Services.Interfaces.Repositories;

namespace ProductCatalog.Services.Repositories
{
    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : EntityBase
    {
        private readonly ProductCatalogContext _context;
        private readonly DbSet<TEntity> _set;

        public RepositoryBase(ProductCatalogContext context)
        {
            _context = context;
            _set = context.Set<TEntity>();
        }

        public IEnumerable<TEntity> GetAll(int? page = null)
        {
            if (page.HasValue)
            {
                return _set.AsNoTracking();
            }

            return _set.AsNoTracking().AsEnumerable();
        }

        public IEnumerable<TEntity> GetAll(Expression<Func<TEntity, bool>> expression)
        {
            return _set.AsNoTracking().Where(expression).AsEnumerable();
        }

        public async Task<TEntity> GetByIdAsync(int id)
        {
            return await _set
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<TEntity> CreateAsync(TEntity entity)
        {
            var createdEntity = _set.AddAsync(entity);
            await _context.SaveChangesAsync();

            return (await createdEntity).Entity;
        }

        public async Task<TEntity> UpdateAsync(int id, TEntity entity)
        {
            if (await GetByIdAsync(id) != null)
            {
                entity.Id = id;
                entity.LastUpdated = DateTime.Now;
                var updatedEntity = _set.Update(entity);
                await _context.SaveChangesAsync();

                return updatedEntity.Entity;
            }

            return null;
        }

        public async Task DeleteAsync(int id)
        {
            _set.Remove(await GetByIdAsync(id));

            await _context.SaveChangesAsync();
        }
    }
}
