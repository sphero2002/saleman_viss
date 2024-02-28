using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SupplierOrderStatus
{
    public int Id { get; set; }

    public int SupplierOrderId { get; set; }

    public int StatusId { get; set; }

    public virtual StatusesOfOrder Status { get; set; } = null!;

    public virtual SupplierOrder SupplierOrder { get; set; } = null!;
}
