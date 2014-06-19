namespace Berf.Controllers

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
open System
open System.Configuration
open System.Diagnostics
open System.Web
open System.Web.Mvc
open System.Reflection

//type dbSchema = SqlDataConnection< "data source=.\SQLSERVER2012;Initial Catalog=Berf;Integrated Security=SSPI;" >
type internal EntityConnection = SqlEntityConnection< "data source=.\SQLSERVER2012;Initial Catalog=Berf;Integrated Security=SSPI;" >

type BerfController() =
    inherit Controller()

    let getOther (httpContext : HttpContextBase)  =
        let mutable server = String.Empty
        let mutable browser = String.Empty
        let mutable browserVersion = String.Empty
        let mutable controller = String.Empty
        let mutable action = String.Empty
        let mutable ip = String.Empty
        let mutable authUser = String.Empty
        let mutable logonUser = String.Empty
        let mutable clientSigVer = String.Empty
        let mutable userAgentString = String.Empty

        let response = httpContext.Response
        let request = httpContext.Request
        let headers = request.Headers

        let headersMap =
            headers.AllKeys
            |> Seq.map (fun key -> key, headers.[key])
            |> Map.ofSeq

        let serverVariables = request.ServerVariables

        let serverVariablesMap =
            serverVariables.AllKeys
            |> Seq.map (fun key -> key, serverVariables.[key])
            |> Map.ofSeq

        let getValueFromMap (hds : Map<string, string>) key =
            let hasKey = hds.ContainsKey key
            if hasKey then Map.find key hds
            else String.Empty

        try
            clientSigVer <- typedefof<BerfController>.Assembly.GetName().Version.ToString()
        with exn -> ignore()
        try
            server <- getValueFromMap serverVariablesMap "SERVER_NAME"
        with exn -> ignore()
        try
            ip <- getValueFromMap serverVariablesMap "LOCAL_ADDR"
        with exn -> ignore()
        try
            authUser <- getValueFromMap serverVariablesMap "AUTH_USER"
        with exn -> ignore()
        try
            logonUser <- getValueFromMap serverVariablesMap "LOGON_USER"
        with exn -> ignore()
        try
            browser <- HttpContext.Current.Request.Browser.Browser
        with exn -> ignore()
        try
            browserVersion <- HttpContext.Current.Request.Browser.Version
        with exn -> ignore()
        try
            userAgentString <- HttpContext.Current.Request.UserAgent
        with exn -> ignore()

        { HttpSummary.Server = server
          Browser = browser
          BrowserVersion = browserVersion
          controller = controller
          action = action
          IP = ip
          AuthUser = authUser
          LogonUser = logonUser
          ClientSigVer = clientSigVer
          UserAgentString = userAgentString }

    // helper
    let nullable value = new System.Nullable<_>(value)

    let toBerfTimer_1 (berfPacket : Packet) (other : HttpSummary) : EntityConnection.ServiceTypes.BerfTimer =
        let berfTimer =
            new EntityConnection.ServiceTypes.BerfTimer(
                BerfTimerId = Guid.NewGuid(),

                // Server side things from now
                ClientSigVer = other.ClientSigVer, 
                ClientSig = String.Empty,
                Server = other.Server, 
                IP = other.IP, 
                UserId = other.AuthUser,
                Browser = other.Browser, 
                BrowserVersion = other.BrowserVersion,
                UserAgentString = other.UserAgentString,
                Url = other.ClientSigVer,
                EventDt = nullable DateTime.UtcNow, 
                SigTestId = String.Empty, 

                // Server side things from cookie - that is, on original page load or ajax call. 
                SigId = berfPacket.url,
                BerfType = nullable (System.Int32.Parse berfPacket.berfType),
                ControllerAction = berfPacket.area
                                    + berfPacket.controller
                                    + berfPacket.action,
                ActionTime = nullable berfPacket.actionTime,
                BerfSessionId = berfPacket.berfSessionId,
                ViewTime = nullable berfPacket.viewTime,
//                Count = nullable berfPacket.redirectCount, 
                ServerEventDt = "", 
                BrowserEventDt = "",

                // Client side
                connectStart = berfPacket.connectStart,
                connectEnd = berfPacket.connectEnd,
                domainLookupStart = berfPacket.domainLookupStart,
                domainLookupEnd = berfPacket.domainLookupEnd,
                duration = berfPacket.duration,
                entryType = berfPacket.entryType,
                fetchStart = berfPacket.fetchStart,
                initiatorType = berfPacket.initiatorType,
                name = berfPacket.name,
                navigationStart = berfPacket.navigationStart, // API 1
                redirectStart = berfPacket.redirectStart,
                redirectEnd = berfPacket.redirectEnd,
                requestStart = berfPacket.requestStart,
                responseStart = berfPacket.responseEnd,
                responseEnd = berfPacket.responseEnd,
                redirectCount = berfPacket.redirectCount,
                secureConnectionStart = berfPacket.secureConnectionStart,
                startTime = berfPacket.startTime,
                unloadEventStart = berfPacket.unloadEventStart,
                unloadEventEnd = berfPacket.unloadEventEnd,
                domLoading = berfPacket.domLoading,
                domInteractive = berfPacket.domInteractive,
                domContentLoadedEventStart = berfPacket.domContentLoadedEventStart,
                domContentLoadedEventEnd = berfPacket.domContentLoadedEventEnd,
                domComplete = berfPacket.domComplete,
                loadEventStart = berfPacket.loadEventStart,
                loadEventEnd = berfPacket.loadEventEnd)

        berfTimer

    member this.Index() =
        this.Json(String.Empty, JsonRequestBehavior.AllowGet)

    member this.log (model : Packet[]) =
        let cnString = "data source=.\SQLSERVER2012 ; Initial Catalog=Berf ; Integrated Security = SSPI;"
        
        let other = getOther this.HttpContext
        let context = EntityConnection.GetDataContext()
        let fullContext = context.DataContext
        let berfTimers = model |> Seq.map (fun m -> toBerfTimer_1 m other)
        for i in berfTimers do
            fullContext.AddObject("BerfTimer", i)
        fullContext.CommandTimeout <- nullable 1000
        fullContext.SaveChanges() |> printfn "Saved changes: %d object(s) modified."

        this.Json(String.Empty, JsonRequestBehavior.AllowGet)