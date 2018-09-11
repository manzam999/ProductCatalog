using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ProductCatalog.Data.Entities;
using System.IO;

namespace ProductCatalog.Data
{
    public class ProductCatalogContext : DbContext
    {
        public ProductCatalogContext() : base()
        {

        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasIndex(c => c.Code)
                .IsUnique()
                .HasName("AlternateKey_Code");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            optionsBuilder.UseSqlServer(config.GetConnectionString("ProductCatalogDatabase"));
            base.OnConfiguring(optionsBuilder);
        }
    }
}
