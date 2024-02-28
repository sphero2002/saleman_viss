using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SupplierOrder
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public int SupplierId { get; set; }

    public virtual Store Store { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;

    public virtual ICollection<SupplierOrderStatus> SupplierOrderStatuses { get; set; } = new List<SupplierOrderStatus>();
}
