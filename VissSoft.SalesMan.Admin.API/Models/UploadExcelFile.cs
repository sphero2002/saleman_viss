namespace VissSoft.SalesMan.Admin.API.Models
{
    public class UploadExcelFileRequest
    {
        public IFormFile File { get; set; }
    }

    public class UploadExcelFileResponse
    {
        public bool IsSuccess { get; set; }
    }
    public class  ExcelBulkUploadUserParameter
    {
        public bool IsSuccess { get; set; }
    }
    
   
}
