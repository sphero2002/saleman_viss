using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class DeliveryPriceRate
{
    public int Id { get; set; }

    public int FromDistance { get; set; }

    public int ToDistance { get; set; }

    public string DistanceUnit { get; set; } = null!;

    public int Price { get; set; }

    public string PriceUnit { get; set; } = null!;

    public virtual ICollection<OrderDeliveryPrice> OrderDeliveryPrices { get; set; } = new List<OrderDeliveryPrice>();
}
