using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Video
{
    public int Id { get; set; }

    public string VideoUrl { get; set; } = null!;

    public virtual ICollection<AttributeGroupVideo> AttributeGroupVideos { get; set; } = new List<AttributeGroupVideo>();

    public virtual ICollection<ProductVideo> ProductVideos { get; set; } = new List<ProductVideo>();
}
