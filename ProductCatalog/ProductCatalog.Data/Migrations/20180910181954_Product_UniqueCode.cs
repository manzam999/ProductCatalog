using Microsoft.EntityFrameworkCore.Migrations;

namespace ProductCatalog.Data.Migrations
{
    public partial class Product_UniqueCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "AlternateKey_Code",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "AlternateKey_Code",
                table: "Products",
                column: "Code",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "AlternateKey_Code",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "AlternateKey_Code",
                table: "Products",
                column: "Code");
        }
    }
}
