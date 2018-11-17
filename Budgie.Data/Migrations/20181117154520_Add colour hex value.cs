using Microsoft.EntityFrameworkCore.Migrations;

namespace Budgie.Data.Migrations
{
    public partial class Addcolourhexvalue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColourHex",
                table: "Categories",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColourHex",
                table: "Categories");
        }
    }
}
