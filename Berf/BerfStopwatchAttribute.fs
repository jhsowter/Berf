namespace Berf

open System
open System.Collections.Generic
open System.Linq
open System.Web
open System.Web.Mvc
open System.Web.Mvc.Ajax
open System.Data
open System.Data.Linq
open Microsoft.FSharp.Data.TypeProviders
open Microsoft.FSharp.Linq
open System.Diagnostics
open Berf.Controllers
open System.IO
open System.Runtime.Serialization.Json
open System.Xml
open System.Text
open FSharp.Data

//type Simple =  JsonProvider<"""{"responseEnd" : 10973.99999992922,"responseStart" : 10972.000000067055,"requestStart" : 9908.999999985099,"secureConnectionStart" : 0,"connectEnd" : 9905.999999959022,"connectStart" : 9905.999999959022,"domainLookupEnd" : 9905.999999959022,"domainLookupStart" : 9905.999999959022,"fetchStart" : 9905.999999959022,"redirectEnd" : 0,		"redirectStart" : 0,"initiatorType" : "xmlhttprequest",		"duration" : 1067.9999999701977,		"startTime" : 9905.999999959022,		"entryType" : "resource",		"name" : "http://devteam3/Berf/Home/SomeJson",		"BerfType" : 2,		"actionTime" : 1015,		"action" : "SomeJson.",		"area" : "",		"berfSessionId" : "00000000-0000-0000-0000-000000000000",		"controller" : "Home.",		"serverEndDt" : "2014-06-19T10:34:39.863Z",		"serverStartDt" : "2014-06-19T10:34:38.847Z",		"viewTime" : 12}""">                 


type BerfStopwatchAttribute() =
    inherit ActionFilterAttribute()

    let mutable _actionStart : DateTime = DateTime.UtcNow
    let mutable _actionEnd : DateTime = DateTime.UtcNow

    let mutable _resultStart : DateTime = DateTime.UtcNow
    let mutable _resultEnd : DateTime = DateTime.UtcNow

    let mutable _actionStopwatch : Stopwatch = Stopwatch()
    let mutable _resultStopwatch : Stopwatch = Stopwatch()
    
    let json (myObj : 't) =
        use ms = new MemoryStream()
        (new DataContractJsonSerializer(typeof<'t>)).WriteObject(ms, myObj)
        //http://blog.patrickmcdonald.org/2012/10/f-record-serialization-in-asp-net-web-api/
        let ret = Encoding.Default.GetString(ms.ToArray()).Replace("@" , "")
        ret

    let createCookie(name: string) (value: string) =
        let cookie = new HttpCookie(name)
        cookie.HttpOnly <- false
        cookie.Value <- value
        cookie

    override u.OnActionExecuting(filterContext : ActionExecutingContext) =

        _actionStart <- DateTime.UtcNow
        
        _actionStopwatch <- Stopwatch()
        _actionStopwatch.Start()

        ()

    override u.OnActionExecuted(filterContext : ActionExecutedContext) =

        _actionStopwatch.Stop()

        _actionEnd <- DateTime.UtcNow
        
        ()

    override u.OnResultExecuting(filterContext : ResultExecutingContext) =

        _resultStart <- DateTime.UtcNow

        _resultStopwatch <- Stopwatch()
        _resultStopwatch.Start()

        ()

    override u.OnResultExecuted(filterContext : ResultExecutedContext) =

        _resultStopwatch.Stop()
        _resultEnd <- DateTime.UtcNow

        let actionTime = Convert.ToDouble  _actionStopwatch.ElapsedMilliseconds
        let viewTime = Convert.ToDouble  _resultStopwatch.ElapsedMilliseconds


        let httpContext = filterContext.HttpContext
        let response = httpContext.Response
        let request = httpContext.Request
        let headers = request.Headers

        // get from cookie
        let cookieValue = if request.Cookies.["berf"] = null then Guid.Empty.ToString() else request.Cookies.["berf"].Value
        let mutable berfSessionId: Guid = Guid.Empty
        let isAjaxRequest = (headers.["X-Requested-With"] = "XMLHttpRequest")
        if (httpContext.PreviousHandler = null && not isAjaxRequest) then
            berfSessionId <- Guid.NewGuid()
        else
            berfSessionId <- Guid.Parse(cookieValue)

        if not (berfSessionId = Guid.Empty) then berfSessionId <- Guid.NewGuid()

        let cookie = createCookie "berf" (berfSessionId.ToString())
        response.Cookies.Add(cookie)
        
        let cnString = Configuration.WebConfigurationManager.ConnectionStrings.["Berf"].ConnectionString
        let context = EntityConnection.GetDataContext(cnString)
        let metric = new EntityConnection.ServiceTypes.MVC(MVCID = Guid.NewGuid(),
            Action = (string)filterContext.RouteData.Values.["action"],
            Controller = (string)filterContext.RouteData.Values.["controller"],
            Area = (string) filterContext.RouteData.DataTokens.["area"],
            ActionStart = _actionStart,
            ActionEnd = _actionEnd,
            ResultStart = _resultStart,
            ResultEnd = _resultEnd,
            ActionDuration = (float) _actionStopwatch.ElapsedMilliseconds,
            ResultDuration = (float) _resultStopwatch.ElapsedMilliseconds,
            BerfSessionID = berfSessionId,
            Created = DateTime.UtcNow,
            UserName = httpContext.User.Identity.Name,
            ClientIPAddress = request.UserHostAddress,
            UserAgent = request.UserAgent,
            HostMachineName = httpContext.Server.MachineName)

        context.MVC.AddObject metric

        context.DataContext.SaveChanges()

        ()
