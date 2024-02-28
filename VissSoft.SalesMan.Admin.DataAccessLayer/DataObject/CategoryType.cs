using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class CategoryType
{
    public int Id { get; set; }

    public string CategoryTypeName { get; set; } = null!;

    public virtual ICollection<CategoryValue> CategoryValues { get; set; } = new List<CategoryValue>();
}
