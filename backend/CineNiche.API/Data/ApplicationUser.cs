using Microsoft.AspNetCore.Identity;

namespace CineNiche.API.Data;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    
    // Placeholder for your extra column
    public int? UserId { get; set; } 
}