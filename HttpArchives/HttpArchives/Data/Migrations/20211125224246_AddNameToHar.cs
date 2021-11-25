using Microsoft.EntityFrameworkCore.Migrations;

namespace HttpArchives.Data.Migrations
{
    public partial class AddNameToHar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "HarFiles",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "HarFiles");
        }
    }
}
