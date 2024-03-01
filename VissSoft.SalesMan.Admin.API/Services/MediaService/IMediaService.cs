using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.DTOs.Request;
using VissSoft.SalesMan.Admin.API.DTOs.Response;
using VissSoft.SalesMan.Admin.API.Models;

namespace VissSoft.SalesMan.Admin.API.Services.MediaService
{
    public interface IMediaService
    {
        Task<ServiceResponse<ImageDto>> uploadImage(List<IFormFile> imageFile);
    }
}
