using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Promotion
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int TypeId { get; set; }

    public double Value { get; set; }

    public string ValueUnit { get; set; } = null!;

    public int Quantity { get; set; }

    public string Status { get; set; } = null!;

    public int AllowFreeShippng { get; set; }

    public DateTime ExpiryDate { get; set; }

    public DateTime StartDate { get; set; }

    public int MinimunSpend { get; set; }

    public int MaximumSpend { get; set; }

    public string SpendUnit { get; set; } = null!;

    public virtual ICollection<CategoryPromotionExclude> CategoryPromotionExcludes { get; set; } = new List<CategoryPromotionExclude>();

    public virtual ICollection<CategoryPromotion> CategoryPromotions { get; set; } = new List<CategoryPromotion>();

    public virtual ICollection<CustomerPromotion> CustomerPromotions { get; set; } = new List<CustomerPromotion>();

    public virtual ICollection<OrderPromotion> OrderPromotions { get; set; } = new List<OrderPromotion>();

    public virtual ICollection<ProductPromotion> ProductPromotions { get; set; } = new List<ProductPromotion>();

    public virtual ICollection<StorePromotion> StorePromotions { get; set; } = new List<StorePromotion>();

    public virtual PromotionType Type { get; set; } = null!;
}
