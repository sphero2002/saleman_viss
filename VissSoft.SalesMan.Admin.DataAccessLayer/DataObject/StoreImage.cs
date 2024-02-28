using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class StoreImage
{
    public int Id { get; set; }

    public int ImageId { get; set; }

    public int StoreId { get; set; }

    public virtual Image Image { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
