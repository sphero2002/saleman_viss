using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class StaffUser
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int StoreId { get; set; }

    public string Possition { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Store Store { get; set; } = null!;
}
