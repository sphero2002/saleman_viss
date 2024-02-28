using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class OrderPayment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int PaymentId { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Payment Payment { get; set; } = null!;
}
