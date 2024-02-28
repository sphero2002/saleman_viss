using System.ComponentModel.Design;
using Hellang.Middleware.ProblemDetails;
//using VissSoft.SalesMan.Admin.API.Services.AuthService;
//using VissSoft.SalesMan.Admin.API.Services.UserServices;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObjects;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using System.Configuration;
using System.IO.Compression;
using System.Text.Json;
using System.Text.Json.Serialization;
using VissSoft.SalesMan.Admin.API.HTTP.SSO.JWT; 
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
//using VissSoft.SalesMan.Admin.API.Services.RoleServices; 
//using VissSoft.SalesMan.Admin.API.Services.MenuServices;
//using VissSoft.SalesMan.Admin.API.Services.PermissionServices; 
using Microsoft.AspNetCore.Mvc.Formatters;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;
using VissSoft.SalesMan.Admin.API.Services.ProductService;
using VissSoft.SalesMan.Admin.API.Utility.AppTools;

namespace VissSoft.SalesMan.Admin.API
{
    public class Startup
    {
        public IConfiguration configRoot { get; }

        public Startup(IConfiguration configuration)
        {
            configRoot = configuration;
        }

        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(env.ContentRootPath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            .AddEnvironmentVariables();
            configRoot = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //services.AddScoped<IAuthService, AuthServiceImpl>();
            //services.AddScoped<IUserService, UserServiceImpl>(); 
            //services.AddScoped<IRoleService, RoleServiceImpl>(); 
            //services.AddScoped<IPermissionService, PermissionServiceImpl>(); 
            //services.AddScoped<IMenuService, MenuServiceImpl>();
            services.AddScoped<IProductService, ProductService>();
            services.AddAutoMapper(typeof(Program).Assembly);
            services.AddScoped<IJwtTokenProvider, JwtTokenProvider>();
            services.AddScoped<IAppTools, AppTools>();

            services.AddOptions();
            services.AddHttpContextAccessor();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(configRoot.GetSection("AppSettings:TokenKeySecret").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddDistributedMemoryCache();
            services.AddSession();
            services.AddDbContext<DataContext>(options =>
            {
                options.UseMySQL(configRoot["ConnectionStrings:DefaultConnection"]);
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithExposedHeaders("x-pagination");
                });
            });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CMS API", Version = "v1" });
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "Standard Authorization header using the Bearer scheme, e.g. \"Bearer {token} \"",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                c.OperationFilter<SecurityRequirementsOperationFilter>();
            });

            // Add gzip compression
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
                //options.EnableForHttps = true;
                options.MimeTypes = new[]
                {
                    // Default
                    "text/plain",
                    "text/css",
                    "application/javascript",
                    "text/html",
                    "application/xml",
                    "text/xml",
                    "application/json",
                    "text/json",

                    // Custom
                    "image/svg+xml",
                    "application/font-woff2"
                };
            });

            services.Configure<HstsOptions>(options =>
            {
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(365);
            });
        }

        public void Configure(WebApplication app, IWebHostEnvironment env)
        {
            app.UseSession();
            app.UseCors("AllowAll");
            app.UseCorsMiddleware();
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI();
                //app.UseSwaggerUI(c =>
                //{
                //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMS API V1");
                //    c.RoutePrefix = string.Empty;
                //});
            }

            app.UseHttpsRedirection();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseResponseCompression();

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    const int cacheExpirationInSeconds = 60 * 60 * 24 * 30; //one month
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                    "public,max-age=" + cacheExpirationInSeconds;
                }
            });
            app.UseAuthentication();
            app.UseAuthorization();
            // app.UseAuthorization(); 
            app.MapControllers();
            app.Run();
        }
    }
}
