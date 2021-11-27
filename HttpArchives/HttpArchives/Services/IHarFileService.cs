using HttpArchives.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HttpArchives.Services
{
    public interface IHarFileService
    {
        Task<int> CreateHarFileAsync(string fileName, string content, string description, string folderName);

        IEnumerable<HarFileModel> GetAllHarFiles();

        string GetHarFileContent(string fileName);
    }
}
