using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SupplierInventory
{
    public int Id { get; set; }

    public int SupplierId { get; set; }

    public int InventotyId { get; set; }

    public virtual Warehouse Inventoty { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
