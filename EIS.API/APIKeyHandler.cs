using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace EIS.API
{
    public class APIKeyHandler:DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            //the preflight request has Access-Control-Request-Headers property, it won't contain my_Token, 
            //so we directly SendAsync. 
            if (request.Headers.Contains("Access-Control-Request-Headers"))
            {
                return base.SendAsync(request, cancellationToken);
            }

            if (request.Headers.Contains("my_Token"))
            {
                //read apikey from http request.
                var apiKey = request.Headers.GetValues("my_Token").FirstOrDefault();

                if (apiKey == "123456789")
                {
                    return base.SendAsync(request, cancellationToken);
                }
            }

            var response = new HttpResponseMessage(HttpStatusCode.Forbidden);
            //TaskCompletionSource is mainly used for wrapping event-based async api with Task without making new Threads.
            var tsc = new TaskCompletionSource<HttpResponseMessage>();
            tsc.SetResult(response);
            return tsc.Task;
        }
    }
}