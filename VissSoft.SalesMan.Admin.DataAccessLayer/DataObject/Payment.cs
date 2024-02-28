using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Payment
{
    public int Id { get; set; }

    public int PaymentMethodId { get; set; }

    public int PaymentStatusId { get; set; }

    public int Value { get; set; }

    public string ValueUnit { get; set; } = null!;

    public DateTime UpdateTime { get; set; }

    public virtual ICollection<OrderPayment> OrderPayments { get; set; } = new List<OrderPayment>();

    public virtual PaymentMethod PaymentMethod { get; set; } = null!;

    public virtual PaymentStatus PaymentStatus { get; set; } = null!;
}
