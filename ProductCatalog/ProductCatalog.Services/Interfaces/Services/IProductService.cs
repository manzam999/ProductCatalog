using System.IO;

namespace ProductCatalog.Services.Interfaces.Services
{
    public interface IProductService
    {
        Stream Export();
    }
}
