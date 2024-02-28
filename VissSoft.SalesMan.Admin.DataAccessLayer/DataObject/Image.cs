using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Image
{
    public int Id { get; set; }

    public string ImageUrl { get; set; } = null!;

    public virtual ICollection<AttributeGroupImage> AttributeGroupImages { get; set; } = new List<AttributeGroupImage>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<StoreImage> StoreImages { get; set; } = new List<StoreImage>();

    public virtual ICollection<SupplierImage> SupplierImages { get; set; } = new List<SupplierImage>();
}
