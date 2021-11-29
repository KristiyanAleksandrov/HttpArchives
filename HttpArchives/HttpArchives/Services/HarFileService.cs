using HttpArchives.Data;
using HttpArchives.Models;
using HttpArchives.ViewModels;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<HarFileModel> CreateHarFileAsync(string fileName, string content, string description, string folderName)
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

            return new HarFileModel()
            {
                Name = harFile.Name,
                FolderName = harFile.FolderName
            };
        }

        public IEnumerable<HarFileModel> GetAllHarFiles()
        {
            return db.HarFiles.Select(x => new HarFileModel()
            {
                Name = x.Name,
                FolderName = x.FolderName
            });
        }

        public HarFileModel GetHarFileContent(string fileName)
        {
            var harFile = db.HarFiles.FirstOrDefault(x => x.Name == fileName);
            if (harFile == null)
            {
                return null;
            }

            return new HarFileModel()
            {
                Description = harFile.Description,
                Content = harFile.Content
            };
        }

        public async Task ChangeHarFileFolderNameAsync(string fileName, string newFolderName)
        {
            var harFile = db.HarFiles.FirstOrDefault(x => x.Name == fileName);
            if (harFile != null)
            {
                harFile.FolderName = newFolderName;
                await db.SaveChangesAsync();
            }
        }
    }
}
