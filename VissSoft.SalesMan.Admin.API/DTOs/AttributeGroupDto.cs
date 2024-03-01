namespace VissSoft.SalesMan.Admin.API.DTOs
{
    public class AttributeGroupDto
    {
        public string Name { get; set; } 

        public string Sku { get; set; }

        public List<int> imageId { get; set; }

        public List<int> listAttributeValueId { get; set; }

        public int Quantity { get; set; }

        public List<ProductPriceStateDto> productPriceState { get; set; }
    }
}
