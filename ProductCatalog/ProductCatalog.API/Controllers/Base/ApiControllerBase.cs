using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Data.Entities;
using ProductCatalog.Services.Interfaces.Repositories;
using System;
using System.Threading.Tasks;

namespace ProductCatalog.API.Controllers.Base
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class ApiControllerBase<TEntity> : ControllerBase where TEntity : EntityBase
    {
        private readonly IRepositoryBase<TEntity> _repository;

        public ApiControllerBase(IRepositoryBase<TEntity> repository) : base()
        {
            _repository = repository;
        }

        [HttpGet]
        protected IActionResult Get(string search = null)
        {
            return Ok(_repository.GetAll());
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
            {
                return NotFound();
            }

            return Ok(entity);
        }

        [HttpPost]
        protected async Task<IActionResult> Post(TEntity entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var createdEntity = await _repository.CreateAsync(entity);

            return Created(new Uri($"{Request.Path}/{createdEntity.Id}", UriKind.Relative), createdEntity);
        }

        [HttpPut]
        [Route("{id}")]
        protected async Task<IActionResult> Put(int id, [FromBody] TEntity entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var updateEntity = await _repository.UpdateAsync(id, entity);

            if (updateEntity == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        protected async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}
