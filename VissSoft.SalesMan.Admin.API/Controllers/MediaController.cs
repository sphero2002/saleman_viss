using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.DTOs.Request;
using VissSoft.SalesMan.Admin.API.DTOs.Response;
using VissSoft.SalesMan.Admin.API.Models;
using VissSoft.SalesMan.Admin.API.Services.MediaService;
using VissSoft.SalesMan.Admin.API.Services.ProductService;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;

namespace VissSoft.SalesMan.Admin.API.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class MediaController : Controller
    {
        private readonly IMediaService _mediaService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;
        private readonly IConfiguration _configuration;

        public MediaController(IMediaService mediaService, IHttpContextAccessor httpContextAccessor, DataContext dataContext, IConfiguration configuration)
        {
            _mediaService = mediaService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _dataContext = dataContext;
        }

        [HttpPost("uploadImage")]
        public async Task<ActionResult<ServiceResponse<ImageDto>>> uploadImage(List<IFormFile> imageFile)
        {
            var im = await _mediaService.uploadImage(imageFile);
            return Ok(im);
        }


    }
}
