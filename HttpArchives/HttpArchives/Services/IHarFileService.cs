using System.Threading.Tasks;

namespace HttpArchives.Services
{
    public interface IHarFileService
    {
        Task<int> CreateHarFileAsync(string fileName, string content, string description);
    }
}
