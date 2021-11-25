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
        public async Task<int> CreateHarFileAsync(string content, string description)
        {
            var harFile = new HarFile()
            {
                Content = content,
                Description = description
            };

            await db.HarFiles.AddAsync(harFile);
            await db.SaveChangesAsync();

            return harFile.Id;
        }
    }
}
