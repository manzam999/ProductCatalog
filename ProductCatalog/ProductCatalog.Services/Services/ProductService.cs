using System.IO;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using ProductCatalog.Data.Entities;
using ProductCatalog.Services.Interfaces.Repositories;
using ProductCatalog.Services.Interfaces.Services;

namespace ProductCatalog.Services.Services
{
    public class ProductService : IProductService
    {
        private readonly IRepositoryBase<Product> _productRepository;

        public ProductService(IRepositoryBase<Product> productRepository)
        {
            _productRepository = productRepository;
        }

        public Stream Export()
        {
            var products = _productRepository.GetAll();

            var workbook = new XSSFWorkbook();
            var sheet = workbook.CreateSheet("Products");
            var numRows = 0;
            var headerRow = sheet.CreateRow(numRows);

            headerRow.CreateCell(0, CellType.String).SetCellValue("Id");
            headerRow.CreateCell(1, CellType.String).SetCellValue("Code");
            headerRow.CreateCell(2, CellType.String).SetCellValue("Name");
            headerRow.CreateCell(3, CellType.String).SetCellValue("Price");
            headerRow.CreateCell(4, CellType.String).SetCellValue("Last Updated");
            numRows++;

            foreach (var product in products)
            {
                var dataRow = sheet.CreateRow(numRows);
                dataRow.CreateCell(0, CellType.String).SetCellValue(product.Id);
                dataRow.CreateCell(1, CellType.String).SetCellValue(product.Code);
                dataRow.CreateCell(2, CellType.String).SetCellValue(product.Name);
                dataRow.CreateCell(3, CellType.Numeric).SetCellValue((double)product.Price);
                dataRow.CreateCell(4, CellType.String).SetCellValue(product.LastUpdated?.ToString("yyyy-mm-dd"));
                numRows++;
            }

            sheet.AutoSizeColumn(4);

            var stream = new NpoiMemoryStream
            {
                AllowClose = false
            };

            workbook.Write(stream);
            stream.Flush();
            stream.Seek(0, SeekOrigin.Begin);
            stream.AllowClose = true;

            return stream;
        }

        private class NpoiMemoryStream : MemoryStream
        {
            public NpoiMemoryStream()
            {
                AllowClose = true;
            }

            public bool AllowClose { get; set; }

            public override void Close()
            {
                if (AllowClose)
                {
                    base.Close();
                }
            }
        }
    }
}
