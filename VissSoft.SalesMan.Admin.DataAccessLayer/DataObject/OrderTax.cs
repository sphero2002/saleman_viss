using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class OrderTax
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int TaxId { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Tax Tax { get; set; } = null!;
}
