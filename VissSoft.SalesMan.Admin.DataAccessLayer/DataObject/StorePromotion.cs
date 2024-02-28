using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class StorePromotion
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public int PromotionId { get; set; }

    public virtual Promotion Promotion { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
