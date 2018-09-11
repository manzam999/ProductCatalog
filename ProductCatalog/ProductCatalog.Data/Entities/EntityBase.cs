using System;

namespace ProductCatalog.Data.Entities
{
    public class EntityBase
    {
        public int Id { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
