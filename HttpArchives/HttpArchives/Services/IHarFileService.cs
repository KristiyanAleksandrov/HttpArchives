using System.Threading.Tasks;

namespace HttpArchives.Services
{
    public interface IHarFileService
    {
        Task<int> CreateHarFileAsync(string content, string description);
    }
}
