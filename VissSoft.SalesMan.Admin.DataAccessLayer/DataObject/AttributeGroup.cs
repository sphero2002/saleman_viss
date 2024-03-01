using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class AttributeGroup
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Sku { get; set; } = null!;

    public int IsDeleted { get; set; }

    public virtual ICollection<AttributeGroupImage> AttributeGroupImages { get; set; } = new List<AttributeGroupImage>();

    public virtual ICollection<AttributeGroupVideo> AttributeGroupVideos { get; set; } = new List<AttributeGroupVideo>();

    public virtual ICollection<DeliveryProduct> DeliveryProducts { get; set; } = new List<DeliveryProduct>();

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public virtual ICollection<ProductAttributeGroup> ProductAttributeGroups { get; set; } = new List<ProductAttributeGroup>();

    public virtual ICollection<ProductPriceState> ProductPriceStates { get; set; } = new List<ProductPriceState>();

    public virtual ICollection<ProductPrice> ProductPrices { get; set; } = new List<ProductPrice>();

    public virtual ICollection<SupplierProductOrder> SupplierProductOrders { get; set; } = new List<SupplierProductOrder>();

    public virtual ICollection<SupplierProductPrice> SupplierProductPrices { get; set; } = new List<SupplierProductPrice>();

    public virtual ICollection<ValuesOfAttributeGroup> ValuesOfAttributeGroups { get; set; } = new List<ValuesOfAttributeGroup>();

    public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; } = new List<WarehouseProduct>();
}
