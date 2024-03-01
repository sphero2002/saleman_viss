namespace VissSoft.SalesMan.Admin.API.DTOs.Request
{
    public class ProductRequestDto
    {

        public string Sku { get; set; } = null!;

        public string Name { get; set; } = null!;

        public int Weight { get; set; }

        public string Description { get; set; } = null!;

        public int Height { get; set; }

        public int Length { get; set; }

        public int Width { get; set; }

        public int Depth { get; set; }

        public string UnitOfLength { get; set; } = null!;

        public string Label { get; set; } = null!;

        public List<int> ImageId { get; set; } = null;

        public List<int> listCategporyValueId { get; set; }

        public List<AttributeGroupDto> AttributeGroups { get; set; }
    }
}
