using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class ValuesOfAttributeGroup
{
    public int Id { get; set; }

    public int GroupAttributeId { get; set; }

    public int ValueId { get; set; }

    public int IsDeleted { get; set; }

    public string? UpdateAt { get; set; }

    public virtual AttributeGroup GroupAttribute { get; set; } = null!;

    public virtual AttributeValue Value { get; set; } = null!;
}
