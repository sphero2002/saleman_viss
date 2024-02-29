using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using VissSoft.SalesMan.Admin.API.DTOs;
using VissSoft.SalesMan.Admin.API.DTOs.Request;
using VissSoft.SalesMan.Admin.API.DTOs.Response;
using VissSoft.SalesMan.Admin.API.Models;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;
using VissSoft.SalesMan.Admin.API.Utility.AppTools;

namespace VissSoft.SalesMan.Admin.API.Services.ProductService
{
    public class ProductService : IProductService
    {
        public DataContext _dataContext;
        public IMapper _mapper;
        public IConfiguration _configuration;
        private readonly IAppTools appTools;

        public ProductService(DataContext dataContext, IMapper mapper, IConfiguration configuration, IAppTools appTools)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _configuration = configuration;
            this.appTools = appTools;
        }

        public async Task<ServiceResponse<AttributeResponseDto>> createAttribute(AttributeRequestDto attributeRequestDto)
        {
            ServiceResponse<AttributeResponseDto> serviceResponse = new ServiceResponse<AttributeResponseDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            var existAttributeType = await _dataContext.AttributesTypes
                .Include(c => c.AttributeValues)
                .Where(c => c.AttributeTypeName.ToLower() == attributeRequestDto.AttributeTypeName.ToLower())
                .ToListAsync();

            if (existAttributeType.Count <= 0)
            {
                // Add cả type và value
                // gán data vào serviceresponse
                var newAttributeType = new AttributesType { AttributeTypeName = attributeRequestDto.AttributeTypeName };
                var newAttributeValue = new AttributeValue { Value = attributeRequestDto.Value, AttributeType = newAttributeType };

                _dataContext.AttributesTypes.Add(newAttributeType);
                _dataContext.AttributeValues.Add(newAttributeValue);

                await _dataContext.SaveChangesAsync();

                var data = new AttributeResponseDto
                {
                    Id = newAttributeValue.Id,
                    AttributeTypeName = attributeRequestDto.AttributeTypeName,
                    Value = attributeRequestDto.Value
                };

                serviceResponse.Data = data;
            }
            else
            {
                var xx = existAttributeType.First().AttributeValues.FirstOrDefault(cv => cv.Value.ToLower() == attributeRequestDto.Value.ToLower());
                if (xx == null)
                {
                    //lấy typeId để add thêm vào bảng value
                    var newAttributeValue = new AttributeValue { Value = attributeRequestDto.Value, AttributeTypeId = existAttributeType.Select(c => c.Id).First() };

                    _dataContext.AttributeValues.Add(newAttributeValue);

                    await _dataContext.SaveChangesAsync();

                    var data = new AttributeResponseDto
                    {
                        Id = newAttributeValue.Id,
                        AttributeTypeName = newAttributeValue.AttributeType.AttributeTypeName,
                        Value = newAttributeValue.Value
                    };
                    serviceResponse.Data = data;
                }
                else
                {
                    //trả về đã tồn tại
                    serviceResponse.ErrorCode = 400;
                    serviceResponse.Status = true;
                    serviceResponse.Message = "Attribute value existed!";

                    var data = new AttributeResponseDto
                    {
                        Id = xx.Id,
                        AttributeTypeName = existAttributeType.Select(c => c.AttributeTypeName).First(),
                        Value = xx.Value
                    };
                    serviceResponse.Data = data;
                }
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<CategoryResponseDto>> createCategory(CategoryRequestDto categoryRequestDto)
        {
            ServiceResponse<CategoryResponseDto> serviceResponse = new ServiceResponse<CategoryResponseDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            var existCategoryType = await _dataContext.CategoryTypes
                .Include(c => c.CategoryValues)
                .Where(c => c.CategoryTypeName.ToLower() == categoryRequestDto.CategoryTypeName.ToLower())
                .ToListAsync();

            if(existCategoryType.Count <= 0 )
            {
                // Add cả type và value
                // gán data vào serviceresponse

                var newCategoryType = new CategoryType { CategoryTypeName = categoryRequestDto.CategoryTypeName };
                var newCategoryValue = new CategoryValue { Value = categoryRequestDto.Value, CategoryType = newCategoryType };

                _dataContext.CategoryTypes.Add(newCategoryType);
                _dataContext.CategoryValues.Add(newCategoryValue);

                await _dataContext.SaveChangesAsync();

                var data = new CategoryResponseDto
                {
                    Id = newCategoryValue.Id,
                    CategoryTypeName = categoryRequestDto.CategoryTypeName,
                    Value = categoryRequestDto.Value
                };

                serviceResponse.Data = data;
            }
            else
            {
                var xx = existCategoryType.First().CategoryValues.FirstOrDefault(cv => cv.Value.ToLower() == categoryRequestDto.Value.ToLower());
                if(xx == null)
                {
                    //add value lay typeId cu
                    var newCategoryValue = new CategoryValue { Value = categoryRequestDto.Value, CategoryTypeId = existCategoryType.Select(c => c.Id).First() };

                    _dataContext.CategoryValues.Add(newCategoryValue);

                    await _dataContext.SaveChangesAsync();

                    var data = new CategoryResponseDto
                    {
                        Id = newCategoryValue.Id,
                        CategoryTypeName = newCategoryValue.CategoryType.CategoryTypeName,
                        Value = newCategoryValue.Value
                    };
                    serviceResponse.Data = data;
                }
                else
                {
                    //tra ve data thoi
                    serviceResponse.ErrorCode = 400;
                    serviceResponse.Status = true;
                    serviceResponse.Message = "Attribute value existed!";

                    var data = new CategoryResponseDto
                    {
                        Id = xx.Id,
                        CategoryTypeName = existCategoryType.Select(c => c.CategoryTypeName).First(),
                        Value = xx.Value
                    };
                    serviceResponse.Data = data;
                }
            }

            //&& c.CategoryValues.Any()
            return serviceResponse;
        }

        public async Task<ServiceResponse<ProductResponseDto>> createProduct(ProductRequestDto productRequestDto)
        {
            ServiceResponse<ProductResponseDto> serviceResponse = new ServiceResponse<ProductResponseDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            //create product
            var newProduct = new Product
            {
                Sku = productRequestDto.Sku,
                Name = productRequestDto.Name,
                Weight = productRequestDto.Weight,
                Height = productRequestDto.Height,
                Description = productRequestDto.Description,
                Length = productRequestDto.Length,
                Width = productRequestDto.Width,
                Depth = productRequestDto.Depth,
                UnitLength = productRequestDto.UnitOfLength,
                Label = productRequestDto.Label,
            };
            _dataContext.Products.Add(newProduct);
            //category
            foreach (int categporyValueId in productRequestDto.listCategporyValueId)
            {
                //chưa check xem có tồn tại hay không
                var categoryProduct = new CategoryProduct { CategoryValueId = categporyValueId, Product = newProduct };
                _dataContext.CategoryProducts.Add(categoryProduct);
            }

            //attributeGr
            foreach (AttributeGroupDto attributeGroup in productRequestDto.AttributeGroups)
            {
                //create attributeGr
                var newAttributeGroup = new AttributeGroup { Name = attributeGroup.Name, Sku = attributeGroup.Sku };
                _dataContext.AttributeGroups.Add(newAttributeGroup);
                //
                var newProductAtributeGroup = new ProductAttributeGroup { GroupAttribute = newAttributeGroup, Product = newProduct };
                _dataContext.ProductAttributeGroups.Add(newProductAtributeGroup);
                // add value into attrGr
                foreach (int attributeValueId in attributeGroup.listAttributeValueId)
                {
                    var newValuesOfAttributeGroup = new ValuesOfAttributeGroup { GroupAttribute = newAttributeGroup, ValueId = attributeValueId };
                    _dataContext.ValuesOfAttributeGroups.Add(newValuesOfAttributeGroup);
                }
                // add price state
                foreach (ProductPriceStateDto productPriceStateDto in attributeGroup.productPriceState)
                {
                    var newProductPriceState = new ProductPriceState
                    {
                        AttributeGroup = newAttributeGroup,
                        QuantityPercent = productPriceStateDto.QuantityPercent,
                        Price = productPriceStateDto.Price,
                        PriceUnit = productPriceStateDto.PriceUnit,
                        Name = productPriceStateDto.Name
                    };

                    _dataContext.ProductPriceStates.Add(newProductPriceState);

                    if (productPriceStateDto.IsChoosen == 1)
                    {
                        var productPrices = new ProductPrice
                        {
                            AttributeGroup = newAttributeGroup,
                            Price = newProductPriceState,
                        };

                        _dataContext.ProductPrices.Add(productPrices);
                    }
                }
            }

            //image
            //chưa có lưu vào db đâu nha????
            foreach(IFormFile item in productRequestDto.ImageFile)
            {
                string imageUrl = await appTools.SaveImageAsync(item, "product", "product/defaultImage.jpg");
                string imageUri = appTools.CreateImageUrl(imageUrl);

                var NewImage = new Image
                {
                    ImageUrl = imageUri,
                };
                _dataContext.Images.Add(NewImage);

                var newProductImage = new ProductImage
                {
                    Image = NewImage,
                    Product = newProduct
                };
                _dataContext.ProductImages.Add(newProductImage);
            }

            await _dataContext.SaveChangesAsync();

            //var existedProduct 

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<ProductDto>>> getProduct(int productId)
        {
            ServiceResponse<List<ProductDto>> serviceResponse = new ServiceResponse<List<ProductDto>>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            string sql = @"
            SELECT 
            p.id, p.sku, p.name, p.weight, p.description, p.height, p.length, p.width, 
            p.depth, p.unitLength, p.label, p.creator_id, p.created_at, p.isDeleted
            FROM salemanager.products p";

            if(productId > 0)
            {
                sql += " where p.id = " + productId;
            }

            var dbProduct = RawSqlQuery<ProductDto>(sql,
                                         x => new ProductDto
                                         {
                                             Id = (int)x["id"],
                                             Sku = x["sku"].ToString(),
                                             Name = x["name"].ToString(),
                                             Weight = (int)x["weight"],
                                             Description = x["description"].ToString(),
                                             Height = (int)x["height"],
                                             Length = (int)x["length"],
                                             Width = (int)x["width"],
                                             Depth = (int)x["depth"],
                                             UnitLength = x["unitLength"].ToString(),
                                             Label = x["label"].ToString(),
                                             CreatorId = (int)x["creator_id"],
                                             CreatedAt = (DateTime)x["created_at"],
                                             IsDeleted = (int)x["isDeleted"]
                                         });



            serviceResponse.Data = dbProduct.ToList();

            return serviceResponse;
        }

        public List<T> RawSqlQuery<T>(string query, Func<DbDataReader, T> map)
        {

            using (var context = new DataContext(_configuration))
            {
                using (var command = context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = query;
                    command.CommandType = CommandType.Text;

                    context.Database.OpenConnection();

                    using (var result = command.ExecuteReader())
                    {
                        var entities = new List<T>();

                        while (result.Read())
                        {
                            entities.Add(map(result));
                        }

                        return entities;
                    }
                }
            }
        }

        public async Task<ServiceResponse<ProductDto>> updateProductDetail(ProductDto productDto)
        {
            ServiceResponse<ProductDto> serviceResponse = new ServiceResponse<ProductDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            var existingProduct = await _dataContext.Products
                .Where(c => c.Id == productDto.Id)
                .FirstOrDefaultAsync();
             
            if(existingProduct == null)
            {
                serviceResponse.ErrorCode = 404;
                serviceResponse.Status = false;
                serviceResponse.Message = "Not existed product";
                return serviceResponse;
            }


            //update product dựa vào các field trong productDto
            var updatedProduct = _mapper.Map(productDto, existingProduct);
            _dataContext.Products.Update(updatedProduct);

            await _dataContext.SaveChangesAsync();

            return serviceResponse;
        }

        public async Task<ServiceResponse<AttributeGroupValueDto>> updateAttributeValueIntoGroup(UpdateAttrGrRequestDto updateAttrGrRequestDto)
        {
            ServiceResponse<AttributeGroupValueDto> serviceResponse = new ServiceResponse<AttributeGroupValueDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            var attrGrExisting = _dataContext.AttributeGroups
                .Include(c => c.ValuesOfAttributeGroups.Where(d => d.IsDeleted == 0))
                .Where(c => c.Id == updateAttrGrRequestDto.groupId)
                .ToList();

            if(attrGrExisting.Count == 0)
            {
                serviceResponse.ErrorCode = 404;
                serviceResponse.Status = false;
                serviceResponse.Message = "Not existed this Attribute Group";
                return serviceResponse;
            }

            //check list<attribute Value> xem có tồn tại trong bảng attributeValue không?
            //list attributevalue lấy ở UpdateAttrGrRequestDto
            foreach( var attributeValueId in updateAttrGrRequestDto.attrId ) 
            {
                var attrValue = await _dataContext.AttributeValues
                .Where(c => c.Id == attributeValueId )
                .FirstOrDefaultAsync();

                //chỉ cần 1 cái attr Id không hợp lệ trả về lỗi
                if(attrValue == null)
                {
                    serviceResponse.ErrorCode = 404;
                    serviceResponse.Status = false;
                    serviceResponse.Message = "Not existed this Attribute Value";
                }
            }

            //update bảng AttributeGroups theo updateAttrGrRequestDto

            //check xem đã tồn tại attrvalueId ở bảng AttributeGroups chưa
            //tồn tại rồi thì bỏ qua không thêm
            //chưa tồn tại thì thêm mới
            //xóa mấy cái còn lại "isdeleted = 1"

            var attriValueIdExistingInGr = attrGrExisting.First().ValuesOfAttributeGroups.ToList();
            //list đầu vào laf updateAttrGrRequestDto.attrId


            List<int> commonValueIdElements = attriValueIdExistingInGr.Select(c => c.ValueId).ToList().Intersect(updateAttrGrRequestDto.attrId).ToList(); //ko cần tạo mới

            List<int> ValueIdDelete = attriValueIdExistingInGr.Select(c => c.ValueId).ToList()
                .Except(updateAttrGrRequestDto.attrId).ToList(); // xóa isdeleted = 1
            foreach (int valueIdDelete in ValueIdDelete)
            {
                var aa = attriValueIdExistingInGr.Where(c => c.ValueId == valueIdDelete).FirstOrDefault();
                aa.UpdateAt = DateTime.Now.ToString();
                aa.IsDeleted = 1;
                _dataContext.ValuesOfAttributeGroups.Update(aa);
            }

            List<int> ValueIdInsert = updateAttrGrRequestDto.attrId
                .Except(attriValueIdExistingInGr.Select(c => c.ValueId).ToList()).ToList(); // add mới
            foreach(int valueIdInsert in ValueIdInsert)
            {
                var newValuesOfAttributeGroups = new ValuesOfAttributeGroup
                {
                    GroupAttributeId = updateAttrGrRequestDto.groupId,
                    ValueId = valueIdInsert
                };
                _dataContext.ValuesOfAttributeGroups.Add(newValuesOfAttributeGroups);
            }

            await _dataContext.SaveChangesAsync();

            return serviceResponse;
        }

        public async Task<ServiceResponse<ProductDto>> updateProductAttributeGroup(UpdateProductAttributeGroupRequest updateProductAttributeGroup)
        {
            ServiceResponse<ProductDto> serviceResponse = new ServiceResponse<ProductDto>();
            serviceResponse.ErrorCode = 200;
            serviceResponse.Status = true;
            serviceResponse.Message = "Successfully";

            var productGrExisting = _dataContext.Products
                .Include(c => c.ProductAttributeGroups.Where(d => d.IsDeleted == 0))
                .Where(c => c.Id == updateProductAttributeGroup.ProductId)
                .ToList();

            if (productGrExisting.Count == 0)
            {
                serviceResponse.ErrorCode = 404;
                serviceResponse.Status = false;
                serviceResponse.Message = "Not existed this Product";
                return serviceResponse;
            }

            var attriGrIdExistingInGr = productGrExisting.First().ProductAttributeGroups.ToList();

            List<int> GroupIdDelete = attriGrIdExistingInGr.Select(c => c.GroupAttributeId).ToList()
                .Except(updateProductAttributeGroup.AttributeGroupId).ToList(); // xóa isdeleted = 1
            foreach (int valueIdDelete in GroupIdDelete)
            {
                var aa = attriGrIdExistingInGr.Where(c => c.GroupAttributeId == valueIdDelete).FirstOrDefault();
                aa.UpdateAt = DateTime.Now.ToString();
                aa.IsDeleted = 1;
                _dataContext.ProductAttributeGroups.Update(aa);
            }

            List<int> GroupIdInsert = updateProductAttributeGroup.AttributeGroupId
                .Except(attriGrIdExistingInGr.Select(c => c.GroupAttributeId).ToList()).ToList(); // add mới
            foreach (int groupIdInsert in GroupIdInsert)
            {
                var newGroups = new ProductAttributeGroup
                {
                    GroupAttributeId = groupIdInsert,
                    ProductId = updateProductAttributeGroup.ProductId
                };
                _dataContext.ProductAttributeGroups.Add(newGroups);
            }

            await _dataContext.SaveChangesAsync();

            return serviceResponse;
        }
    }
}
