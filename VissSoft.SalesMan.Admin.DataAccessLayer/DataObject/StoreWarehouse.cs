using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class StoreWarehouse
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public int WarehouseId { get; set; }

    public virtual Store Store { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
