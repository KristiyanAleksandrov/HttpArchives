using HttpArchives.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HttpArchives.Controllers
{
    public class HarFileController : ControllerBase
    {
        private readonly IHarFileService harFileService;

        public HarFileController(IHarFileService harFileService)
        {
            this.harFileService = harFileService;
        }

        [HttpPost]
        public async Task Create(string content, string description)
        {
            await harFileService.CreateHarFileAsync(content, description);
        }
    }
}
