using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HttpArchives.Models
{
    public class Folder
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public Folder Parent { get; set; }

        public IEnumerable<Folder> Children { get; set; }

        public IEnumerable<HarFile> HarFiles { get; set; }
    }
}
