using EIS.BOL;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.DAL
{
    public class EISDBContext : DbContext
    {
        public EISDBContext():base("EISDB")  //the pass-in parameter is either connectionstring name or the database name
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<EISDBContext, EIS.DAL.Migrations.Configuration>());

            //If DbContext.Configuration.ProxyCreationEnabled is set to false, DbContext will not load child objects for some parent object 
            //unless Include method is called on parent object.Setting DbContext.Configuration.LazyLoadingEnabled to true or false will have 
            //no impact on its behaviours. If DbContext.Configuration.ProxyCreationEnabled is set to true, child objects will be loaded 
            //automatically, and DbContext.Configuration.LazyLoadingEnabled value will control when child objects are loaded.
            //So setting it to true will cause serilaization error in WebApi.
            Configuration.ProxyCreationEnabled = false; //setting it to false will stop EF moving into infinite loop caused by navigation properties (Primary Key, Foreign Key relations)
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<Employee> Employees { get; set; }
    }

}
