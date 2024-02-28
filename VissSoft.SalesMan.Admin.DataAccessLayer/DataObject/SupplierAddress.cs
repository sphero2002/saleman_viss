using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SupplierAddress
{
    public int Id { get; set; }

    public int SupplierId { get; set; }

    public int AddressId { get; set; }

    public virtual Address Address { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
