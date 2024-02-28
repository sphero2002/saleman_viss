using VissSoft.SalesMan.Admin.API.DTOs;

namespace VissSoft.SalesMan.Admin.API.FolderTree
{
    public class Category
    {
        private string id;
        private int? parentID;
        private string name;
        private List<Category> children = new List<Category>();

        public string Id { get => id; set => id = value; }
        public List<Category> Children { get => children; set => children = value; }
        public string Name { get => name; set => name = value; }
        public int? ParentID { get => parentID; set => parentID = value; }
    }
}
