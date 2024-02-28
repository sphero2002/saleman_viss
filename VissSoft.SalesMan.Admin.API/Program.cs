using Hellang.Middleware.ProblemDetails;
using VissSoft.SalesMan.Admin.API;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObjects;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);
var startup = new Startup(builder.Environment);
startup.ConfigureServices(builder.Services); // calling ConfigureServices method
var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
startup.Configure(app, builder.Environment); // calling Configure method
