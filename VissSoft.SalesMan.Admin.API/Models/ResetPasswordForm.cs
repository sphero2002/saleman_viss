using System.ComponentModel.DataAnnotations;

namespace VissSoft.SalesMan.Admin.API.Models
{
    public class ResetPasswordForm
    {
        [Required] public string currentPassword { get; set; }
        [Required] public string newPassword { get; set; }
    }
}
