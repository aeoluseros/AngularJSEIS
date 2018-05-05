using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.BOL
{
    [Table("AeoRole")] //default table name is Roles
    public partial class Role
    {
        [Key]
        public int RoleId { get; set; }  //key + integer, by default it's an identity column
        [StringLength(50)]
        public string RoleName { get; set; }
        [StringLength(10)]
        public string RoleCode { get; set; }
        [StringLength(200)]
        public string RoleDescription { get; set; }
        public virtual IEnumerable<Employee> Employees { get; set; }
    }
}
