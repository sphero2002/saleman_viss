using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class AttributeValue
{
    public int Id { get; set; }

    public int AttributeTypeId { get; set; }

    public string Value { get; set; } = null!;

    public virtual AttributesType AttributeType { get; set; } = null!;

    public virtual ICollection<ValuesOfAttributeGroup> ValuesOfAttributeGroups { get; set; } = new List<ValuesOfAttributeGroup>();
}
