using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class OrderPromotion
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int PromotionId { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;
}
