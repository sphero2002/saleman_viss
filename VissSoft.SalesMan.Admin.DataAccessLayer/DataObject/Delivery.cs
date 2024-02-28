using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Delivery
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public int CustomerId { get; set; }

    public int AddressId { get; set; }

    public string DeliveryTrackingCode { get; set; } = null!;

    public DateTime PickupTime { get; set; }

    public DateTime? DeliveryTime { get; set; }

    public int SignId { get; set; }

    public string? Note { get; set; }

    public virtual Address Address { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<DeliveryChecklog> DeliveryChecklogs { get; set; } = new List<DeliveryChecklog>();

    public virtual ICollection<DeliveryProduct> DeliveryProducts { get; set; } = new List<DeliveryProduct>();

    public virtual ICollection<DeliveryShipper> DeliveryShippers { get; set; } = new List<DeliveryShipper>();

    public virtual ICollection<DeliveryStatus> DeliveryStatuses { get; set; } = new List<DeliveryStatus>();

    public virtual ICollection<OrderDeliveryPrice> OrderDeliveryPrices { get; set; } = new List<OrderDeliveryPrice>();

    public virtual Store Store { get; set; } = null!;
}
