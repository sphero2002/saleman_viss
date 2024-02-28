using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class DeliveryStatus
{
    public int Id { get; set; }

    public int DeliveryId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime UpdateTime { get; set; }

    public virtual Delivery Delivery { get; set; } = null!;
}
