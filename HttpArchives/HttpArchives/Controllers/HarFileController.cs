using HttpArchives.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HttpArchives.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HarFileController : ControllerBase
    {
        private readonly IHarFileService harFileService;

        public HarFileController(IHarFileService harFileService)
        {
            this.harFileService = harFileService;
        }

        [HttpPost]
        public async Task Create([FromBody] HarFileInputModel input)
        {
            await harFileService.CreateHarFileAsync(input.Name, input.Content, input.Description, input.FolderName);
        }
    }
    public class HarFileInputModel
    {
        public string Name { get; set; }

        public string Content { get; set; }

        public string Description { get; set; }

        public string FolderName { get; set; }
    }
}
