using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

public partial class SalemanagerContext : DbContext
{
    public SalemanagerContext()
    {
    }

    public SalemanagerContext(DbContextOptions<SalemanagerContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<AttributeGroup> AttributeGroups { get; set; }

    public virtual DbSet<AttributeGroupImage> AttributeGroupImages { get; set; }

    public virtual DbSet<AttributeValue> AttributeValues { get; set; }

    public virtual DbSet<AttributesType> AttributesTypes { get; set; }

    public virtual DbSet<Carrier> Carriers { get; set; }

    public virtual DbSet<CategoryProduct> CategoryProducts { get; set; }

    public virtual DbSet<CategoryPromotion> CategoryPromotions { get; set; }

    public virtual DbSet<CategoryPromotionExclude> CategoryPromotionExcludes { get; set; }

    public virtual DbSet<CategoryType> CategoryTypes { get; set; }

    public virtual DbSet<CategoryValue> CategoryValues { get; set; }

    public virtual DbSet<CheckProduct> CheckProducts { get; set; }

    public virtual DbSet<Checklog> Checklogs { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerAddress> CustomerAddresses { get; set; }

    public virtual DbSet<CustomerPromotion> CustomerPromotions { get; set; }

    public virtual DbSet<Delivery> Deliveries { get; set; }

    public virtual DbSet<DeliveryChecklog> DeliveryChecklogs { get; set; }

    public virtual DbSet<DeliveryPriceRate> DeliveryPriceRates { get; set; }

    public virtual DbSet<DeliveryProduct> DeliveryProducts { get; set; }

    public virtual DbSet<DeliveryShipper> DeliveryShippers { get; set; }

    public virtual DbSet<DeliveryStatus> DeliveryStatuses { get; set; }

    public virtual DbSet<Function> Functions { get; set; }

    public virtual DbSet<Image> Images { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDelivery> OrderDeliveries { get; set; }

    public virtual DbSet<OrderDeliveryPrice> OrderDeliveryPrices { get; set; }

    public virtual DbSet<OrderFrom> OrderFroms { get; set; }

    public virtual DbSet<OrderPayment> OrderPayments { get; set; }

    public virtual DbSet<OrderProduct> OrderProducts { get; set; }

    public virtual DbSet<OrderPromotion> OrderPromotions { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<OrderTax> OrderTaxes { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<PaymentStatus> PaymentStatuses { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductAttributeGroup> ProductAttributeGroups { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductPrice> ProductPrices { get; set; }

    public virtual DbSet<ProductPriceState> ProductPriceStates { get; set; }

    public virtual DbSet<ProductPromotion> ProductPromotions { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<PromotionType> PromotionTypes { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RoleMenu> RoleMenus { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<Shipper> Shippers { get; set; }

    public virtual DbSet<StaffUser> StaffUsers { get; set; }

    public virtual DbSet<StatusesOfOrder> StatusesOfOrders { get; set; }

    public virtual DbSet<Store> Stores { get; set; }

    public virtual DbSet<StoreAddress> StoreAddresses { get; set; }

    public virtual DbSet<StoreImage> StoreImages { get; set; }

    public virtual DbSet<StorePromotion> StorePromotions { get; set; }

    public virtual DbSet<StoreWarehouse> StoreWarehouses { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<SupplierAddress> SupplierAddresses { get; set; }

    public virtual DbSet<SupplierImage> SupplierImages { get; set; }

    public virtual DbSet<SupplierInventory> SupplierInventories { get; set; }

    public virtual DbSet<SupplierOrder> SupplierOrders { get; set; }

    public virtual DbSet<SupplierOrderStatus> SupplierOrderStatuses { get; set; }

    public virtual DbSet<SupplierProductOrder> SupplierProductOrders { get; set; }

    public virtual DbSet<SupplierProductPrice> SupplierProductPrices { get; set; }

    public virtual DbSet<Tax> Taxes { get; set; }

    public virtual DbSet<TaxProduct> TaxProducts { get; set; }

    public virtual DbSet<Token> Tokens { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<UserTimeSheet> UserTimeSheets { get; set; }

    public virtual DbSet<ValuesOfAttributeGroup> ValuesOfAttributeGroups { get; set; }

    public virtual DbSet<Variant> Variants { get; set; }

    public virtual DbSet<Warehouse> Warehouses { get; set; }

    public virtual DbSet<WarehouseProduct> WarehouseProducts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=103.161.178.66;port=3306;user=visss_saleman;password=VisssAdmin@123;database=salemanager");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("address");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.City)
                .HasMaxLength(45)
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(45)
                .HasColumnName("country");
            entity.Property(e => e.Description)
                .HasMaxLength(45)
                .HasColumnName("description");
            entity.Property(e => e.District)
                .HasMaxLength(45)
                .HasColumnName("district");
            entity.Property(e => e.Provice)
                .HasMaxLength(45)
                .HasColumnName("provice");
            entity.Property(e => e.Ward)
                .HasMaxLength(45)
                .HasColumnName("ward");
        });

        modelBuilder.Entity<AttributeGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("attribute_group");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.Sku)
                .HasMaxLength(45)
                .HasColumnName("sku");
        });

        modelBuilder.Entity<AttributeGroupImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("attribute_group_image");

            entity.HasIndex(e => e.AttributeGroupId, "agi_1_idx");

            entity.HasIndex(e => e.ImageId, "agi_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupId).HasColumnName("attributeGroupId");
            entity.Property(e => e.ImageId).HasColumnName("imageId");

            entity.HasOne(d => d.AttributeGroup).WithMany(p => p.AttributeGroupImages)
                .HasForeignKey(d => d.AttributeGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("agi_1");

            entity.HasOne(d => d.Image).WithMany(p => p.AttributeGroupImages)
                .HasForeignKey(d => d.ImageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("agi_2");
        });

        modelBuilder.Entity<AttributeValue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("attribute_value");

            entity.HasIndex(e => e.AttributeTypeId, "av1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeTypeId).HasColumnName("attributeTypeId");
            entity.Property(e => e.Value)
                .HasMaxLength(45)
                .HasColumnName("value");

            entity.HasOne(d => d.AttributeType).WithMany(p => p.AttributeValues)
                .HasForeignKey(d => d.AttributeTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("av1");
        });

        modelBuilder.Entity<AttributesType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("attributes_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeTypeName)
                .HasMaxLength(45)
                .HasColumnName("attributeTypeName");
        });

        modelBuilder.Entity<Carrier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("carrier");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ManagerId).HasColumnName("managerId");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(45)
                .HasColumnName("phoneNumber");
        });

        modelBuilder.Entity<CategoryProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("category_products");

            entity.HasIndex(e => e.CategoryValueId, "cp2_idx");

            entity.HasIndex(e => e.ProductId, "cp_1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryValueId).HasColumnName("categoryValueId");
            entity.Property(e => e.ProductId).HasColumnName("productId");

            entity.HasOne(d => d.CategoryValue).WithMany(p => p.CategoryProducts)
                .HasForeignKey(d => d.CategoryValueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cp2");

            entity.HasOne(d => d.Product).WithMany(p => p.CategoryProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cp1");
        });

        modelBuilder.Entity<CategoryPromotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("category_promotion");

            entity.HasIndex(e => e.CategoryValueId, "cp_1_idx");

            entity.HasIndex(e => e.PromotionId, "cp_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryValueId).HasColumnName("categoryValueId");
            entity.Property(e => e.PromotionId).HasColumnName("promotionId");

            entity.HasOne(d => d.CategoryValue).WithMany(p => p.CategoryPromotions)
                .HasForeignKey(d => d.CategoryValueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cp_1");

            entity.HasOne(d => d.Promotion).WithMany(p => p.CategoryPromotions)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cp_2");
        });

        modelBuilder.Entity<CategoryPromotionExclude>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("category_promotion_exclude");

            entity.HasIndex(e => e.PromotionId, "cpe_1_idx");

            entity.HasIndex(e => e.CategoryValueId, "cpe_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryValueId).HasColumnName("categoryValueId");
            entity.Property(e => e.PromotionId).HasColumnName("promotionId");

            entity.HasOne(d => d.CategoryValue).WithMany(p => p.CategoryPromotionExcludes)
                .HasForeignKey(d => d.CategoryValueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cpe_2");

            entity.HasOne(d => d.Promotion).WithMany(p => p.CategoryPromotionExcludes)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cpe_1");
        });

        modelBuilder.Entity<CategoryType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("category_types");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryTypeName)
                .HasMaxLength(45)
                .HasColumnName("categoryTypeName");
        });

        modelBuilder.Entity<CategoryValue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("category_value");

            entity.HasIndex(e => e.CategoryTypeId, "cv_1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryTypeId).HasColumnName("categoryTypeId");
            entity.Property(e => e.Value)
                .HasMaxLength(45)
                .HasColumnName("value");

            entity.HasOne(d => d.CategoryType).WithMany(p => p.CategoryValues)
                .HasForeignKey(d => d.CategoryTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cv_1");
        });

        modelBuilder.Entity<CheckProduct>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("check_product");
        });

        modelBuilder.Entity<Checklog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("checklog");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Checklog1)
                .HasMaxLength(45)
                .HasColumnName("checklog");
            entity.Property(e => e.UpdateTime)
                .HasMaxLength(45)
                .HasColumnName("updateTime");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("customer");

            entity.HasIndex(e => e.HomeAddressId, "cus_1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(45)
                .HasColumnName("email");
            entity.Property(e => e.HomeAddressId).HasColumnName("homeAddressId");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(45)
                .HasColumnName("phoneNumber");

            entity.HasOne(d => d.HomeAddress).WithMany(p => p.Customers)
                .HasForeignKey(d => d.HomeAddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cus_1");
        });

        modelBuilder.Entity<CustomerAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("customer_address");

            entity.HasIndex(e => e.CustomerId, "caddr_1_idx");

            entity.HasIndex(e => e.AddressId, "caddr_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AddressId).HasColumnName("addressId");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");

            entity.HasOne(d => d.Address).WithMany(p => p.CustomerAddresses)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("caddr_2");

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerAddresses)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("caddr_1");
        });

        modelBuilder.Entity<CustomerPromotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("customer_promotion");

            entity.HasIndex(e => e.CustomerId, "cpro_1_idx");

            entity.HasIndex(e => e.PromotionId, "cpro_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.PromotionId).HasColumnName("promotionId");

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerPromotions)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cpro_1");

            entity.HasOne(d => d.Promotion).WithMany(p => p.CustomerPromotions)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cpro_2");
        });

        modelBuilder.Entity<Delivery>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("delivery");

            entity.HasIndex(e => e.StoreId, "deli1_idx");

            entity.HasIndex(e => e.CustomerId, "deli2_idx");

            entity.HasIndex(e => e.AddressId, "deli3_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AddressId).HasColumnName("addressId");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.DeliveryTime)
                .HasColumnType("datetime")
                .HasColumnName("deliveryTime");
            entity.Property(e => e.DeliveryTrackingCode)
                .HasMaxLength(45)
                .HasColumnName("deliveryTrackingCode");
            entity.Property(e => e.Note)
                .HasMaxLength(45)
                .HasColumnName("note");
            entity.Property(e => e.PickupTime)
                .HasColumnType("datetime")
                .HasColumnName("pickupTime");
            entity.Property(e => e.SignId).HasColumnName("signId");
            entity.Property(e => e.StoreId).HasColumnName("storeId");

            entity.HasOne(d => d.Address).WithMany(p => p.Deliveries)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("deli3");

            entity.HasOne(d => d.Customer).WithMany(p => p.Deliveries)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("deli2");

            entity.HasOne(d => d.Store).WithMany(p => p.Deliveries)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("deli1");
        });

        modelBuilder.Entity<DeliveryChecklog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("delivery_checklog");

            entity.HasIndex(e => e.DeliveryId, "dc_1_idx");

            entity.HasIndex(e => e.ChecklogId, "dc_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ChecklogId).HasColumnName("checklogId");
            entity.Property(e => e.DeliveryId).HasColumnName("deliveryId");

            entity.HasOne(d => d.Checklog).WithMany(p => p.DeliveryChecklogs)
                .HasForeignKey(d => d.ChecklogId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dc_2");

            entity.HasOne(d => d.Delivery).WithMany(p => p.DeliveryChecklogs)
                .HasForeignKey(d => d.DeliveryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dc_1");
        });

        modelBuilder.Entity<DeliveryPriceRate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("delivery_price_rate");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DistanceUnit)
                .HasMaxLength(45)
                .HasColumnName("distanceUnit");
            entity.Property(e => e.FromDistance).HasColumnName("fromDistance");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.PriceUnit)
                .HasMaxLength(45)
                .HasColumnName("priceUnit");
            entity.Property(e => e.ToDistance).HasColumnName("toDistance");
        });

        modelBuilder.Entity<DeliveryProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("delivery_product");

            entity.HasIndex(e => e.DeliveryId, "dpr_1_idx");

            entity.HasIndex(e => e.ProductId, "dpr_2_idx");

            entity.HasIndex(e => e.AttributeGroupId, "dpr_3_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupId).HasColumnName("attributeGroupId");
            entity.Property(e => e.DeliveryId).HasColumnName("deliveryId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Quantity).HasColumnName("quantity");

            entity.HasOne(d => d.AttributeGroup).WithMany(p => p.DeliveryProducts)
                .HasForeignKey(d => d.AttributeGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dpr_3");

            entity.HasOne(d => d.Delivery).WithMany(p => p.DeliveryProducts)
                .HasForeignKey(d => d.DeliveryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dpr_1");

            entity.HasOne(d => d.Product).WithMany(p => p.DeliveryProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dpr_2");
        });

        modelBuilder.Entity<DeliveryShipper>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("delivery_shipper");

            entity.HasIndex(e => e.CarrierId, "dshi_1_idx");

            entity.HasIndex(e => e.DeliveryId, "dshi_2_idx");

            entity.HasIndex(e => e.ShipperId, "dshi_3_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CarrierId).HasColumnName("carrierId");
            entity.Property(e => e.DeliveryId).HasColumnName("deliveryId");
            entity.Property(e => e.ShipperId).HasColumnName("shipperId");

            entity.HasOne(d => d.Carrier).WithMany(p => p.DeliveryShippers)
                .HasForeignKey(d => d.CarrierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dsh_3");

            entity.HasOne(d => d.Delivery).WithMany(p => p.DeliveryShippers)
                .HasForeignKey(d => d.DeliveryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dsh_1");

            entity.HasOne(d => d.Shipper).WithMany(p => p.DeliveryShippers)
                .HasForeignKey(d => d.ShipperId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dsh_2");
        });

        modelBuilder.Entity<DeliveryStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("delivery_status");

            entity.HasIndex(e => e.DeliveryId, "dst_1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DeliveryId).HasColumnName("deliveryId");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .HasColumnName("status");
            entity.Property(e => e.UpdateTime)
                .HasColumnType("datetime")
                .HasColumnName("updateTime");

            entity.HasOne(d => d.Delivery).WithMany(p => p.DeliveryStatuses)
                .HasForeignKey(d => d.DeliveryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ds_1");
        });

        modelBuilder.Entity<Function>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("function");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<Image>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("image");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(1000)
                .HasColumnName("imageUrl");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("menu");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.Icon)
                .HasMaxLength(255)
                .HasColumnName("icon");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.ParentId).HasColumnName("parentId");
            entity.Property(e => e.Path)
                .HasMaxLength(255)
                .HasColumnName("path");
            entity.Property(e => e.Subheader)
                .HasMaxLength(255)
                .HasColumnName("subheader");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orders");

            entity.HasIndex(e => e.CustomerId, "o_1_idx");

            entity.HasIndex(e => e.StaffId, "or2_idx");

            entity.HasIndex(e => e.OrderFromId, "or4_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.Note)
                .HasMaxLength(45)
                .HasColumnName("note");
            entity.Property(e => e.OrderFromId).HasColumnName("orderFromId");
            entity.Property(e => e.OrderTrackingCode)
                .HasMaxLength(45)
                .HasColumnName("orderTrackingCode");
            entity.Property(e => e.PriceUnit)
                .HasMaxLength(45)
                .HasColumnName("priceUnit");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.StaffId).HasColumnName("staffId");
            entity.Property(e => e.TotalPrice).HasColumnName("totalPrice");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("or1");

            entity.HasOne(d => d.OrderFrom).WithMany(p => p.Orders)
                .HasForeignKey(d => d.OrderFromId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("or3");

            entity.HasOne(d => d.Staff).WithMany(p => p.Orders)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("or2");
        });

        modelBuilder.Entity<OrderDelivery>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("order_delivery");

            entity.Property(e => e.AttributeGroup)
                .HasMaxLength(45)
                .HasColumnName("attributeGroup");
            entity.Property(e => e.CustomerName)
                .HasMaxLength(45)
                .HasColumnName("customerName");
            entity.Property(e => e.DeliveryPrice).HasColumnName("deliveryPrice");
            entity.Property(e => e.DeliveryTime)
                .HasColumnType("datetime")
                .HasColumnName("deliveryTime");
            entity.Property(e => e.DeliveryTrackingCode)
                .HasMaxLength(45)
                .HasColumnName("deliveryTrackingCode");
            entity.Property(e => e.OrderFrom)
                .HasMaxLength(45)
                .HasColumnName("orderFrom");
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(45)
                .HasColumnName("orderStatus");
            entity.Property(e => e.OrderTrackingCode)
                .HasMaxLength(45)
                .HasColumnName("orderTrackingCode");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(45)
                .HasColumnName("paymentMethod");
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(45)
                .HasColumnName("paymentStatus");
            entity.Property(e => e.PickupAddress)
                .HasMaxLength(45)
                .HasColumnName("pickup_address");
            entity.Property(e => e.PickupTime)
                .HasColumnType("datetime")
                .HasColumnName("pickupTime");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.PriceUnit)
                .HasMaxLength(45)
                .HasColumnName("priceUnit");
            entity.Property(e => e.ProductName)
                .HasMaxLength(100)
                .HasColumnName("productName");
            entity.Property(e => e.PromotionCode)
                .HasMaxLength(45)
                .HasColumnName("promotionCode");
            entity.Property(e => e.ReceivingAddresses)
                .HasMaxLength(45)
                .HasColumnName("receiving_addresses");
            entity.Property(e => e.TotalPrice).HasColumnName("totalPrice");
        });

        modelBuilder.Entity<OrderDeliveryPrice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_delivery_price");

            entity.HasIndex(e => e.DeliveryId, "do_1_idx");

            entity.HasIndex(e => e.OrderId, "do_2_idx");

            entity.HasIndex(e => e.DeliveryPriceId, "do_3_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DeliveryId).HasColumnName("deliveryId");
            entity.Property(e => e.DeliveryPriceId).HasColumnName("deliveryPriceId");
            entity.Property(e => e.Note)
                .HasMaxLength(45)
                .HasColumnName("note");
            entity.Property(e => e.OrderId).HasColumnName("orderId");

            entity.HasOne(d => d.Delivery).WithMany(p => p.OrderDeliveryPrices)
                .HasForeignKey(d => d.DeliveryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("do_1");

            entity.HasOne(d => d.DeliveryPrice).WithMany(p => p.OrderDeliveryPrices)
                .HasForeignKey(d => d.DeliveryPriceId)
                .HasConstraintName("do_3");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDeliveryPrices)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("do_2");
        });

        modelBuilder.Entity<OrderFrom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_from");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderFrom1)
                .HasMaxLength(45)
                .HasColumnName("orderFrom");
        });

        modelBuilder.Entity<OrderPayment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_payment");

            entity.HasIndex(e => e.OrderId, "opay_1_idx");

            entity.HasIndex(e => e.PaymentId, "opay_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.PaymentId).HasColumnName("paymentId");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderPayments)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("opay_1");

            entity.HasOne(d => d.Payment).WithMany(p => p.OrderPayments)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("opay_2");
        });

        modelBuilder.Entity<OrderProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_product");

            entity.HasIndex(e => e.AttributeGroupId, "opr3_idx");

            entity.HasIndex(e => e.OrderId, "opr_1_idx");

            entity.HasIndex(e => e.ProductId, "opr_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupId).HasColumnName("attributeGroupId");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Quantity).HasColumnName("quantity");

            entity.HasOne(d => d.AttributeGroup).WithMany(p => p.OrderProducts)
                .HasForeignKey(d => d.AttributeGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("opr3");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderProducts)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("opr1");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("opr2");
        });

        modelBuilder.Entity<OrderPromotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_promotions");

            entity.HasIndex(e => e.OrderId, "op_1_idx");

            entity.HasIndex(e => e.PromotionId, "op_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.PromotionId).HasColumnName("promotionId");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderPromotions)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("op1");

            entity.HasOne(d => d.Promotion).WithMany(p => p.OrderPromotions)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("op2");
        });

        modelBuilder.Entity<OrderStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_status");

            entity.HasIndex(e => e.OrderId, "ost1_idx");

            entity.HasIndex(e => e.StatusId, "ost2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.StatusId).HasColumnName("statusId");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderStatuses)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ost1");

            entity.HasOne(d => d.Status).WithMany(p => p.OrderStatuses)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ost2");
        });

        modelBuilder.Entity<OrderTax>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_tax");

            entity.HasIndex(e => e.OrderId, "ot_1_idx");

            entity.HasIndex(e => e.TaxId, "ot_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.TaxId).HasColumnName("taxId");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderTaxes)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ot1");

            entity.HasOne(d => d.Tax).WithMany(p => p.OrderTaxes)
                .HasForeignKey(d => d.TaxId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ot2");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payment");

            entity.HasIndex(e => e.PaymentStatusId, "ppm_1_idx");

            entity.HasIndex(e => e.PaymentMethodId, "ppm_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PaymentMethodId).HasColumnName("paymentMethodId");
            entity.Property(e => e.PaymentStatusId).HasColumnName("paymentStatusId");
            entity.Property(e => e.UpdateTime)
                .HasColumnType("datetime")
                .HasColumnName("updateTime");
            entity.Property(e => e.Value).HasColumnName("value");
            entity.Property(e => e.ValueUnit)
                .HasMaxLength(45)
                .HasColumnName("valueUnit");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentMethodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ppm_2");

            entity.HasOne(d => d.PaymentStatus).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ppm_1");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payment_method");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PaymentMethod1)
                .HasMaxLength(45)
                .HasColumnName("paymentMethod");
        });

        modelBuilder.Entity<PaymentStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payment_status");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PaymentStatus1)
                .HasMaxLength(45)
                .HasColumnName("paymentStatus");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("permission");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("products");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatorId).HasColumnName("creator_id");
            entity.Property(e => e.Depth).HasColumnName("depth");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.Height).HasColumnName("height");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Label)
                .HasMaxLength(45)
                .HasColumnName("label");
            entity.Property(e => e.Length).HasColumnName("length");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Sku)
                .HasMaxLength(45)
                .HasColumnName("sku");
            entity.Property(e => e.UnitLength)
                .HasMaxLength(45)
                .HasColumnName("unitLength");
            entity.Property(e => e.Weight).HasColumnName("weight");
            entity.Property(e => e.Width).HasColumnName("width");
        });

        modelBuilder.Entity<ProductAttributeGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("product_attribute_group");

            entity.HasIndex(e => e.ProductId, "pag1_idx");

            entity.HasIndex(e => e.GroupAttributeId, "pag2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GroupAttributeId).HasColumnName("groupAttributeId");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.UpdateAt)
                .HasMaxLength(45)
                .HasColumnName("update_at");

            entity.HasOne(d => d.GroupAttribute).WithMany(p => p.ProductAttributeGroups)
                .HasForeignKey(d => d.GroupAttributeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pag2");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductAttributeGroups)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pag1");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("product_images");

            entity.HasIndex(e => e.ProductId, "pi_1_idx");

            entity.HasIndex(e => e.ImageId, "pi_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImageId).HasColumnName("imageId");
            entity.Property(e => e.ProductId).HasColumnName("productId");

            entity.HasOne(d => d.Image).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ImageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pi2");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pi1");
        });

        modelBuilder.Entity<ProductPrice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("product_price");

            entity.HasIndex(e => e.PriceId, "ppr2_idx");

            entity.HasIndex(e => e.AttributeGroupId, "ppr3_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupId).HasColumnName("attributeGroupId");
            entity.Property(e => e.PriceId).HasColumnName("priceId");

            entity.HasOne(d => d.AttributeGroup).WithMany(p => p.ProductPrices)
                .HasForeignKey(d => d.AttributeGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ppr3");

            entity.HasOne(d => d.Price).WithMany(p => p.ProductPrices)
                .HasForeignKey(d => d.PriceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ppr2");
        });

        modelBuilder.Entity<ProductPriceState>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("product_price_state");

            entity.HasIndex(e => e.AttributeGroupId, "pps_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupId).HasColumnName("attributeGroupId");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.PriceUnit)
                .HasMaxLength(15)
                .HasColumnName("priceUnit");
            entity.Property(e => e.QuantityPercent).HasColumnName("quantityPercent");

            entity.HasOne(d => d.AttributeGroup).WithMany(p => p.ProductPriceStates)
                .HasForeignKey(d => d.AttributeGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pps_2");
        });

        modelBuilder.Entity<ProductPromotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("product_promotion");

            entity.HasIndex(e => e.ProductId, "pp_1_idx");

            entity.HasIndex(e => e.PromotionId, "pp_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.PromotionId).HasColumnName("promotionId");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductPromotions)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pp_1");

            entity.HasOne(d => d.Promotion).WithMany(p => p.ProductPromotions)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pp_2");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("promotions");

            entity.HasIndex(e => e.TypeId, "type_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AllowFreeShippng).HasColumnName("allowFreeShippng");
            entity.Property(e => e.Description)
                .HasMaxLength(45)
                .HasColumnName("description");
            entity.Property(e => e.ExpiryDate)
                .HasColumnType("datetime")
                .HasColumnName("expiryDate");
            entity.Property(e => e.MaximumSpend).HasColumnName("maximumSpend");
            entity.Property(e => e.MinimunSpend).HasColumnName("minimunSpend");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.SpendUnit)
                .HasMaxLength(45)
                .HasColumnName("spendUnit");
            entity.Property(e => e.StartDate)
                .HasColumnType("datetime")
                .HasColumnName("startDate");
            entity.Property(e => e.Status)
                .HasMaxLength(45)
                .HasColumnName("status");
            entity.Property(e => e.TypeId).HasColumnName("typeId");
            entity.Property(e => e.Value).HasColumnName("value");
            entity.Property(e => e.ValueUnit)
                .HasMaxLength(15)
                .HasColumnName("valueUnit");

            entity.HasOne(d => d.Type).WithMany(p => p.Promotions)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("type");
        });

        modelBuilder.Entity<PromotionType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("promotion_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Typename)
                .HasMaxLength(45)
                .HasColumnName("typename");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("role");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<RoleMenu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("role_menu");

            entity.HasIndex(e => e.RoleId, "FK_roleMenu_1");

            entity.HasIndex(e => e.MenuId, "FK_roleMenu_2");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.MenuId).HasColumnName("menuId");
            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");

            entity.HasOne(d => d.Menu).WithMany(p => p.RoleMenus)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_roleMenu_2");

            entity.HasOne(d => d.Role).WithMany(p => p.RoleMenus)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_roleMenu_1");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("role_permission");

            entity.HasIndex(e => e.RoleId, "FKRole_Permi239516");

            entity.HasIndex(e => e.PermissionId, "FKRole_Permi568197");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.PermissionId).HasColumnName("permissionID");
            entity.Property(e => e.RoleId).HasColumnName("roleID");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FKRole_Permi568197");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FKRole_Permi239516");
        });

        modelBuilder.Entity<Shipper>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("shipper");

            entity.HasIndex(e => e.CarrierId, "shi1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CarrierId).HasColumnName("carrierId");
            entity.Property(e => e.Email)
                .HasMaxLength(45)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(45)
                .HasColumnName("phoneNumber");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Carrier).WithMany(p => p.Shippers)
                .HasForeignKey(d => d.CarrierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("shi1");
        });

        modelBuilder.Entity<StaffUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("staff_user");

            entity.HasIndex(e => e.StoreId, "sus1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Possition)
                .HasMaxLength(45)
                .HasColumnName("possition");
            entity.Property(e => e.StoreId).HasColumnName("storeId");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Store).WithMany(p => p.StaffUsers)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sus1");
        });

        modelBuilder.Entity<StatusesOfOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("statuses_of_order");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Status)
                .HasMaxLength(45)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("stores");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(45)
                .HasColumnName("description");
            entity.Property(e => e.Manager).HasColumnName("manager");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
        });

        modelBuilder.Entity<StoreAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("store_address");

            entity.HasIndex(e => e.StoreId, "sad_1_idx");

            entity.HasIndex(e => e.AddressId, "sad_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AddressId).HasColumnName("addressId");
            entity.Property(e => e.StoreId).HasColumnName("storeId");

            entity.HasOne(d => d.Address).WithMany(p => p.StoreAddresses)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("stad2");

            entity.HasOne(d => d.Store).WithMany(p => p.StoreAddresses)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("stad1");
        });

        modelBuilder.Entity<StoreImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("store_images");

            entity.HasIndex(e => e.ImageId, "si_1_idx");

            entity.HasIndex(e => e.StoreId, "si_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImageId).HasColumnName("imageId");
            entity.Property(e => e.StoreId).HasColumnName("storeId");

            entity.HasOne(d => d.Image).WithMany(p => p.StoreImages)
                .HasForeignKey(d => d.ImageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sim1");

            entity.HasOne(d => d.Store).WithMany(p => p.StoreImages)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sim2");
        });

        modelBuilder.Entity<StorePromotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("store_promotions");

            entity.HasIndex(e => e.StoreId, "sp_1_idx");

            entity.HasIndex(e => e.PromotionId, "sp_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PromotionId).HasColumnName("promotionId");
            entity.Property(e => e.StoreId).HasColumnName("storeId");

            entity.HasOne(d => d.Promotion).WithMany(p => p.StorePromotions)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("spr2");

            entity.HasOne(d => d.Store).WithMany(p => p.StorePromotions)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("spr1");
        });

        modelBuilder.Entity<StoreWarehouse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("store_warehouse");

            entity.HasIndex(e => e.StoreId, "sinv1_idx");

            entity.HasIndex(e => e.WarehouseId, "sinv2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("storeId");
            entity.Property(e => e.WarehouseId).HasColumnName("warehouseId");

            entity.HasOne(d => d.Store).WithMany(p => p.StoreWarehouses)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sinv1");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.StoreWarehouses)
                .HasForeignKey(d => d.WarehouseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sinv2");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(45)
                .HasColumnName("description");
            entity.Property(e => e.ManagerId).HasColumnName("managerId");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<SupplierAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_address");

            entity.HasIndex(e => e.SupplierId, "sua_1_idx");

            entity.HasIndex(e => e.AddressId, "sua_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AddressId).HasColumnName("addressId");
            entity.Property(e => e.SupplierId).HasColumnName("supplierId");

            entity.HasOne(d => d.Address).WithMany(p => p.SupplierAddresses)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sad2");

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierAddresses)
                .HasForeignKey(d => d.SupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sad1");
        });

        modelBuilder.Entity<SupplierImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_image");

            entity.HasIndex(e => e.SupplierId, "sui_1_idx");

            entity.HasIndex(e => e.ImageId, "sui_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImageId).HasColumnName("imageId");
            entity.Property(e => e.SupplierId).HasColumnName("supplierId");

            entity.HasOne(d => d.Image).WithMany(p => p.SupplierImages)
                .HasForeignKey(d => d.ImageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("suim2");

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierImages)
                .HasForeignKey(d => d.SupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("suim1");
        });

        modelBuilder.Entity<SupplierInventory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_inventory");

            entity.HasIndex(e => e.SupplierId, "sinv_1_idx");

            entity.HasIndex(e => e.InventotyId, "sinv_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.InventotyId).HasColumnName("inventotyId");
            entity.Property(e => e.SupplierId).HasColumnName("supplierId");

            entity.HasOne(d => d.Inventoty).WithMany(p => p.SupplierInventories)
                .HasForeignKey(d => d.InventotyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sinv_2");

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierInventories)
                .HasForeignKey(d => d.SupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sinv_1");
        });

        modelBuilder.Entity<SupplierOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_order");

            entity.HasIndex(e => e.StoreId, "so_1_idx");

            entity.HasIndex(e => e.SupplierId, "so_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("storeId");
            entity.Property(e => e.SupplierId).HasColumnName("supplierId");

            entity.HasOne(d => d.Store).WithMany(p => p.SupplierOrders)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("suor1");

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierOrders)
                .HasForeignKey(d => d.SupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("suor2");
        });

        modelBuilder.Entity<SupplierOrderStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_order_status");

            entity.HasIndex(e => e.SupplierOrderId, "sost_1_idx");

            entity.HasIndex(e => e.StatusId, "sost_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StatusId).HasColumnName("statusId");
            entity.Property(e => e.SupplierOrderId).HasColumnName("supplierOrderId");

            entity.HasOne(d => d.Status).WithMany(p => p.SupplierOrderStatuses)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sost_2");

            entity.HasOne(d => d.SupplierOrder).WithMany(p => p.SupplierOrderStatuses)
                .HasForeignKey(d => d.SupplierOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sost_1");
        });

        modelBuilder.Entity<SupplierProductOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_product_order");

            entity.HasIndex(e => e.ProductId, "spo_1_idx");

            entity.HasIndex(e => e.AttributeGroupProductId, "spo_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupProductId).HasColumnName("attributeGroupProductId");
            entity.Property(e => e.ProductId).HasColumnName("productId");

            entity.HasOne(d => d.AttributeGroupProduct).WithMany(p => p.SupplierProductOrders)
                .HasForeignKey(d => d.AttributeGroupProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("spo_2");

            entity.HasOne(d => d.Product).WithMany(p => p.SupplierProductOrders)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("spo_1");
        });

        modelBuilder.Entity<SupplierProductPrice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("supplier_product_price");

            entity.HasIndex(e => e.ProductId, "spp_1_idx");

            entity.HasIndex(e => e.AttributeGroupProductId, "spp_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupProductId).HasColumnName("attributeGroupProductId");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.PriceUnit)
                .HasMaxLength(45)
                .HasColumnName("priceUnit");
            entity.Property(e => e.ProductId).HasColumnName("productId");

            entity.HasOne(d => d.AttributeGroupProduct).WithMany(p => p.SupplierProductPrices)
                .HasForeignKey(d => d.AttributeGroupProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("spp_2");

            entity.HasOne(d => d.Product).WithMany(p => p.SupplierProductPrices)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("spp_1");
        });

        modelBuilder.Entity<Tax>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tax");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(45)
                .HasColumnName("type");
            entity.Property(e => e.Variable).HasColumnName("variable");
            entity.Property(e => e.VariableUnit)
                .HasMaxLength(45)
                .HasColumnName("variableUnit");
        });

        modelBuilder.Entity<TaxProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tax_product");

            entity.HasIndex(e => e.ProductId, "tp_1_idx");

            entity.HasIndex(e => e.TaxId, "tp_2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.TaxId).HasColumnName("taxId");

            entity.HasOne(d => d.Product).WithMany(p => p.TaxProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tp_1");

            entity.HasOne(d => d.Tax).WithMany(p => p.TaxProducts)
                .HasForeignKey(d => d.TaxId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tp_2");
        });

        modelBuilder.Entity<Token>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tokens");

            entity.HasIndex(e => e.UserId, "FKTokens266803");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Issue)
                .HasMaxLength(255)
                .HasColumnName("issue");
            entity.Property(e => e.Token1)
                .HasMaxLength(255)
                .HasColumnName("token");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
            entity.Property(e => e.UserId).HasColumnName("userID");

            entity.HasOne(d => d.User).WithMany(p => p.Tokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FKTokens266803");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.BirthDate)
                .HasColumnType("date")
                .HasColumnName("birthDate");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Enable).HasColumnName("enable");
            entity.Property(e => e.FirstName)
                .HasMaxLength(255)
                .HasColumnName("firstName");
            entity.Property(e => e.Gender).HasColumnName("gender");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.IsTeacher).HasColumnName("isTeacher");
            entity.Property(e => e.LastName)
                .HasMaxLength(255)
                .HasColumnName("lastName");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(255)
                .HasColumnName("phone");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
            entity.Property(e => e.UserName)
                .HasMaxLength(255)
                .HasColumnName("userName");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user_role");

            entity.HasIndex(e => e.UserId, "FKUser_Role107067");

            entity.HasIndex(e => e.RoleId, "FKUser_Role628471");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("date")
                .HasColumnName("createDate");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.RoleId).HasColumnName("roleID");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("date")
                .HasColumnName("updateDate");
            entity.Property(e => e.UserId).HasColumnName("userID");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FKUser_Role628471");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FKUser_Role107067");
        });

        modelBuilder.Entity<UserTimeSheet>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user_time_sheet");

            entity.HasIndex(e => e.UserId, "uts_1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CheckInTime)
                .HasMaxLength(45)
                .HasColumnName("checkInTime");
            entity.Property(e => e.CheckOutTime)
                .HasMaxLength(45)
                .HasColumnName("checkOutTime");
            entity.Property(e => e.UserId).HasColumnName("userId");
        });

        modelBuilder.Entity<ValuesOfAttributeGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("values_of_attribute_group");

            entity.HasIndex(e => e.GroupAttributeId, "avg1_idx");

            entity.HasIndex(e => e.ValueId, "avg2_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GroupAttributeId).HasColumnName("groupAttributeId");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.UpdateAt)
                .HasMaxLength(45)
                .HasColumnName("update_at");
            entity.Property(e => e.ValueId).HasColumnName("valueId");

            entity.HasOne(d => d.GroupAttribute).WithMany(p => p.ValuesOfAttributeGroups)
                .HasForeignKey(d => d.GroupAttributeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("avg1");

            entity.HasOne(d => d.Value).WithMany(p => p.ValuesOfAttributeGroups)
                .HasForeignKey(d => d.ValueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("avg2");
        });

        modelBuilder.Entity<Variant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("variants");

            entity.HasIndex(e => e.ProductId, "va1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AverageRating)
                .HasPrecision(4)
                .HasColumnName("average_rating");
            entity.Property(e => e.Backordered)
                .HasMaxLength(5)
                .HasColumnName("backordered");
            entity.Property(e => e.Backorders)
                .HasMaxLength(2)
                .HasColumnName("backorders");
            entity.Property(e => e.BackordersAllowed)
                .HasMaxLength(5)
                .HasColumnName("backorders_allowed");
            entity.Property(e => e.ButtonText)
                .HasMaxLength(45)
                .HasColumnName("button_text");
            entity.Property(e => e.CatalogVisibility)
                .HasMaxLength(7)
                .HasColumnName("catalog_visibility");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("date_created");
            entity.Property(e => e.DateCreatedGmt)
                .HasColumnType("datetime")
                .HasColumnName("date_created_gmt");
            entity.Property(e => e.DateModified)
                .HasColumnType("datetime")
                .HasColumnName("date_modified");
            entity.Property(e => e.DateModifiedGmt)
                .HasColumnType("datetime")
                .HasColumnName("date_modified_gmt");
            entity.Property(e => e.DateOnSaleFrom)
                .HasColumnType("datetime")
                .HasColumnName("date_on_sale_from");
            entity.Property(e => e.DateOnSaleFromGmt)
                .HasColumnType("datetime")
                .HasColumnName("date_on_sale_from_gmt");
            entity.Property(e => e.DateOnSaleTo)
                .HasColumnType("datetime")
                .HasColumnName("date_on_sale_to");
            entity.Property(e => e.DateOnSaleToGmt)
                .HasColumnType("datetime")
                .HasColumnName("date_on_sale_to_gmt");
            entity.Property(e => e.Description)
                .HasMaxLength(286)
                .HasColumnName("description");
            entity.Property(e => e.Featured)
                .HasMaxLength(5)
                .HasColumnName("featured");
            entity.Property(e => e.Images)
                .HasColumnType("text")
                .HasColumnName("images");
            entity.Property(e => e.ManageStock)
                .HasMaxLength(5)
                .HasColumnName("manage_stock");
            entity.Property(e => e.MenuOrder).HasColumnName("menu_order");
            entity.Property(e => e.Name)
                .HasMaxLength(15)
                .HasColumnName("name");
            entity.Property(e => e.OnSale)
                .HasMaxLength(5)
                .HasColumnName("on_sale");
            entity.Property(e => e.Permalink)
                .HasMaxLength(47)
                .HasColumnName("permalink");
            entity.Property(e => e.Price)
                .HasPrecision(5)
                .HasColumnName("price");
            entity.Property(e => e.PriceHtml)
                .HasMaxLength(113)
                .HasColumnName("price_html");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Purchasable)
                .HasMaxLength(4)
                .HasColumnName("purchasable");
            entity.Property(e => e.PurchaseNote)
                .HasMaxLength(30)
                .HasColumnName("purchase_note");
            entity.Property(e => e.RatingCount).HasColumnName("rating_count");
            entity.Property(e => e.RegularPrice)
                .HasPrecision(5)
                .HasColumnName("regular_price");
            entity.Property(e => e.ReviewsAllowed)
                .HasMaxLength(4)
                .HasColumnName("reviews_allowed");
            entity.Property(e => e.SalePrice)
                .HasMaxLength(30)
                .HasColumnName("sale_price");
            entity.Property(e => e.ShippingClass)
                .HasMaxLength(30)
                .HasColumnName("shipping_class");
            entity.Property(e => e.ShippingClassId).HasColumnName("shipping_class_id");
            entity.Property(e => e.ShippingRequired)
                .HasMaxLength(4)
                .HasColumnName("shipping_required");
            entity.Property(e => e.ShippingTaxable)
                .HasMaxLength(4)
                .HasColumnName("shipping_taxable");
            entity.Property(e => e.ShortDescription)
                .HasMaxLength(101)
                .HasColumnName("short_description");
            entity.Property(e => e.Sku)
                .HasMaxLength(30)
                .HasColumnName("sku");
            entity.Property(e => e.Slug)
                .HasMaxLength(18)
                .HasColumnName("slug");
            entity.Property(e => e.SoldIndividually)
                .HasMaxLength(5)
                .HasColumnName("sold_individually");
            entity.Property(e => e.Status)
                .HasMaxLength(7)
                .HasColumnName("status");
            entity.Property(e => e.StockQuantity).HasColumnName("stock_quantity");
            entity.Property(e => e.StockStatus)
                .HasMaxLength(7)
                .HasColumnName("stock_status");
            entity.Property(e => e.TaxClass)
                .HasMaxLength(30)
                .HasColumnName("tax_class");
            entity.Property(e => e.TaxStatus)
                .HasMaxLength(7)
                .HasColumnName("tax_status");
            entity.Property(e => e.TotalSales).HasColumnName("total_sales");
            entity.Property(e => e.Type)
                .HasMaxLength(6)
                .HasColumnName("type");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Weight)
                .HasMaxLength(30)
                .HasColumnName("weight");

            entity.HasOne(d => d.Product).WithMany(p => p.Variants)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("va1");
        });

        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("warehouse");

            entity.HasIndex(e => e.AddressId, "inv_1_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AddressId).HasColumnName("addressId");
            entity.Property(e => e.NameWarehouse)
                .HasMaxLength(45)
                .HasColumnName("nameWarehouse");

            entity.HasOne(d => d.Address).WithMany(p => p.Warehouses)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("inv_1");
        });

        modelBuilder.Entity<WarehouseProduct>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("warehouse_product");

            entity.HasIndex(e => e.ProductId, "ipr_1_idx");

            entity.HasIndex(e => e.AttributeGroupId, "ipr_2_idx");

            entity.HasIndex(e => e.WarehouseId, "ipr_3_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttributeGroupId).HasColumnName("attributeGroupId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.WarehouseId).HasColumnName("warehouseId");

            entity.HasOne(d => d.AttributeGroup).WithMany(p => p.WarehouseProducts)
                .HasForeignKey(d => d.AttributeGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ipr_3");

            entity.HasOne(d => d.Product).WithMany(p => p.WarehouseProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ipr_1");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.WarehouseProducts)
                .HasForeignKey(d => d.WarehouseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ipr_2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
