using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TwoFactorController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public TwoFactorController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpGet("setup")]
    public async Task<IActionResult> GetQrCodeUri()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var is2faEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
        if (is2faEnabled)
            return BadRequest("2FA is already enabled.");

        var key = await _userManager.GetAuthenticatorKeyAsync(user);
        if (string.IsNullOrEmpty(key))
        {
            var resetResult = await _userManager.ResetAuthenticatorKeyAsync(user);
            if (!resetResult.Succeeded)
                return BadRequest("Failed to reset authenticator key.");
            key = await _userManager.GetAuthenticatorKeyAsync(user);
        }

        var authenticatorUri = $"otpauth://totp/CineNiche:{user.Email}?secret={key}&issuer=CineNiche";

        return Ok(new
        {
            sharedKey = key,
            qrCodeUri = authenticatorUri
        });
    }

    public class TwoFactorVerifyRequest
    {
        public string Code { get; set; } = string.Empty;
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyCode([FromBody] TwoFactorVerifyRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var isValid = await _userManager.VerifyTwoFactorTokenAsync(
            user,
            _userManager.Options.Tokens.AuthenticatorTokenProvider,
            request.Code
        );

        if (!isValid)
            return BadRequest("Invalid code.");

        await _userManager.SetTwoFactorEnabledAsync(user, true);
        return Ok("2FA enabled successfully.");
    }

    [Authorize]
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var is2faEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
        return Ok(new { isEnabled = is2faEnabled });
    }

    [Authorize]
    [HttpPost("disable")]
    public async Task<IActionResult> Disable2fa()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var disableResult = await _userManager.SetTwoFactorEnabledAsync(user, false);
        return disableResult.Succeeded
            ? Ok("Two-Factor Authentication has been disabled.")
            : BadRequest("Could not disable 2FA.");
    }
}