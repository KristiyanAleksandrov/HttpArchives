using HttpArchives.Data;
using HttpArchives.Models;
using System.Threading.Tasks;

namespace HttpArchives.Services
{
    public class HarFileService : IHarFileService
    {
        private readonly ApplicationDbContext db;

        public HarFileService(ApplicationDbContext applicationDbContext)
        {
            this.db = applicationDbContext;
        }
        public async Task<int> CreateHarFileAsync(string fileName, string content, string description, string folderName)
        {
            var harFile = new HarFile()
            {
                Name = fileName,
                Content = content,
                Description = description,
                FolderName = folderName
            };

            await db.HarFiles.AddAsync(harFile);
            await db.SaveChangesAsync();

            return harFile.Id;
        }
    }
}
