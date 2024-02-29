namespace VissSoft.SalesMan.Admin.API.DTOs.Request
{
    public class UpdateProductAttributeGroupRequest
    {
        public int ProductId { get; set; }
        public List<int> AttributeGroupId { get; set; }
    }
}
