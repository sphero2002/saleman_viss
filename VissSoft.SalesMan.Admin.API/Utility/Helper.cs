using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObjects;
using VissSoft.SalesMan.Admin.DataAccessLayer.DataObject;
using VissSoft.SalesMan.Admin.DataAccessLayer.Data;

namespace VissSoft.SalesMan.Admin.API.Utility
{
    public class Helper
    {
        public static List<T> RawSqlQuery<T>(string query, Func<DbDataReader, T> map)
        {
            using (var context = new DataContext())
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
    }
}
