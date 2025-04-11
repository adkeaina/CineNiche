using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using CineNiche.API.Data;

public class CustomUserClaimsPrincipalFactory
    : UserClaimsPrincipalFactory<ApplicationUser>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor)
    {
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        // ✅ Include Name and Email (optional)
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? ""));

        // ✅ Add FirstName and LastName
        if (!string.IsNullOrWhiteSpace(user.FirstName))
            identity.AddClaim(new Claim("FirstName", user.FirstName));

        if (!string.IsNullOrWhiteSpace(user.LastName))
            identity.AddClaim(new Claim("LastName", user.LastName));
        
        if (user.UserId != 0) // or check for a valid value if 0 is valid
            identity.AddClaim(new Claim("UserId", user.UserId.ToString()));
        
        // ✅ ADD THE ROLES — this is what was missing
        var roles = await UserManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }

        return identity;
    }
}
