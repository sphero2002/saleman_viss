namespace VissSoft.SalesMan.Admin.API.Models
{
    public class OwnerParameters
    {
        const int maxPageSize = 100;
        public int pageIndex { get; set; } = 1;
        private int _pageSize = 10;
        public int pageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = (value > maxPageSize) ? maxPageSize : value;
            }
        }
    }
}
