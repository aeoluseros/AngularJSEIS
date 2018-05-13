using EIS.BLL;
using EIS.BOL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace EIS.API.Controllers
{
    [EnableCors("*", "*", "*")]
    public class EmployeeController : ApiController
    {
        EmployeeBs employeeObjBs;

        public EmployeeController()
        {
            employeeObjBs = new EmployeeBs();
        }

        [ResponseType(typeof(IEnumerable<Employee>))]
        public IHttpActionResult Get()
        {
            var emps = employeeObjBs.GetALL().OrderByDescending(x => x.CreatedDate);
            return Ok(emps);
        }

        [ResponseType(typeof(Employee))]
        public IHttpActionResult Get(string id)
        {
            Employee employee = employeeObjBs.GetByID(id);
            if (employee != null)
                return Ok(employee);
            else
                return NotFound();
        }

        [ResponseType(typeof(Employee))]
        public IHttpActionResult Post(Employee employee)
        {
            if (!(ModelState.IsValid && employeeObjBs.Insert(employee)))
                return SendBadRequest();

            return CreatedAtRoute("DefaultApi", new { id = employee.EmployeeId }, employee);
        }

        private IHttpActionResult SendBadRequest()
        {
            foreach (var error in employeeObjBs.Errors)
            {
                ModelState.AddModelError("", error);  //use ModelState to cache errors
            }
            return BadRequest(ModelState);
        }

        [ResponseType(typeof(Employee))]
        public IHttpActionResult Put(Employee employee)
        {
            if (!(ModelState.IsValid && employeeObjBs.Update(employee)))
                return SendBadRequest();

            return Ok(employee);
        }

        [ResponseType(typeof(Employee))]
        public IHttpActionResult Delete(string id)
        {
            Employee employee = employeeObjBs.GetByID(id);
            if (employee != null)
            {
                employeeObjBs.Delete(id);
                return Ok(employee);
            }
            else
            {
                return NotFound();
            }
        }

        [ResponseType(typeof(Employee))]
        [ActionName("Remind")]
        public IHttpActionResult Get(string id, string msgStr)
        {
            if(employeeObjBs.RemindEmployee(id, msgStr))
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [ResponseType(typeof(int))]
        [ActionName("CreateMultipleEmployee")]
        public IHttpActionResult Post(string fileName)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/Files/BulkData/" + fileName);
            int count = 0;
            DataTable dt = ReadExcelFile(filePath);

            if (dt == null)
            {
                foreach(var error in employeeObjBs.Errors)
                {
                    ModelState.AddModelError("", error);
                }
                return BadRequest(ModelState);
            }
            foreach(DataRow item in dt.Rows)
            {
                Employee E = new Employee() { EmployeeId = item[0].ToString(), Email = item[1].ToString() };
                if (employeeObjBs.Insert(E))
                {
                    count++;
                }
            }
            return Ok(count);
        }

        private DataTable ReadExcelFile(string filePath)
        {
            using(OleDbConnection conn = new OleDbConnection())
            {
                DataTable dt = new DataTable();
                string importFileName = filePath;
                string fileExtension = Path.GetExtension(importFileName);
                if(fileExtension != ".xls")
                {
                    employeeObjBs.Errors.Add("Only xls is supported");
                    return null;
                }
                else
                {
                    conn.ConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;DataSource=" + importFileName + ";" + "Extended Properties='Excel 8.0;HDR=YES;'";
                    using(OleDbCommand comm = new OleDbCommand())
                    {
                        comm.CommandText = "Select * from [Sheet1$]";
                        comm.Connection = conn;

                        using(OleDbDataAdapter da = new OleDbDataAdapter())
                        {
                            da.SelectCommand = comm;
                            da.Fill(dt);
                            return dt;
                        }
                    }
                }
            }
        }
    }
}
