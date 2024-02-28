using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class OrderDeliveryPrice
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int DeliveryId { get; set; }

    public string? Note { get; set; }

    public int? DeliveryPriceId { get; set; }

    public virtual Delivery Delivery { get; set; } = null!;

    public virtual DeliveryPriceRate? DeliveryPrice { get; set; }

    public virtual Order Order { get; set; } = null!;
}
