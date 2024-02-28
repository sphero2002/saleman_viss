using System.Security.Principal;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObjects;

namespace VissSoft.SalesMan.Admin.API.HTTP.SSO.JWT
{
    public interface IJwtTokenProvider
    {
        string CreateToken(IPrincipal userLogin);
    }
}
