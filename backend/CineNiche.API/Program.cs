using System.Security.Claims;
using CineNiche.API.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "CineNiche.API", Version = "v1" });

    c.AddSecurityDefinition("bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your bearer token below:"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "bearer" } },
            Array.Empty<string>()
        }
    });
});

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
});


// HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
    options.HttpsPort = 443;
});

// Movie DB
builder.Services.AddDbContext<UpdatedMoviesContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MoviesConnection")));

// Identity DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("IdentityConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));

// Identity API Endpoints + Roles
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>() // Enable role support
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Password policy hardening (IS 414 requirement)
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, CustomUserClaimsPrincipalFactory>();

// Authorization setup
builder.Services.AddAuthorization();

// Dummy email sender for dev
builder.Services.AddSingleton<IEmailSender<ApplicationUser>, DummyEmailSender>();

// CORS
// Define your policy with a name
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("https://www.nicholasbellini.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


// Secure cookie settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
});

var app = builder.Build();

// HSTS only in production
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

// Swagger only in dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthentication();
app.UseAuthorization();

// Content Security Policy
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' fonts.googleapis.com; " +
        "font-src 'self' fonts.gstatic.com; " +
        "img-src 'self'; " +
        "connect-src 'self' https://www.nicholasbellini.com;");
    await next();
});

app.MapControllers();

app.MapPost("/custom-register", async (
    UserManager<ApplicationUser> userManager,
    IEmailSender<ApplicationUser> emailSender,
    RegisterDto model,
    HttpContext context) =>
{
    var user = new ApplicationUser
    {
        UserName = model.Email,
        Email = model.Email,
        FirstName = model.FirstName,
        LastName = model.LastName
    };

    var result = await userManager.CreateAsync(user, model.Password);
    if (!result.Succeeded)
    {
        return Results.BadRequest(result.Errors);
    }

    return Results.Ok(new { message = "Registration successful" });
});

app.MapIdentityApi<ApplicationUser>();

// Logout
app.MapPost("/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(IdentityConstants.ApplicationScheme);
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });
    return Results.Ok(new { message = "Logout successful" });
});


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    await IdentitySeeder.SeedRolesAndAdminAsync(userManager, roleManager);
}


app.Run();