using HttpArchives.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HttpArchives.Services
{
    public interface IHarFileService
    {
        Task<HarFileModel> CreateHarFileAsync(string fileName, string content, string description, string folderName);

        IEnumerable<HarFileModel> GetAllHarFiles();

        string GetHarFileContent(string fileName);

        Task ChangeHarFileFolderNameAsync(string fileName, string newFolderName);
    }
}
