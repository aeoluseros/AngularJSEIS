using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.BOL
{
    [Table("Employee")]
    public partial class Employee
    {
        [Key]
        [StringLength(50)]
        public string EmployeeId { get; set; }

        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(50)]
        [Required]
        public string Password { get; set; }

        [NotMapped]
        public string ConfirmPassword { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        [StringLength(50)]
        public string Gender { get; set; }
        [StringLength(50)]
        public string Contact { get; set; }
        [StringLength(200)]
        public string Address { get; set; }
        [Column(TypeName="datetime2")]
        public DateTime DOJ { get; set; }
        [StringLength(50)]
        public string Designation { get; set; }
        public double? TotalExp { get; set; }  //double is float in SQL Server
        public double? RelevantExp { get; set; }
        [StringLength(50)]
        public string BankName { get; set; }
        [StringLength(50)]
        public string IFSCode { get; set; }
        [StringLength(50)]
        public string AcNo { get; set; }
        [StringLength(50)]
        public string PAN { get; set; }
        public int RoleId { get; set; }
        public DateTime CreatedDate { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role Role { get; set; }
    }
}
