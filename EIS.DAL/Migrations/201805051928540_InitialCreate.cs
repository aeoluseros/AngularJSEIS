namespace EIS.DAL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Employee",
                c => new
                    {
                        EmployeeId = c.String(nullable: false, maxLength: 50),
                        Email = c.String(maxLength: 50),
                        Password = c.String(nullable: false, maxLength: 50),
                        FirstName = c.String(maxLength: 50),
                        LastName = c.String(maxLength: 50),
                        Gender = c.String(maxLength: 50),
                        Contact = c.String(maxLength: 50),
                        Address = c.String(maxLength: 200),
                        DOJ = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        Designation = c.String(maxLength: 50),
                        TotalExp = c.Double(),
                        RelevantExp = c.Double(),
                        BankName = c.String(maxLength: 50),
                        IFSCode = c.String(maxLength: 50),
                        AcNo = c.String(maxLength: 50),
                        PAN = c.String(maxLength: 50),
                        RoleId = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.EmployeeId)
                .ForeignKey("dbo.Role", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Role",
                c => new
                    {
                        RoleId = c.Int(nullable: false, identity: true),
                        RoleName = c.String(maxLength: 50),
                        RoleCode = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.RoleId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Employee", "RoleId", "dbo.Role");
            DropIndex("dbo.Employee", new[] { "RoleId" });
            DropTable("dbo.Role");
            DropTable("dbo.Employee");
        }
    }
}
