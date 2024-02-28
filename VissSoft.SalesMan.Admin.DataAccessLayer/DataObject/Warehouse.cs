using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Warehouse
{
    public int Id { get; set; }

    public int AddressId { get; set; }

    public string NameWarehouse { get; set; } = null!;

    public virtual Address Address { get; set; } = null!;

    public virtual ICollection<StoreWarehouse> StoreWarehouses { get; set; } = new List<StoreWarehouse>();

    public virtual ICollection<SupplierInventory> SupplierInventories { get; set; } = new List<SupplierInventory>();

    public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; } = new List<WarehouseProduct>();
}
