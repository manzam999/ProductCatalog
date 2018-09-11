using System;
using System.IO;
using System.Linq;
using Firebase.Storage;
using ProductCatalog.Services.Interfaces.Services;

namespace ProductCatalog.Services.Services
{
    public class FileService : IFileService
    {
        private readonly FirebaseStorage _firebaseStorage;

        public FileService(string path)
        {
            _firebaseStorage = new FirebaseStorage(path);
        }

        public FirebaseStorageTask Upload(Stream stream)
        {
            return _firebaseStorage
                .Child($"{Guid.NewGuid()}")
                .PutAsync(stream);
        }

        public void Delete(string reference)
        {
            if (reference.StartsWith("http"))
            {
                reference = reference.Split("/").Last().Split("?").First();
            }

            _firebaseStorage
                .Child(reference)
                .DeleteAsync();
        }
    }
}
