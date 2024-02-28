using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SupplierImage
{
    public int Id { get; set; }

    public int SupplierId { get; set; }

    public int ImageId { get; set; }

    public virtual Image Image { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
