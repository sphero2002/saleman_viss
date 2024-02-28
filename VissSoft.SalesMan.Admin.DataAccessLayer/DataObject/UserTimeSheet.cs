using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class UserTimeSheet
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string CheckInTime { get; set; } = null!;

    public string CheckOutTime { get; set; } = null!;
}
