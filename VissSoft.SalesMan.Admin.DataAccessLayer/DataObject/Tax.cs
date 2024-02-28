using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Tax
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public int Variable { get; set; }

    public string VariableUnit { get; set; } = null!;

    public virtual ICollection<OrderTax> OrderTaxes { get; set; } = new List<OrderTax>();

    public virtual ICollection<TaxProduct> TaxProducts { get; set; } = new List<TaxProduct>();
}
