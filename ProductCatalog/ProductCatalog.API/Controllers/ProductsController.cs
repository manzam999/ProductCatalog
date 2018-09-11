using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using ProductCatalog.API.Controllers.Base;
using ProductCatalog.Data.Entities;
using ProductCatalog.Services.Interfaces.Repositories;
using ProductCatalog.Services.Interfaces.Services;
using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace ProductCatalog.API.Controllers
{
    [EnableCors("ProductCatalogPolicy")]
    public class ProductsController : ApiControllerBase<Product>
    {
        private readonly IProductService _productService;
        private readonly IFileService _fileService;
        private readonly IRepositoryBase<Product> _productRepository;

        public ProductsController(IRepositoryBase<Product> productRepository, IProductService productService, IFileService fileService) : base(productRepository)
        {
            _productService = productService;
            _fileService = fileService;
            _productRepository = productRepository;
        }

        [HttpGet]
        public new IActionResult Get(string search = null)
        {
            if (string.IsNullOrEmpty(search))
            {
                return Ok(_productRepository.GetAll());
            }

            return Ok(_productRepository.GetAll(p => p.Code.Contains(search)));
        }

        [HttpGet]
        [Route("Export")]
        public IActionResult Export()
        {
            var exportFile = _productService.Export();

            return File(exportFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Products.xlsx");
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var form = Request.Form;

            if (!form.TryGetValue("Code", out StringValues code) 
                || !form.TryGetValue("Name", out StringValues name) 
                || !form.TryGetValue("Price", out StringValues price))
            {
                return BadRequest();
            }

            var product = new Product
            {
                Code = code.ToString(),
                Name = name.ToString(),
                Price = Convert.ToDecimal(price.ToString(), new NumberFormatInfo { NumberDecimalSeparator = "." })
            };

            if (!TryValidateModel(product))
            {
                return BadRequest(ModelState);
            }

            if (_productRepository.GetAll(p => p.Code == product.Code).Count() > 0)
            {
                ModelState.AddModelError("Code", "Code must be unique");
                return BadRequest(ModelState);
            }

            var reference = form.Files.Count > 0 ? await _fileService.Upload(form.Files[0].OpenReadStream()) : null;
            product.Photo = reference;
            var createdEntity = await _productRepository.CreateAsync(product);

            return Created(new Uri($"{Request.Path}/{createdEntity.Id}", UriKind.Relative), createdEntity);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Put(int id)
        {
            var form = Request.Form;

            if (!form.TryGetValue("Code", out StringValues code)
                || !form.TryGetValue("Name", out StringValues name)
                || !form.TryGetValue("Price", out StringValues price))
            {
                return BadRequest();
            }

            var updateProduct = new Product
            {
                Id = id,
                Code = code.ToString(),
                Name = name.ToString(),
                Price = Convert.ToDecimal(price.ToString(), new NumberFormatInfo { NumberDecimalSeparator = "." })
            };

            if (!TryValidateModel(updateProduct))
            {
                return BadRequest(ModelState);
            }

            if (_productRepository.GetAll(p => p.Code == updateProduct.Code && p.Id != id).Count() > 0)
            {
                ModelState.AddModelError("Code", "Code must be unique");
                return BadRequest(ModelState);
            }

            form.TryGetValue("Photo", out StringValues reference);

            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            if (form.Files.Count > 0)
            {
                _fileService.Delete(product.Photo);
                reference = await _fileService.Upload(form.Files[0].OpenReadStream());
            }
            else if (form.Files.Count == 0 && string.IsNullOrEmpty(reference))
            {
                _fileService.Delete(product.Photo);
            }
            else
            {
                reference = product.Photo;
            }

            updateProduct.Photo = reference;

            await _productRepository.UpdateAsync(id, updateProduct);

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public async new Task<IActionResult> Delete(int id)
        {
            var photoReference = (await _productRepository.GetByIdAsync(id))?.Photo;

            if (!string.IsNullOrEmpty(photoReference))
            {
                _fileService.Delete(photoReference);
            }

            return await base.Delete(id);
        }
    }
}
