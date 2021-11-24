namespace HttpArchives.Models
{
    public class HarFile
    {
        public int Id { get; set; }

        public string Content { get; set; }

        public int FolderId { get; set; }

        public Folder Folder { get; set; }
    }
}
