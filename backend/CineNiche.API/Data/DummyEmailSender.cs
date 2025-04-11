﻿using CineNiche.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

public class DummyEmailSender : IEmailSender<ApplicationUser>
{
    public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink) =>
        Task.CompletedTask;

    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink) =>
        Task.CompletedTask;

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode) =>
        Task.CompletedTask;
}
