namespace VissSoft.SalesMan.Admin.API.DTOs
{
    public class UpdateProfileDTO
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
    }
}
