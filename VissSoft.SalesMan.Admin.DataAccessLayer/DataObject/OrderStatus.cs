using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class OrderStatus
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int StatusId { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual StatusesOfOrder Status { get; set; } = null!;
}
