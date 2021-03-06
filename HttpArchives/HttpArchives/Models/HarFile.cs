using System.ComponentModel.DataAnnotations;

namespace HttpArchives.Models
{
    public class HarFile
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public string Content { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [MaxLength(100)]
        public string FolderName { get; set; }
    }
}
