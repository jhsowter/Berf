using System.Web.Mvc;

//using berf.Controllers;

namespace BerfWeb.Controllers
{
    using System.Threading;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult SomeJson()
        {
            Thread.Sleep(1000);
            return this.Json("here we go", JsonRequestBehavior.AllowGet);
        }
    }
}