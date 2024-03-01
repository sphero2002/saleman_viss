using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class AttributeGroupVideo
{
    public int Id { get; set; }

    public int AttributeGroupId { get; set; }

    public int VideoId { get; set; }

    public virtual AttributeGroup AttributeGroup { get; set; } = null!;

    public virtual Video Video { get; set; } = null!;
}
