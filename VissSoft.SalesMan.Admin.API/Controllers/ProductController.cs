﻿using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.DTOs.Request;
using VissSoft.SalesMan.Admin.API.DTOs.Response;
using VissSoft.SalesMan.Admin.API.Models;
using VissSoft.SalesMan.Admin.API.Services.ProductService;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;

namespace VissSoft.SalesMan.Admin.API.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;
        private readonly IConfiguration _configuration;

        public ProductController(IProductService productService, IHttpContextAccessor httpContextAccessor, DataContext dataContext, IConfiguration configuration)
        {
            _productService = productService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _dataContext = dataContext;
        }

        [HttpPost("createAttribute")]
        public async Task<ActionResult<ServiceResponse<AttributeResponseDto>>> createAttribute(AttributeRequestDto attributeRequestDto)
        {
            var attribute = await _productService.createAttribute(attributeRequestDto);
            return Ok(attribute);
        }


        [HttpPost("createCategory")]
        public async Task<ActionResult<ServiceResponse<CategoryResponseDto>>> createCategory(CategoryRequestDto categoryRequestDto)
        {
            var category = await _productService.createCategory(categoryRequestDto);
            return Ok(category);
        }

        [HttpPost("createProduct")]
        public async Task<ActionResult<ServiceResponse<ProductResponseDto>>> createProduct([FromForm] ProductRequestDto productRequestDto)
        {
            var product = await _productService.createProduct(productRequestDto);
            return Ok(product);
        }

        [HttpPost("getProduct")]
        public async Task<ActionResult<ServiceResponse<ProductDto>>> getProduct([FromForm] int productId)
        {
            var product = await _productService.getProduct(productId);
            return Ok(product);
        }

        [HttpPost("updateProductDetail")]
        public async Task<ActionResult<ServiceResponse<ProductDto>>> updateProductDetail(ProductDto productDto)
        {
            var product = await _productService.updateProductDetail(productDto);
            return Ok(product);
        }
    }
}
