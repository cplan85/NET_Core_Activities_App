using Application.Activities;
using Application.Core;
using FluentValidation;
using FluentValidation.AspNetCore;
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

        return services;
        }
    }
}