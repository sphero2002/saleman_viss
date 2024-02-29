namespace VissSoft.SalesMan.Admin.API.DTOs.Response
{
    public class AttributeGroupValueDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Sku { get; set; } = null!;

        public int IsDeleted { get; set; }

        public List<AttributeResponseDto> attributeResponseDtos { get; set; }
    }
}
