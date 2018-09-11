using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.Data.Entities
{
    public class Product : EntityBase
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public string Name { get; set; }
        public string Photo { get; set; }
        [Required]
        [Range(0.0, double.MaxValue, ErrorMessage = "Price must be higher than 0")]
        public decimal Price { get; set; }
    }
}
