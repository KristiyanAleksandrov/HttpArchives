using System.ComponentModel.DataAnnotations;

namespace HttpArchives.ViewModels
{
    public class HarFileInputModel
    {
        [Required(ErrorMessage = "File name is required"), StringLength(100, ErrorMessage = "Name length can't be more than 100.")]
        public string Name { get; set; }

        public string Content { get; set; }

        [Required(ErrorMessage = "Description is required"), StringLength(500, ErrorMessage = "Description length can't be more than 500.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Folder name is required"), StringLength(100, ErrorMessage = "FolderName length can't be more than 100.")]
        public string FolderName { get; set; }
    }
}
