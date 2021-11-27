using System.ComponentModel.DataAnnotations;

namespace HttpArchives.ViewModels
{
    public class HarFileInputModel
    {
        [StringLength(100, ErrorMessage = "Name length can't be more than 100.")]
        public string Name { get; set; }

        public string Content { get; set; }

        [StringLength(500, ErrorMessage = "Description length can't be more than 500.")]
        public string Description { get; set; }

        [StringLength(100, ErrorMessage = "FolderName length can't be more than 100.")]
        public string FolderName { get; set; }
    }
}
