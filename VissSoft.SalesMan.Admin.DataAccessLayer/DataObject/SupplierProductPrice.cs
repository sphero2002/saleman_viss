﻿using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SupplierProductPrice
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int AttributeGroupProductId { get; set; }

    public int Price { get; set; }

    public string PriceUnit { get; set; } = null!;

    public virtual AttributeGroup AttributeGroupProduct { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
