using Org.BouncyCastle.Bcpg.OpenPgp;
using System.Net;

namespace VissSoft.SalesMan.Admin.API.Models
{
    public class ServiceResponse<T>
    {
        public ServiceResponse()
        {
        }

        public ServiceResponse(Boolean status)
        {
            if (!status)
            {
                Status = false;
                ErrorCode = 400;
            }
        }

        public T? Data { get; set; }

        public int ErrorCode { get; set; } = 200;
        public bool Status { get; set; } = true;
        public string Message { get; set; } = "OK";
    }
}