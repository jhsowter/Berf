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
//type internal EntityConnection = SqlEntityConnection< "data source=.\SQLSERVER2012;Initial Catalog=Berf;Integrated Security=SSPI;" >

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

    let createClient (berfPacket : Packet) (httpContext : HttpContext) : EntityConnection.ServiceTypes.Client =
        
        let cookie = HttpContext.Current.Request.Cookies.["berf"];
        let berfSessionID = if cookie = null then Guid.Empty else Guid.Parse cookie.Value

        let berfTimer =
            new EntityConnection.ServiceTypes.Client(
                ClientID = Guid.NewGuid(),
                Created = DateTime.UtcNow,

                // Server side things from now
                HostMachineName = httpContext.Server.MachineName, 
                ClientIPAddress = httpContext.Request.UserHostAddress, 
                UserName = httpContext.User.Identity.Name,
                UserAgent = httpContext.Request.UserAgent,
                Source = berfPacket.source,
                BerfSessionID = berfSessionID,
                Url = berfPacket.url,

                // Client side
                connectStart = nullable berfPacket.connectStart,
                connectEnd = nullable berfPacket.connectEnd,
                domainLookupStart = nullable berfPacket.domainLookupStart,
                domainLookupEnd = nullable berfPacket.domainLookupEnd,
                duration = nullable berfPacket.duration,
                entryType = berfPacket.entryType,
                fetchStart = nullable berfPacket.fetchStart,
                initiatorType = berfPacket.initiatorType,
                name = berfPacket.name,
                navigationStart = nullable berfPacket.navigationStart, // API 1
                redirectStart = nullable berfPacket.redirectStart,
                redirectEnd = nullable berfPacket.redirectEnd,
                requestStart = nullable berfPacket.requestStart,
                responseStart = nullable berfPacket.responseEnd,
                responseEnd = nullable berfPacket.responseEnd,
                redirectCount = nullable berfPacket.redirectCount,
                secureConnectionStart =nullable  berfPacket.secureConnectionStart,
                startTime = nullable berfPacket.startTime,
                unloadEventStart = nullable berfPacket.unloadEventStart,
                unloadEventEnd = nullable berfPacket.unloadEventEnd,
                domLoading = nullable berfPacket.domLoading,
                domInteractive = nullable berfPacket.domInteractive,
                domContentLoadedEventStart = nullable berfPacket.domContentLoadedEventStart,
                domContentLoadedEventEnd = nullable berfPacket.domContentLoadedEventEnd,
                domComplete = nullable berfPacket.domComplete,
                loadEventStart = nullable berfPacket.loadEventStart,
                loadEventEnd = nullable berfPacket.loadEventEnd)

        berfTimer

    member this.Index (model : Packet[]) =
        let cnString = Configuration.WebConfigurationManager.ConnectionStrings.["Berf"].ConnectionString
        
        let other = getOther this.HttpContext
        let context = EntityConnection.GetDataContext(cnString)
        let fullContext = context.DataContext
        let metrics = model |> Seq.map (fun m -> createClient m HttpContext.Current)
        for metric in metrics do
            context.Client.AddObject metric
        fullContext.SaveChanges()
//        let berfTimers = model |> Seq.map (fun m -> toBerfTimer_1 m other)
//        for i in berfTimers do
//            fullContext.AddObject("BerfTimer", i)
//        fullContext.CommandTimeout <- nullable 1000
//        fullContext.SaveChanges() |> printfn "Saved changes: %d object(s) modified."
//
//        this.Json(String.Empty, JsonRequestBehavior.AllowGet)
        ()