using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class Token
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Token1 { get; set; } = null!;

    public string Issue { get; set; } = null!;

    public int? CreateBy { get; set; }

    public int? UpdateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public int IsDeleted { get; set; }

    public virtual User User { get; set; } = null!;
}
