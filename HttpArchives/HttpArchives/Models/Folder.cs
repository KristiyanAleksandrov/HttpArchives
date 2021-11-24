using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HttpArchives.Models
{
    public class Folder
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public int ParentId { get; set; }

        public IEnumerable<HarFile> HarFiles { get; set; }
    }
}
