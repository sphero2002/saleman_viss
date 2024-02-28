using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class StatusesOfOrder
{
    public int Id { get; set; }

    public string Status { get; set; } = null!;

    public virtual ICollection<OrderStatus> OrderStatuses { get; set; } = new List<OrderStatus>();

    public virtual ICollection<SupplierOrderStatus> SupplierOrderStatuses { get; set; } = new List<SupplierOrderStatus>();
}
