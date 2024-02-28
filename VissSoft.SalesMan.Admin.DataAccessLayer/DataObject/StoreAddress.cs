using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class StoreAddress
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public int AddressId { get; set; }

    public virtual Address Address { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
