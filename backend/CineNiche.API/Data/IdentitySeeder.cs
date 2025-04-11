using CineNiche.API.Data;
using Microsoft.AspNetCore.Identity;

public static class IdentitySeeder
{
    public static async Task SeedRolesAndAdminAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // 1. Ensure "Admin" role exists
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        // 2. Create admin user if needed
        var adminEmail = "admin@cineniche.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(adminUser, "Admin123!"); // meets password policy
        }

        // 3. Assign to Admin role if not already
        if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
