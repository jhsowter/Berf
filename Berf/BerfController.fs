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
          UserAgent = userAgentString }

    // helper
    let nullable value = new System.Nullable<_>(value)

    let toBerfTimer_1 (berfPacket : BerfPerfPacket) (httpSummary : HttpSummary) : EntityConnection.ServiceTypes.BerfTimer =

        let berfTimer =

            new EntityConnection.ServiceTypes.BerfTimer(

                BerfTimerId = Guid.NewGuid(),
                BerfSessionId = berfPacket.berfSessionId,
                EventDt = nullable DateTime.UtcNow, BerfType = nullable 1,
                SigTestId = String.Empty, SigId = berfPacket.url,
                ControllerAction = berfPacket.berfSession.area
                                    + berfPacket.berfSession.controller
                                    + berfPacket.berfSession.action,
                ActionTime = nullable berfPacket.berfSession.actionTime,
                ViewTime = nullable berfPacket.berfSession.viewTime,
                Count = nullable 1, 
                ServerEventDt = "", 
                BrowserEventDt = "",
                ClientSigVer = httpSummary.ClientSigVer, 
                ClientSig = String.Empty,
                Server = httpSummary.Server, 
                IP = httpSummary.IP, 
                UserId = httpSummary.AuthUser,
                Browser = httpSummary.Browser, 
                BrowserVersion = httpSummary.BrowserVersion,
                Url = httpSummary.ClientSigVer,

                UserAgent= httpSummary.UserAgent,

                navigationStart = berfPacket.timing.navigationStart,
                unloadEventStart = berfPacket.timing.unloadEventStart,
                unloadEventEnd = berfPacket.timing.unloadEventEnd,
                redirectStart = berfPacket.timing.redirectStart,
                redirectEnd = berfPacket.timing.redirectEnd,
                fetchStart = berfPacket.timing.fetchStart,
                domainLookupStart = berfPacket.timing.domainLookupStart,
                domainLookupEnd = berfPacket.timing.domainLookupEnd,
                connectStart = berfPacket.timing.connectStart,
                connectEnd = berfPacket.timing.connectEnd,
                secureConnectionStart = berfPacket.timing.secureConnectionStart,
                requestStart = berfPacket.timing.redirectStart,
                responseStart = berfPacket.timing.requestStart,
                responseEnd = berfPacket.timing.responseEnd,
                domLoading = berfPacket.timing.domLoading,
                domInteractive = berfPacket.timing.domInteractive,
                domContentLoadedEventStart = berfPacket.timing.domContentLoadedEventStart,
                domContentLoadedEventEnd = berfPacket.timing.domContentLoadedEventEnd,
                domComplete = berfPacket.timing.domComplete,
                loadEventStart = berfPacket.timing.loadEventStart,
                loadEventEnd = berfPacket.timing.loadEventEnd
        )

        berfTimer


    let getBerfTimers (berfPacket : BerfPerfPacket) (httpSummary : HttpSummary) : EntityConnection.ServiceTypes.BerfTimer list =

        // main timer
        let berfTimers = List.empty<EntityConnection.ServiceTypes.BerfTimer>
        let berfTimer = toBerfTimer_1 berfPacket httpSummary
        let mainTimerList = List.append berfTimers [ berfTimer ]

        // child timer resources
        let timingResources = if berfPacket.timingResources = null then [] else List.ofArray berfPacket.timingResources
        let toBerfTimer_2 (timingResource : TimingResource) : EntityConnection.ServiceTypes.BerfTimer =
            let ret =
                new EntityConnection.ServiceTypes.BerfTimer(
                    BerfTimerId = Guid.NewGuid(),
                    BerfSessionId = berfPacket.berfSessionId,
                    BerfType = nullable 2, 
                    EventDt = nullable DateTime.UtcNow,
                    SigTestId = String.Empty, 
                    SigId = timingResource.name,
                    ActionTime = nullable 0.0, 
                    ViewTime = nullable 0.0,
                    ControllerAction = berfPacket.berfSession.area
                                    + berfPacket.berfSession.controller
                                    + berfPacket.berfSession.action,
                    Count = nullable 1,
                    ServerEventDt = String.Empty, 
                    BrowserEventDt = String.Empty,
                    ClientSig = String.Empty, 
                    ClientSigVer = httpSummary.ClientSigVer,
                    Server = httpSummary.Server, 
                    IP = httpSummary.IP,
                    UserId = httpSummary.AuthUser, 
                    Browser = httpSummary.Browser,
                    BrowserVersion = httpSummary.BrowserVersion,
                    Url = httpSummary.ClientSigVer, 
                    UserAgent= httpSummary.UserAgent,

                    connectEnd                = timingResource.connectEnd               ,
                    connectStart              = timingResource.connectStart             ,
                    domainLookupEnd           = timingResource.domainLookupEnd          ,
                    domainLookupStart         = timingResource.domainLookupStart        ,
                    duration                  = timingResource.duration                 ,
                    entryType                 = timingResource.entryType                ,
                    fetchStart                = timingResource.fetchStart               ,
                    initiatorType             = timingResource.initiatorType            ,
                    name                      = timingResource.name                     ,
                    redirectEnd               = timingResource.redirectEnd              ,
                    redirectStart             = timingResource.redirectStart            ,
                    requestStart              = timingResource.requestStart             ,
                    responseEnd               = timingResource.responseEnd              ,
                    responseStart             = timingResource.responseStart            ,
                    startTime                 = timingResource.startTime
                    )

            ret

        let timingResourcesList = timingResources |> List.map (fun x -> toBerfTimer_2 x)
        List.append mainTimerList timingResourcesList
        //let ret = List.append mainTimerList timingResourcesList
        //ret

    member this.Index() =
        this.Json({ IsOK = true; Message = "OK" }, JsonRequestBehavior.AllowGet)

    member this.log (model : BerfPerfPacket) =
        
        //let db = dbSchema.GetDataContext()
        let cnString = "data source=.\SQLSERVER2012 ; Initial Catalog=Berf ; Integrated Security = SSPI;"
        //db.Connection.ConnectionString <- cnString
        
        let other = getOther this.HttpContext
        let context = EntityConnection.GetDataContext()
        let fullContext = context.DataContext
        let berfTimers = getBerfTimers model other
        for i in berfTimers do
            fullContext.AddObject("BerfTimer", i)
        fullContext.CommandTimeout <- nullable 1000
        fullContext.SaveChanges() |> printfn "Saved changes: %d object(s) modified."

        this.Json(
        { 
            IsOK = true 
            Message = "OK" 
        }, JsonRequestBehavior.AllowGet)