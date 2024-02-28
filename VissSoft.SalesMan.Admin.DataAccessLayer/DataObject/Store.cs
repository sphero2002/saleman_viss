using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Store
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Manager { get; set; }

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    public virtual ICollection<StaffUser> StaffUsers { get; set; } = new List<StaffUser>();

    public virtual ICollection<StoreAddress> StoreAddresses { get; set; } = new List<StoreAddress>();

    public virtual ICollection<StoreImage> StoreImages { get; set; } = new List<StoreImage>();

    public virtual ICollection<StorePromotion> StorePromotions { get; set; } = new List<StorePromotion>();

    public virtual ICollection<StoreWarehouse> StoreWarehouses { get; set; } = new List<StoreWarehouse>();

    public virtual ICollection<SupplierOrder> SupplierOrders { get; set; } = new List<SupplierOrder>();
}
