using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Supplier
{
    public int Id { get; set; }

    public int Name { get; set; }

    public int ManagerId { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<SupplierAddress> SupplierAddresses { get; set; } = new List<SupplierAddress>();

    public virtual ICollection<SupplierImage> SupplierImages { get; set; } = new List<SupplierImage>();

    public virtual ICollection<SupplierInventory> SupplierInventories { get; set; } = new List<SupplierInventory>();

    public virtual ICollection<SupplierOrder> SupplierOrders { get; set; } = new List<SupplierOrder>();
}
