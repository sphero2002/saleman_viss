using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class CustomerPromotion
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public int PromotionId { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;
}
