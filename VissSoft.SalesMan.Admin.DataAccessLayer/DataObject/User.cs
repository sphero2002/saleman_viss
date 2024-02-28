using System;
using System.Collections.Generic;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class User
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Email { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int? Gender { get; set; }

    public DateTime? BirthDate { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public int IsTeacher { get; set; }

    public int Enable { get; set; }

    public int? CreateBy { get; set; }

    public int? UpdateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public int IsDeleted { get; set; }

    public virtual ICollection<Token> Tokens { get; set; } = new List<Token>();

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
