using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;

namespace VissSoft.SalesMan.Admin.API.Utility.AppTools
{
    public interface IAppTools
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashed_password);
        T GetAppSettingValue<T>(string key, T default_value);
        string GetPasswordSalt();
        string GetTokenSalt();
        string GetQRCodeSalt();
        int GetTokenLifeTime();
        string GetDefaultRoleIds();
        string GetStaticURI();
        string GetStaticPath();
        string GetBackupPath();
        string GetDocumentPath();
        string GetImagePath();
        string CreateImageUrl(string filename);
        string CreateDocumentUrl(string filename);
        string BackupDocument(string filename);
        string BackupImage(string filename);
        string RestoreDocument(string filename);
        string RestoreImage(string filename);
        bool EnsureDataFolders();
        string DocumentPath();
        string ImagePath();
        string BackupDocumentPath();
        string BackupImagePath();
        void EnsureSubFolder(string folder, string subfolder);
        string Sha256(string data);
        string Sha512(string data);
        string CompactedGuild();
        string GenerateToken(string data);
        string GenerateQRCode(string data);
        Task<string> SaveImageAsync(IFormFile? file, string? subfolder, string? defaultFilename);
        Task<string> SaveDocumentAsync(IFormFile? file, string? subfolder, string? defaultFilename);

        Task<Token?> GetTokenInfo(string token);

        Task<string> SaveImageFromURLAsync(string? imgUrl, string? subfolder, string? defaultFilename);
        string GetFileExtensionFromUrl(string url);
    }
}
