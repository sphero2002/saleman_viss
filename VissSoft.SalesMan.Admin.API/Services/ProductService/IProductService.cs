using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.DTOs.Request;
using VissSoft.SalesMan.Admin.API.DTOs.Response;
using VissSoft.SalesMan.Admin.API.Models;

namespace VissSoft.SalesMan.Admin.API.Services.ProductService
{
    public interface IProductService
    {
        Task<ServiceResponse<CategoryResponseDto>> createCategory(CategoryRequestDto categoryRequestDto);
        Task<ServiceResponse<AttributeResponseDto>> createAttribute(AttributeRequestDto attributeRequestDto);
        Task<ServiceResponse<ProductResponseDto>> createProduct(ProductRequestDto productRequestDto);
        Task<ServiceResponse<List<ProductDto>>> getProduct(int productId);
        Task<ServiceResponse<ProductDto>> updateProductDetail(ProductDto productDto);

        Task<ServiceResponse<AttributeGroupValueDto>> updateAttributeValueIntoGroup(UpdateAttrGrRequestDto updateAttrGrRequestDto);

        Task<ServiceResponse<ProductDto>> updateProductAttributeGroup(UpdateProductAttributeGroupRequest updateProductAttributeGroup);

        Task<ServiceResponse<ProductDto>> deleteProduct(int productId); // sau check tat ca phai check qua product

        Task<ServiceResponse<AttributeGroupValueDto>> deactiveAttributeGroup(int attributeGroupId);

    }
}
