using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Address
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string? Ward { get; set; }

    public string? District { get; set; }

    public string? City { get; set; }

    public string? Provice { get; set; }

    public string Country { get; set; } = null!;

    public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; } = new List<CustomerAddress>();

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    public virtual ICollection<StoreAddress> StoreAddresses { get; set; } = new List<StoreAddress>();

    public virtual ICollection<SupplierAddress> SupplierAddresses { get; set; } = new List<SupplierAddress>();

    public virtual ICollection<Warehouse> Warehouses { get; set; } = new List<Warehouse>();
}
