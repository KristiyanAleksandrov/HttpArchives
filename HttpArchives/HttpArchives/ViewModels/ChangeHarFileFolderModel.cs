using System.ComponentModel.DataAnnotations;

namespace HttpArchives.ViewModels
{
    public class ChangeHarFileFolderModel
    {
        [Required(ErrorMessage = "File name is required"), StringLength(100, ErrorMessage = "Name length can't be more than 100.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Folder name is required"), StringLength(100, ErrorMessage = "FolderName length can't be more than 100.")]
        public string FolderName { get; set; }
    }
}
