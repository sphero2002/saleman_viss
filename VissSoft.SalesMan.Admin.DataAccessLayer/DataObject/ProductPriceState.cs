using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class ProductPriceState
{
    public int Id { get; set; }

    public int AttributeGroupId { get; set; }

    public int QuantityPercent { get; set; }

    public int Price { get; set; }

    public string PriceUnit { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual AttributeGroup AttributeGroup { get; set; } = null!;

    public virtual ICollection<ProductPrice> ProductPrices { get; set; } = new List<ProductPrice>();
}
