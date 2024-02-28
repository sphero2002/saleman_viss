using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Product
{
    public int Id { get; set; }

    public string Sku { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int Weight { get; set; }

    public string Description { get; set; } = null!;

    public int Height { get; set; }

    public int Length { get; set; }

    public int Width { get; set; }

    public int Depth { get; set; }

    public string UnitLength { get; set; } = null!;

    public string Label { get; set; } = null!;

    public int? CreatorId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int IsDeleted { get; set; }

    public virtual ICollection<CategoryProduct> CategoryProducts { get; set; } = new List<CategoryProduct>();

    public virtual ICollection<DeliveryProduct> DeliveryProducts { get; set; } = new List<DeliveryProduct>();

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public virtual ICollection<ProductAttributeGroup> ProductAttributeGroups { get; set; } = new List<ProductAttributeGroup>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<ProductPromotion> ProductPromotions { get; set; } = new List<ProductPromotion>();

    public virtual ICollection<SupplierProductOrder> SupplierProductOrders { get; set; } = new List<SupplierProductOrder>();

    public virtual ICollection<SupplierProductPrice> SupplierProductPrices { get; set; } = new List<SupplierProductPrice>();

    public virtual ICollection<TaxProduct> TaxProducts { get; set; } = new List<TaxProduct>();

    public virtual ICollection<Variant> Variants { get; set; } = new List<Variant>();

    public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; } = new List<WarehouseProduct>();
}
