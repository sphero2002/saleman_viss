using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class OrderDelivery
{
    public string OrderTrackingCode { get; set; } = null!;

    public int TotalPrice { get; set; }

    public string PriceUnit { get; set; } = null!;

    public string OrderStatus { get; set; } = null!;

    public string CustomerName { get; set; } = null!;

    public string OrderFrom { get; set; } = null!;

    public string ProductName { get; set; } = null!;

    public string AttributeGroup { get; set; } = null!;

    public int Price { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public string DeliveryTrackingCode { get; set; } = null!;

    public DateTime PickupTime { get; set; }

    public DateTime? DeliveryTime { get; set; }

    public int DeliveryPrice { get; set; }

    public string ReceivingAddresses { get; set; } = null!;

    public string PickupAddress { get; set; } = null!;

    public string? PromotionCode { get; set; }
}
