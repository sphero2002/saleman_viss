using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Carrier
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public int ManagerId { get; set; }

    public virtual ICollection<DeliveryShipper> DeliveryShippers { get; set; } = new List<DeliveryShipper>();

    public virtual ICollection<Shipper> Shippers { get; set; } = new List<Shipper>();
}
