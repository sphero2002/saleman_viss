using VissSoft.SalesMan.Admin.API.DTOs;
using System.Text.RegularExpressions;

namespace VissSoft.SalesMan.Admin.API.FolderTree
{
    public class BuildTree
    {
        public static List<Category> BuildTreeAndReturnRootNodes(List<Category> flatCategorys)
        {
            var byIdLookup = flatCategorys.ToLookup(i => i.Id);
            foreach (var item in flatCategorys)
            {
                if (item.ParentID != null)
                {
                    if (byIdLookup.Contains(item.ParentID.Value.ToString()))
                    {
                        var parent = byIdLookup[item.ParentID.Value.ToString()].First();
                        parent.Children.Add(item);
                    }
                }
            }
            return flatCategorys.Where(i => i.ParentID == null).ToList();
        }
    }
    public class TreeToFlatternBack
    {
        public static IEnumerable<Category> GetNodes(Category node)
        {
            if (node == null)
            {
                yield
                break;
            }

            yield
            return node;
            foreach (var n in node.Children)
            {
                foreach (var innerN in GetNodes(n))
                {
                    yield
                    return innerN;
                }
            }
        }
    }
}
