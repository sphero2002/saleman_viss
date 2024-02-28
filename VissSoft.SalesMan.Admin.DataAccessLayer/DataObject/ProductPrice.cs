using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class ProductPrice
{
    public int Id { get; set; }

    public int PriceId { get; set; }

    public int AttributeGroupId { get; set; }

    public virtual AttributeGroup AttributeGroup { get; set; } = null!;

    public virtual ProductPriceState Price { get; set; } = null!;
}
