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

open System.Diagnostics;

type BerfStopwatchAttribute()  = 
    inherit ActionFilterAttribute()

    let mutable _stopwatch:Stopwatch = Stopwatch()
    let mutable _start:DateTime = DateTime.UtcNow
    let mutable _end:DateTime = DateTime.UtcNow

    override u.OnActionExecuting ( filterContext:ActionExecutingContext) = 
        _start <- DateTime.UtcNow
        _stopwatch.Start()
        ()

    override u.OnActionExecuted ( filterContext:ActionExecutedContext ) = 
        _stopwatch.Stop()

        _end <- DateTime.UtcNow

        let sigStringStart = "X-Stopwatch-ActionStart";
        let sigStringEnd = "X-Stopwatch-ActionEnd";
        let sigStringDuration = "X-Stopwatch-ActionDuration";

        let httpContext = filterContext.HttpContext
        let response = httpContext.Response
        let request = httpContext.Request

        let headers = request.Headers
       
        let hds = headers.AllKeys |> Seq.map (fun key -> key, headers.[key]) |> Map.ofSeq

        let test (hds:Map<string,string>) key = 
            let hasKey = hds.ContainsKey "Content-Type"
            if hasKey then 
                Map.find "Content-Type" hds
            else 
                String.Empty

        let contentType = test hds "Content-Type"

        //var xRequestWith = request.Headers["X-Requested-With"] ?? "";
        let elapsed = _stopwatch.Elapsed.ToString();
        let elapsedMillis = _stopwatch.ElapsedMilliseconds;
        
        response.AddHeader(sigStringDuration, elapsedMillis.ToString());
        
        let shouldX = contentType.Contains("application/json");

        if shouldX = false then 
            response.Write (String.Format( "<!-- {0}: {1} -->" , (sigStringDuration.ToString()) , (elapsedMillis.ToString()) ))

            let startt = _start.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffK")
            let endt = _end.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffK")

            response.Write  (String.Format( @"<script> {0}=""{1}"" ; </script>", (sigStringStart)    , (startt)        ))
            response.Write  (String.Format( @"<script> {0}=""{1}"" ; </script>", (sigStringEnd)      , (endt)          ))
            response.Write  (String.Format(  "<script> {0}={1}  ;  </script>"  , (sigStringDuration) , (elapsedMillis) ))
        ()

