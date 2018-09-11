using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProductCatalog.Data;
using ProductCatalog.Data.Entities;
using ProductCatalog.Services.Interfaces.Repositories;
using ProductCatalog.Services.Interfaces.Services;
using ProductCatalog.Services.Repositories;
using ProductCatalog.Services.Services;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.Cors;

namespace ProductCatalog.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "ProductCatalog API", Version = "v1" });
            });

            services.AddCors(o => o.AddPolicy("ProductCatalogPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            services.AddDbContext<ProductCatalogContext>();
            services.AddTransient<IRepositoryBase<Product>, RepositoryBase<Product>>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<IFileService>(s => new FileService(Configuration["FirebaseStoragePath"]));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors("ProductCatalogPolicy");
            app.UseStaticFiles();
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint(Configuration["AppSettings:VirtualDirectory"] + "/swagger/v1/swagger.json", "ProductCatalog API");
            });

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
