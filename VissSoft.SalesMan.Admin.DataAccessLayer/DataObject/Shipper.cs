using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Shipper
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int? UserId { get; set; }

    public int CarrierId { get; set; }

    public virtual Carrier Carrier { get; set; } = null!;

    public virtual ICollection<DeliveryShipper> DeliveryShippers { get; set; } = new List<DeliveryShipper>();
}
