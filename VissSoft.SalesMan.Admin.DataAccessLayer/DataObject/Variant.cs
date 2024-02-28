using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Variant
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string Permalink { get; set; } = null!;

    public DateTime DateCreated { get; set; }

    public DateTime DateCreatedGmt { get; set; }

    public DateTime DateModified { get; set; }

    public DateTime DateModifiedGmt { get; set; }

    public string Type { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string Featured { get; set; } = null!;

    public string CatalogVisibility { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string ShortDescription { get; set; } = null!;

    public string? Sku { get; set; }

    public decimal Price { get; set; }

    public decimal RegularPrice { get; set; }

    public string? SalePrice { get; set; }

    public DateTime DateOnSaleFrom { get; set; }

    public DateTime DateOnSaleFromGmt { get; set; }

    public DateTime DateOnSaleTo { get; set; }

    public DateTime DateOnSaleToGmt { get; set; }

    public string PriceHtml { get; set; } = null!;

    public string OnSale { get; set; } = null!;

    public string Purchasable { get; set; } = null!;

    public string? Images { get; set; }

    public int TotalSales { get; set; }

    public string TaxStatus { get; set; } = null!;

    public string? TaxClass { get; set; }

    public string? ButtonText { get; set; }

    public string ManageStock { get; set; } = null!;

    public int StockQuantity { get; set; }

    public string StockStatus { get; set; } = null!;

    public string Backorders { get; set; } = null!;

    public string BackordersAllowed { get; set; } = null!;

    public string Backordered { get; set; } = null!;

    public string SoldIndividually { get; set; } = null!;

    public string? Weight { get; set; }

    public string ShippingRequired { get; set; } = null!;

    public string ShippingTaxable { get; set; } = null!;

    public string? ShippingClass { get; set; }

    public int ShippingClassId { get; set; }

    public string ReviewsAllowed { get; set; } = null!;

    public decimal AverageRating { get; set; }

    public int RatingCount { get; set; }

    public string? PurchaseNote { get; set; }

    public int MenuOrder { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public virtual Product Product { get; set; } = null!;
}
