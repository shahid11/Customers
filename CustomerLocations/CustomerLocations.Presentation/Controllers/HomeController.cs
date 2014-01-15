using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using CustomerLocations.Presentation.Models.Dto;
using PagedList;

namespace CustomerLocations.Presentation.Controllers
{
    public class HomeController : Controller
    {
        private const string url = "http://localhost/avis/api/locations";

        public ActionResult Index(int page=1)
        {
            var locations = new List<Location>();
            using (var client = new HttpClient())
            {
                var task = client.GetAsync(url)
                    .ContinueWith(request =>
                                  {
                                      request.Result.EnsureSuccessStatusCode();
                                      var readTask=request.Result.Content.ReadAsAsync<List<Location>>()
                                          .ContinueWith(read =>
                                                        {
                                                            locations = read.Result;
                                                        });
                                      readTask.Wait();
                                  }).ContinueWith(error =>
                                                  {
                                                      if (error.Exception != null)
                                                          ViewBag.Error = error.Exception.StackTrace;
                                                  });
                task.Wait();
            }

            SetExtraData();
            
            return View(locations.ToPagedList(page, 6));
        }

        private void SetExtraData()
        {
            var extradata = GetExtraData();
            ViewBag.Countries = extradata.Countries;
            ViewBag.Prefixes = extradata.Prefixes;
            ViewBag.Timespanes = extradata.TimeSpanes;
        }

        private ExtraData GetExtraData()
        {
            var response = new ExtraData();
            var address = string.Format("{0}?extra={1}",url,true);
            using (var client = new HttpClient())
            {
                var task = client.GetAsync(address)
                    .ContinueWith(request =>
                    {
                        request.Result.EnsureSuccessStatusCode();
                        var readTask=request.Result.Content.ReadAsAsync<ExtraData>()
                            .ContinueWith(read =>
                            {
                                response = read.Result;
                            });
                        readTask.Wait();
                    }).ContinueWith(error =>
                    {
                        if (error.Exception != null)
                            ViewBag.Error = error.Exception.StackTrace;
                    });
                task.Wait();
            }
            return response;
        }

        public ActionResult Create(Location location)
        {
            using (var client = new HttpClient())
            {
                var request = client.PostAsJsonAsync(url, location);
                request.Wait();
                var response = request.Result.Content;
                var read = response.ReadAsStringAsync();
                read.Wait();
                var newRow = "";
                
                if (read.Result == "true")
                {
                    newRow = RenderRazorViewToString("_rowTemplate", new Location());
                }
                
                return Json(new {isSuccess=read.Result,row=newRow}, "application/json", JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Update(Location location)
        {
            
            return null;
        }

        private string RenderRazorViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            SetExtraData();
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                return sw.GetStringBuilder().ToString();
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
