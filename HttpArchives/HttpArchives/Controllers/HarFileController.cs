using HttpArchives.Services;
using HttpArchives.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HttpArchives.Controllers
{
    [Authorize]
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
        public async Task<HarFileModel> Create([FromBody] HarFileInputModel input)
        {
            return await harFileService.CreateHarFileAsync(input.Name, input.Content, input.Description, input.FolderName);
        }

        [HttpGet]
        public IEnumerable<HarFileModel> GetAllHarFiles()
        {
            return harFileService.GetAllHarFiles();
        }

        [HttpGet("{fileName}")]
        public HarFileModel GetHarFileContent([FromRoute] string fileName)
        {
            return harFileService.GetHarFileContent(fileName);
        }

        [HttpPost]
        public async Task ChangeFileFolder([FromBody] ChangeHarFileFolderModel input)
        {
            await harFileService.ChangeHarFileFolderNameAsync(input.Name, input.FolderName);
        }
    }
}
