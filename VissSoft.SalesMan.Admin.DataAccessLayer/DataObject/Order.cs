using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Order
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public int OrderFromId { get; set; }

    public int? StaffId { get; set; }

    public string OrderTrackingCode { get; set; } = null!;

    public int Quantity { get; set; }

    public int TotalPrice { get; set; }

    public string PriceUnit { get; set; } = null!;

    public string? Note { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<OrderDeliveryPrice> OrderDeliveryPrices { get; set; } = new List<OrderDeliveryPrice>();

    public virtual OrderFrom OrderFrom { get; set; } = null!;

    public virtual ICollection<OrderPayment> OrderPayments { get; set; } = new List<OrderPayment>();

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public virtual ICollection<OrderPromotion> OrderPromotions { get; set; } = new List<OrderPromotion>();

    public virtual ICollection<OrderStatus> OrderStatuses { get; set; } = new List<OrderStatus>();

    public virtual ICollection<OrderTax> OrderTaxes { get; set; } = new List<OrderTax>();

    public virtual StaffUser? Staff { get; set; }
}
