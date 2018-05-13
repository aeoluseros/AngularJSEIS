using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace EIS.API.Controllers
{
    [EnableCors("*", "*", "*")]
    public class UploadController : ApiController
    {
        public HttpResponseMessage Post(string Id)
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];  //only read the first file.
                var filePath = "";
                if (postedFile.ContentType == "application/vnd.ms-excel" || 
                    postedFile.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    filePath = HttpContext.Current.Server.MapPath("~/Files/BulkData/" + postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    return Request.CreateResponse(HttpStatusCode.Created, postedFile.FileName);
                }
                else
                {
                    filePath = HttpContext.Current.Server.MapPath("~/Files/ProfilePics/" + Id + ".jpeg");
                    postedFile.SaveAs(filePath);
                    return GetFile(Id);
                }
                /*
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var filePath = HttpContext.Current.Server.MapPath("~/Files/ProfilePics/" + Id + ".jpeg");
                    postedFile.SaveAs(filePath);

                    docfiles.Add(filePath);
                }
                result = Request.CreateResponse(HttpStatusCode.Created, docfiles);
                */
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
                return result;
            }
        }

        public HttpResponseMessage Get(string Id)
        {
            return GetFile(Id);
        }

        private static HttpResponseMessage GetFile(string Id)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/Files/ProfilePics/");
            Byte[] b;
            if (File.Exists(filePath + Id + ".jpeg"))
            {
                b = File.ReadAllBytes(filePath + Id + ".jpeg");   // You can use your own method over here.
            }
            else
            {
                b = File.ReadAllBytes(filePath + "anonymous.jpg");
            }
            HttpResponseMessage Response = new HttpResponseMessage(HttpStatusCode.OK);
            Response.Content = new StringContent(Convert.ToBase64String(b));
            Response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            return Response;
        }

    }
}

