using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class CategoryValue
{
    public int Id { get; set; }

    public int CategoryTypeId { get; set; }

    public string Value { get; set; } = null!;

    public virtual ICollection<CategoryProduct> CategoryProducts { get; set; } = new List<CategoryProduct>();

    public virtual ICollection<CategoryPromotionExclude> CategoryPromotionExcludes { get; set; } = new List<CategoryPromotionExclude>();

    public virtual ICollection<CategoryPromotion> CategoryPromotions { get; set; } = new List<CategoryPromotion>();

    public virtual CategoryType CategoryType { get; set; } = null!;
}
