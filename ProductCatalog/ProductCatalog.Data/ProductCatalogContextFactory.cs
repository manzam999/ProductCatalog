using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ProductCatalog.Data
{
    public class ProductCatalogContextFactory : IDesignTimeDbContextFactory<ProductCatalogContext>
    {
        public ProductCatalogContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ProductCatalogContext>();

            return new ProductCatalogContext(optionsBuilder.Options);
        }
    }
}
