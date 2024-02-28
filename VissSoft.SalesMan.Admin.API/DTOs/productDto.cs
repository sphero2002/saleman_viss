namespace VissSoft.SalesMan.Admin.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Sku { get; set; } = null!;

        public string Name { get; set; } = null!;

        public int Weight { get; set; }

        public string Description { get; set; } = null!;

        public int Height { get; set; }

        public int Length { get; set; }

        public int Width { get; set; }

        public int Depth { get; set; }

        public string UnitLength { get; set; } = null!;

        public string Label { get; set; } = null!;

        public int? CreatorId { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int IsDeleted { get; set; }
    }
}
