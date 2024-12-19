using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Application.Photos;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
          services.AddEndpointsApiExplorer();
          services.AddSwaggerGen();
          services.AddDbContext<DataContext>(Opt => {
            Opt.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });      
        services.AddCors(opt => {
        opt.AddPolicy("CorsPolicy", policy => {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
        });
        });      
        
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));      
        
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);
        //ADDING VALIDATORS FROM FLUENT VLAIDATOR
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<Create>();
        services.AddHttpContextAccessor();
        services.AddScoped<IUserAccessor, UserAccessor>();
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();
        services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));

        return services;
        }
    }
}