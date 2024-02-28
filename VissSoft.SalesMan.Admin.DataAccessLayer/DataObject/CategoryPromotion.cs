using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class CategoryPromotion
{
    public int Id { get; set; }

    public int CategoryValueId { get; set; }

    public int PromotionId { get; set; }

    public virtual CategoryValue CategoryValue { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;
}
