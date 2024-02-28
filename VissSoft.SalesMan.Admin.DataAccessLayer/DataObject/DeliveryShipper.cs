using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class DeliveryShipper
{
    public int Id { get; set; }

    public int DeliveryId { get; set; }

    public int ShipperId { get; set; }

    public int CarrierId { get; set; }

    public virtual Carrier Carrier { get; set; } = null!;

    public virtual Delivery Delivery { get; set; } = null!;

    public virtual Shipper Shipper { get; set; } = null!;
}
