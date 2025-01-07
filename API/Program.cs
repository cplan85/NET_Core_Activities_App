using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Photos;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(
    //this creates a policy whereby all the api endpoints require authentication
    opt => {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
    }
);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

//because this is an extension method we only have one argument instead of two.
builder.Services.AddApplicationServices(builder.Configuration);
// we are implementing our identity services here. 
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();
// beginning of implementing middleware 
app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
//this allows us to whitesource those sources of content
//all of this is allowed
app.UseCsp(opt => opt
.BlockAllMixedContent()
.StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com/"))
.FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com/", "data:"))
.FormActions(s => s.Self())
.FrameAncestors(s => s.Self())
.ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com"))
.ScriptSources(s => s.Self())
);

if (app.Environment.IsDevelopment())
{
    //THE APP IS ALREADY USING THIS EXCEPTION PAGE
   // app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else 
{
    app.Use(async (context, next) => 
    {
        context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

//app.UseHttpsRedirection();

app.UseCors("CorsPolicy");
// Authenticate - is it a valid user, then if so - then do authorization
app.UseAuthentication();
app.UseAuthorization();

// searches through wwwroot file to search for files such as index.html
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

//this scope will be destroyed afterwards
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    //essentially using update command from dotnet ef
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex){
    var logger = services.GetRequiredService<ILogger<Program> >();
    logger.LogError(ex, "An error occured during migration");
}
app.Run();
