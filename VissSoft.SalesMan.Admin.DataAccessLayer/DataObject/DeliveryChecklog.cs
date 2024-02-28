using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class DeliveryChecklog
{
    public int Id { get; set; }

    public int DeliveryId { get; set; }

    public int ChecklogId { get; set; }

    public virtual Checklog Checklog { get; set; } = null!;

    public virtual Delivery Delivery { get; set; } = null!;
}
