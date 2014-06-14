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




type BerfStopwatchAttribute() =
    inherit ActionFilterAttribute()

    let mutable _actionStart : DateTime = DateTime.UtcNow
    let mutable _actionEnd : DateTime = DateTime.UtcNow

    let mutable _resultStart : DateTime = DateTime.UtcNow
    let mutable _resultEnd : DateTime = DateTime.UtcNow

    let mutable _actionStopwatch : Stopwatch = Stopwatch()
    let mutable _resultStopwatch : Stopwatch = Stopwatch()


    override u.OnActionExecuting(filterContext : ActionExecutingContext) =

        _actionStart <- DateTime.UtcNow
        
        _actionStopwatch <- Stopwatch()
        _actionStopwatch.Start()

        ()

    override u.OnActionExecuted(filterContext : ActionExecutedContext) =

        //let mutable _actionStopwatch : Stopwatch = Stopwatch()
        //let mutable _resultStopwatch : Stopwatch = Stopwatch()
        _actionStopwatch.Stop()


        _actionEnd <- DateTime.UtcNow
        

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

        let hds =
            headers.AllKeys
            |> Seq.map (fun key -> key, headers.[key])
            |> Map.ofSeq

        let test (hds : Map<string, string>) key =
            let hasKey = hds.ContainsKey "Content-Type"
            if hasKey then Map.find "Content-Type" hds
            else String.Empty

        let contentType = test hds "Content-Type"
        let isAjaxCall = contentType.Contains("application/json")

        let json (myObj : 't) =
            use ms = new MemoryStream()
            (new DataContractJsonSerializer(typeof<'t>)).WriteObject(ms, myObj)
            Encoding.Default.GetString(ms.ToArray())
        if isAjaxCall = false then
            let berfSessionId = Guid.NewGuid().ToString()
            let cookie = new HttpCookie("berfData")
            let startt = _actionStart.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffK")
            let endt = _actionEnd.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffK")

            let getValueFrom (col:Routing.RouteValueDictionary)  key =
                let hasKey = col.ContainsKey key
                if hasKey then 
                    let x = filterContext.RouteData.Values.Item key
                    x.ToString()
                else String.Empty

            let areaName = "" //getValueFrom filterContext.RouteData.Values  "area"
            let controllerName = getValueFrom filterContext.RouteData.Values  "controller" + "."  
            let actionName = getValueFrom filterContext.RouteData.Values  "action" + "."


            let berfSession =
                { berfSessionId = berfSessionId.ToString()
                  serverStartDt = startt
                  serverEndDt = endt 
                  area = areaName
                  controller = controllerName
                  action = actionName
                  actionTime = actionTime
                  viewTime = viewTime
                  }

            //http://blog.patrickmcdonald.org/2012/10/f-record-serialization-in-asp-net-web-api/
            let berfSessionJsonStringAt = json berfSession
            let berfSessionJsonString = berfSessionJsonStringAt.Replace("@" , "") ; 

            let cookieValue = berfSessionJsonString
            cookie.Value <- cookieValue
            response.Cookies.Add(cookie)

        ()









(*

public void Init(HttpApplication context) {
    context.BeginRequest += OnBeginRequest;
    context.EndRequest += OnEndRequest;
  }

  void OnBeginRequest(object sender, System.EventArgs e) {
    if (HttpContext.Current.Request.IsLocal 
        && HttpContext.Current.IsDebuggingEnabled) {
      var stopwatch = new Stopwatch();
      HttpContext.Current.Items["Stopwatch"] = stopwatch;
      stopwatch.Start();
    }
  }

  void OnEndRequest(object sender, System.EventArgs e) {
    if (HttpContext.Current.Request.IsLocal 
        && HttpContext.Current.IsDebuggingEnabled) {
      Stopwatch stopwatch = 
        (Stopwatch)HttpContext.Current.Items["Stopwatch"];
      stopwatch.Stop();

      TimeSpan ts = stopwatch.Elapsed;
      string elapsedTime = String.Format("{0}ms", ts.TotalMilliseconds);

      HttpContext.Current.Response.Write("<p>" + elapsedTime + "</p>");
    }
  }
*)



