using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class WarehouseProduct
{
    public int Id { get; set; }

    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public int AttributeGroupId { get; set; }

    public int Quantity { get; set; }

    public virtual AttributeGroup AttributeGroup { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
