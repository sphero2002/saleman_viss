using AutoMapper;
using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.Models;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObjects;

namespace VissSoft.SalesMan.Admin.API
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ProductDto, Product>();
            //CreateMap<User, UserDTO>();
            //CreateMap<CreateUserDTO, User>();
            //CreateMap<UpdateUserDTO, User>(); 
            //CreateMap<RoleDTO, Role>();   
            //CreateMap<Role, RoleDTOResponse>();
            //CreateMap<Role, RoleDTO>();
            //CreateMap<Role, RoleDTOUser>();
            // CreateMap<>()
        }
    }
}