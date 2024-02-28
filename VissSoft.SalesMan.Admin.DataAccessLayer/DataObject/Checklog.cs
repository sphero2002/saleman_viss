using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Checklog
{
    public int Id { get; set; }

    public string Checklog1 { get; set; } = null!;

    public string UpdateTime { get; set; } = null!;

    public virtual ICollection<DeliveryChecklog> DeliveryChecklogs { get; set; } = new List<DeliveryChecklog>();
}
