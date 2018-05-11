using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace EIS.API
{
    //handling exception at center level
    public class EISExceptionAttribute : ExceptionFilterAttribute
    {
        //whenever there is an exception, it will hit this point because I registered this class to Config filters.
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            //add custom logging functionality
            var filePath = HttpContext.Current.Server.MapPath("~/File/log.txt");
            var txt = DateTime.Now.ToString() + " : " + actionExecutedContext.Exception.Message + "\n";
            File.AppendAllText(filePath, txt);

            //we can do some specific task based upon the type of exception.
            if (actionExecutedContext.Exception.GetType() == typeof(SqlException))
            {
                //add an error to the ModelState
                actionExecutedContext.ActionContext.ModelState.AddModelError("", "SQL Server service is not available.");
                actionExecutedContext.Response = actionExecutedContext.Request
                    .CreateErrorResponse(HttpStatusCode.BadGateway, actionExecutedContext.ActionContext.ModelState);
            }
            else {
                actionExecutedContext.Response = actionExecutedContext.Request
                    .CreateErrorResponse(HttpStatusCode.InternalServerError, actionExecutedContext.Exception);
            }

            //base.OnException(actionExecutedContext);  //this is default
        }
    }
}