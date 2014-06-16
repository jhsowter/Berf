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


type dbSchema = SqlDataConnection< "data source=.\SQLSERVER2012;Initial Catalog=Berf;Integrated Security=SSPI;" >

type internal EntityConnection = SqlEntityConnection< "data source=.\SQLSERVER2012;Initial Catalog=Berf;Integrated Security=SSPI;" >

type BerfController() =
    inherit Controller()

    let getOther (httpContext : HttpContextBase) : Other =
        let mutable Server = String.Empty
        let mutable Browser = String.Empty
        let mutable BrowserVersion = String.Empty
        let mutable controller = String.Empty
        let mutable action = String.Empty
        let mutable IP = String.Empty
        let mutable AuthUser = String.Empty
        let mutable LogonUser = String.Empty
        let mutable ClientSigVer = String.Empty
        Server <- "-"
        Browser <- "-"
        BrowserVersion <- "-"
        IP <- "-"
        AuthUser <- "-"
        LogonUser <- "-"
        ClientSigVer <- "-"
        controller <- "-"
        action <- "-"
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
            ClientSigVer <- typedefof<BerfController>.Assembly.GetName().Version.ToString()
        with exn -> ignore()
        try
            Server <- getValueFromMap serverVariablesMap "SERVER_NAME"
        with exn -> ignore()
        try
            IP <- getValueFromMap serverVariablesMap "LOCAL_ADDR"
        with exn -> ignore()
        try
            AuthUser <- getValueFromMap serverVariablesMap "AUTH_USER"
        with exn -> ignore()
        try
            LogonUser <- getValueFromMap serverVariablesMap "LOGON_USER"
        with exn -> ignore()
        try
            Browser <- HttpContext.Current.Request.Browser.Browser
        with exn -> ignore()
        try
            BrowserVersion <- HttpContext.Current.Request.Browser.Version
        with exn -> ignore()

        let uat = HttpContext.Current.Request.UserAgent

        let ret =
            { Other.Server = Server
              Browser = Browser
              BrowserVersion = BrowserVersion
              controller = controller
              action = action
              IP = IP
              AuthUser = AuthUser
              LogonUser = LogonUser
              UserAgent = uat
              ClientSigVer = ClientSigVer }
        ret

    // A helper function.
    let nullable value = new System.Nullable<_>(value)

    let toBerfTimer_1 (berfPacket : BerfPerfPacket) (other : Other) : EntityConnection.ServiceTypes.BerfTimer =
        let berfTimer =
            new EntityConnection.ServiceTypes.BerfTimer(BerfTimerId = Guid.NewGuid(),
                                                        BerfSessionId = berfPacket.berfSessionId,
                                                        EventDt = nullable DateTime.UtcNow, 
                                                        BerfType = nullable 1,

                                                        SigTestId = String.Empty,
                                                        SigId = berfPacket.url, 

                                                        ControllerAction = berfPacket.berfSession.area + berfPacket.berfSession.controller  + berfPacket.berfSession.action ,

                                                        ActionTime = nullable berfPacket.berfSession.actionTime,
                                                        ViewTime = nullable berfPacket.berfSession.viewTime,
                                                       
                                                        Count = nullable 1, 
                                                        
                                                        ServerEventDt = "", 
                                                        BrowserEventDt = "",

                                                        ClientSigVer = other.ClientSigVer,
                                                        ClientSig = String.Empty,

                                                        Server = other.Server,
                                                        IP = other.IP, 
                                                        UserAgent = other.UserAgent, 
                                                        
                                                        UserId = other.AuthUser, 
                                                        Browser = other.Browser,
                                                        BrowserVersion = other.BrowserVersion, Url = other.ClientSigVer,
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
                                                        loadEventEnd = berfPacket.timing.loadEventEnd)
        berfTimer

    let getBerfTimers (berfPacket : BerfPerfPacket) (other : Other) : EntityConnection.ServiceTypes.BerfTimer list =
        let list = List.empty<EntityConnection.ServiceTypes.BerfTimer>
        // main timer
        let berfTimer = toBerfTimer_1 berfPacket other
        let mainTimerList = List.append list [ berfTimer ]
        // child timer resources
        let timingResources = if berfPacket.timingResources = null then [] else List.ofArray berfPacket.timingResources

        let toBerfTimer_2 (x : TimingResource) : EntityConnection.ServiceTypes.BerfTimer =
            let ret =
                new EntityConnection.ServiceTypes.BerfTimer(
                    BerfTimerId = Guid.NewGuid(),
                    BerfSessionId = berfPacket.berfSessionId,
                    BerfType = nullable 2,
                    EventDt = nullable DateTime.UtcNow, 
                    SigTestId = String.Empty, 
                    SigId = x.name, 
                    ActionTime = nullable 0.0,
                    ViewTime = nullable 0.0, 
                    ControllerAction = berfPacket.url,
                    Count = nullable 1, 
                    ServerEventDt = "",
                    BrowserEventDt = "", 
                    ClientSig = String.Empty,
                    ClientSigVer = other.ClientSigVer,
                    Server = other.Server,
                    IP = other.IP,
                    UserId = other.AuthUser, Browser = other.Browser,
                    BrowserVersion = other.BrowserVersion,
                    Url = other.ClientSigVer, name = x.name,
                    duration = x.duration
                    )
            ret

        let timingResourcesList = timingResources |> List.map (fun x -> toBerfTimer_2 x)
        let fullList = List.append mainTimerList timingResourcesList
        fullList

    member this.Index() =
        this.Json({ IsOK = true
                    Message = "OK" }, JsonRequestBehavior.AllowGet)

    member this.log (model : BerfPerfPacket) =
        let db = dbSchema.GetDataContext()
        let cnString = "data source=.\SQLSERVER2012 ; Initial Catalog=Berf ; Integrated Security = SSPI;"
        db.Connection.ConnectionString <- cnString
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