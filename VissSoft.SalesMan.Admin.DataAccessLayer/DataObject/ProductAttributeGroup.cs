using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class ProductAttributeGroup
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int GroupAttributeId { get; set; }

    public virtual AttributeGroup GroupAttribute { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
