using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class AttributeGroupImage
{
    public int Id { get; set; }

    public int AttributeGroupId { get; set; }

    public int ImageId { get; set; }

    public virtual AttributeGroup AttributeGroup { get; set; } = null!;

    public virtual Image Image { get; set; } = null!;
}
