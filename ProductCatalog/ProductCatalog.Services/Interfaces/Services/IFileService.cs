using Firebase.Storage;
using System.IO;
using System.Threading.Tasks;

namespace ProductCatalog.Services.Interfaces.Services
{
    public interface IFileService
    {
        FirebaseStorageTask Upload(Stream stream);
        void Delete(string reference);
    }
}
