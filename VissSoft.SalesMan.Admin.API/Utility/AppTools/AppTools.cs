using AutoMapper;
using System.Security.Cryptography;
using System.Text;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

namespace VissSoft.SalesMan.Admin.API.Utility.AppTools
{
    public class AppTools : IAppTools
    {
        private readonly IConfiguration configuration;
        private readonly DataContext? datacontext;
        private readonly IMapper? mapper;

        public AppTools(DataContext? datacontext, IConfiguration configuration, IMapper? mapper)
        {
            this.configuration = configuration;
            this.datacontext = datacontext;
            this.mapper = mapper;
        }

        public string BackupDocument(string filename)
        {
            throw new NotImplementedException();
        }

        public string BackupDocumentPath()
        {
            return Path.Combine(GetBackupPath(), GetDocumentPath());
        }

        public string BackupImage(string filename)
        {
            throw new NotImplementedException();
        }

        public string BackupImagePath()
        {
            return Path.Combine(GetBackupPath(), GetImagePath());
        }

        public string CompactedGuild()
        {
            Guid g = Guid.NewGuid();
            string guidString = Convert.ToBase64String(g.ToByteArray());
            guidString = guidString.Replace("=", "");
            guidString = guidString.Replace("+", "");
            guidString = guidString.Replace("\\", "");
            guidString = guidString.Replace("/", "");
            return guidString;
        }

        public string CreateDocumentUrl(string filename)
        {
            return GetStaticURI() + "/" + GetStaticPath() + "/" + GetDocumentPath() + "/" + filename;
        }

        public string CreateImageUrl(string filename)
        {
            return GetStaticURI() + "/" + GetStaticPath() + "/" + GetImagePath() + "/" + filename;
        }

        public string DocumentPath()
        {
            return Path.Combine(GetStaticPath(), GetDocumentPath());
        }

        public bool EnsureDataFolders()
        {
            var static_path = GetStaticPath();
            var backup_path = GetBackupPath();
            var doc_path = GetDocumentPath();
            var img_path = GetImagePath();
            //static path
            Directory.CreateDirectory(static_path + Path.DirectorySeparatorChar + doc_path);
            Directory.CreateDirectory(static_path + Path.DirectorySeparatorChar + img_path);
            //backup path
            Directory.CreateDirectory(backup_path + Path.DirectorySeparatorChar + doc_path);
            Directory.CreateDirectory(backup_path + Path.DirectorySeparatorChar + img_path);
            return true;
        }

        public void EnsureSubFolder(string folder, string subfolder)
        {
            Directory.CreateDirectory(Path.Combine(folder, subfolder));
        }

        public string GenerateQRCode(string data)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.AppendLine(DateTime.Now.Ticks.ToString());
            stringBuilder.AppendLine(GetQRCodeSalt());
            stringBuilder.AppendLine(data);
            stringBuilder.AppendLine(CompactedGuild());
            return Sha256(stringBuilder.ToString());
        }

        public string GenerateToken(string data)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.AppendLine(DateTime.Now.Ticks.ToString());
            stringBuilder.AppendLine(GetTokenSalt());
            stringBuilder.AppendLine(data);
            stringBuilder.AppendLine(CompactedGuild());
            return Sha256(stringBuilder.ToString());
        }

        public T GetAppSettingValue<T>(string key, T default_value)
        {
            if (configuration != null)
            {
                return configuration!.GetValue<T>("AppSettings:" + key, default_value);
            }
            return default(T);
        }

        public string GetBackupPath()
        {
            return GetAppSettingValue<string>("backup_path", "backup");
        }

        public string GetDefaultRoleIds()
        {
            return GetAppSettingValue<string>("default_role_ids", "");
        }

        public string GetDocumentPath()
        {
            return GetAppSettingValue<string>("document_path", "documents");
        }

        public string GetFileExtensionFromUrl(string url)
        {
            throw new NotImplementedException();
        }

        public string GetImagePath()
        {
            return GetAppSettingValue<string>("image_path", "images");
        }

        public string GetPasswordSalt()
        {
            throw new NotImplementedException();
        }

        public string GetQRCodeSalt()
        {
            return GetAppSettingValue<string>("PasswordSalt", "");
        }

        public string GetStaticPath()
        {
            return GetAppSettingValue<string>("static_path", "public");
        }

        public string GetStaticURI()
        {
            return GetAppSettingValue<string>("static_uri", "");
        }

        public Task<Token> GetTokenInfo(string token)
        {
            throw new NotImplementedException();
        }

        public int GetTokenLifeTime()
        {
            return GetAppSettingValue<int>("token_life_time", 180);
        }

        public string GetTokenSalt()
        {
            return GetAppSettingValue<string>("TokenSalt", "");
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public string ImagePath()
        {
            return Path.Combine(GetStaticPath(), GetImagePath());
        }

        public string RestoreDocument(string filename)
        {
            throw new NotImplementedException();
        }

        public string RestoreImage(string filename)
        {
            throw new NotImplementedException();
        }

        public async Task<string> SaveDocumentAsync(IFormFile file, string subfolder, string defaultFilename)
        {
            string result = "";
            if (file != null && file.Length > 0)
            {
                //filter file extension
                string imageExtension = Path.GetExtension(file.FileName).ToLower();
                var localFilePath = DocumentPath();
                if (!string.IsNullOrEmpty(localFilePath) && (imageExtension == ".doc" || imageExtension == ".docx" || imageExtension == ".xls" || imageExtension == ".xlsx" || imageExtension == ".pdf" || imageExtension == ".ppt" || imageExtension == ".pptx" || imageExtension == ".txt"))
                {
                    //create sub folder if any
                    if (!string.IsNullOrEmpty(subfolder))
                    {
                        localFilePath = Path.Combine(localFilePath, subfolder);
                    }
                    //create folder if not existed
                    Directory.CreateDirectory(localFilePath);
                    //create filename
                    string imageFileName = $"{DateTime.UtcNow.Ticks}_{CompactedGuild()}{imageExtension}";
                    string imageFullPath = Path.Combine(localFilePath, imageFileName);
                    //save data
                    using (var imageStream = new FileStream(imageFullPath, FileMode.Create, FileAccess.Write))
                    {
                        await file.CopyToAsync(imageStream);
                    }
                    result = !string.IsNullOrEmpty(subfolder) ? subfolder + "/" + imageFileName : imageFileName;
                }
            }
            return result;
        }

        public async Task<string> SaveImageAsync(IFormFile file, string subfolder, string defaultFilename)
        {
            string result = "";
            if (file != null && file.Length > 0)
            {
                //filter file extension
                string imageExtension = Path.GetExtension(file.FileName).ToLower();
                var localFilePath = ImagePath();
                if (!string.IsNullOrEmpty(localFilePath) && (imageExtension == ".jpg" || imageExtension == ".jpeg" || imageExtension == ".png"))
                {
                    //create sub folder if any
                    if (!string.IsNullOrEmpty(subfolder))
                    {
                        localFilePath = Path.Combine(localFilePath, subfolder);
                    }
                    //create folder if not existed
                    Directory.CreateDirectory(localFilePath);
                    //create filename
                    string imageFileName = $"{DateTime.UtcNow.Ticks}_{CompactedGuild()}{imageExtension}";
                    string imageFullPath = Path.Combine(localFilePath, imageFileName);
                    //save data
                    using (var imageStream = new FileStream(imageFullPath, FileMode.Create, FileAccess.Write))
                    {
                        await file.CopyToAsync(imageStream);
                    }
                    result = !string.IsNullOrEmpty(subfolder) ? subfolder + "/" + imageFileName : imageFileName;
                }
            }
            return result;
        }

        public async Task<string> SaveImageFromURLAsync(string imgUrl, string subfolder, string defaultFilename)
        {
            string result = "";

            if (!string.IsNullOrEmpty(imgUrl) && (imgUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase) || imgUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase)))
            {
                var localFilePath = ImagePath();
                string imageExtension = GetFileExtensionFromUrl(imgUrl);
                if (!string.IsNullOrEmpty(localFilePath) && (imageExtension == ".jpg" || imageExtension == ".jpeg" || imageExtension == ".png"))
                {
                    using (var httpClient = new HttpClient())
                    {
                        var data = await httpClient.GetByteArrayAsync(imgUrl);
                        if (data.Length > 0)
                        {
                            //create sub folder if any
                            if (!string.IsNullOrEmpty(subfolder))
                            {
                                localFilePath = Path.Combine(localFilePath, subfolder);
                            }
                            //create folder if not existed
                            Directory.CreateDirectory(localFilePath);
                            //create filename
                            string imageFileName = $"{DateTime.UtcNow.Ticks}_{CompactedGuild()}{imageExtension}";
                            string imageFullPath = Path.Combine(localFilePath, imageFileName);
                            //save data
                            using (var imageStream = new FileStream(imageFullPath, FileMode.Create, FileAccess.Write))
                            {
                                await imageStream.WriteAsync(data);
                            }
                            result = !string.IsNullOrEmpty(subfolder) ? subfolder + "/" + imageFileName : imageFileName;
                        }
                    }
                }
            }
            return result;
        }

        public string Sha256(string data)
        {
            var inputBytes = Encoding.UTF8.GetBytes(data);
            var inputHash = SHA256.HashData(inputBytes);
            return Convert.ToHexString(inputHash).ToLower();
        }

        public string Sha512(string data)
        {
            var inputBytes = Encoding.UTF8.GetBytes(data);
            var inputHash = SHA512.HashData(inputBytes);
            return Convert.ToHexString(inputHash).ToLower();
        }

        public bool VerifyPassword(string password, string hashed_password)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashed_password);
        }
    }
}
