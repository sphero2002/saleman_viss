namespace VissSoft.SalesMan.Admin.API.DTOs
{
    public class ProductPriceStateDto
    {


        public int QuantityPercent { get; set; }

        public int Price { get; set; }

        public string PriceUnit { get; set; } = null!;

        public string Name { get; set; } = null!;

        public int IsChoosen { get; set; }
        public int Default { get; set; }
    }
}
