using AutoMapper;
using System.Drawing;
using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.DTOs.Response;
using VissSoft.SalesMan.Admin.API.Models;
using VissSoft.SalesMan.Admin.API.Utility.AppTools;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

namespace VissSoft.SalesMan.Admin.API.Services.MediaService
{
    public class MediaService : IMediaService
    {
        public DataContext _dataContext;
        public IMapper _mapper;
        public IConfiguration _configuration;
        private readonly IAppTools appTools;

        public MediaService(DataContext dataContext, IMapper mapper, IConfiguration configuration, IAppTools appTools)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _configuration = configuration;
            this.appTools = appTools;
        }

        public async Task<ServiceResponse<ImageDto>> uploadImage(List<IFormFile> imageFile)
        {
            ServiceResponse<ImageDto> serviceResponse = new ServiceResponse<ImageDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            foreach( IFormFile file in imageFile) 
            {
                string imageUrl = await appTools.SaveImageAsync(file, "images", "images/defaultImage.jpg");

                var NewImage = new DataAccessLayer.DataObject.Image
                {
                    ImageUrl = imageUrl,
                };
                _dataContext.Images.Add(NewImage);
            }

            await _dataContext.SaveChangesAsync();

            return serviceResponse;
        }
    }
}
