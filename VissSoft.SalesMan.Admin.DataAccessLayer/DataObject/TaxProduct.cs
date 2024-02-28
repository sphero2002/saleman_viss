using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class TaxProduct
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int TaxId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Tax Tax { get; set; } = null!;
}
