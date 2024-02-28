using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class CategoryProduct
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int CategoryValueId { get; set; }

    public virtual CategoryValue CategoryValue { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
