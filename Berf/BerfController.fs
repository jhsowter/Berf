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

type dbSchema = SqlDataConnection< "data source=.\SQLSERVER2012 ; Initial Catalog=Berf ; Integrated Security = SSPI;" >

type BerfController() =
    inherit Controller()

    member this.Index() =
        this.Json({ IsOK = true
                    Message = "OK" }, JsonRequestBehavior.AllowGet)

    member this.log (model : PerformanceModel) =
        let db = dbSchema.GetDataContext()
        db.Connection.ConnectionString <- "data source=.\SQLSERVER2012 ; Initial Catalog=Berf ; Integrated Security = SSPI;"
        try
            let cmd = this.getCmd model
            // insert into db
            db.DataContext.ExecuteCommand(cmd) |> ignore
        with exn ->
            let message = exn.Message
            printfn "Exception:\n%s" exn.Message
        this.Json({ IsOK = true
                    Message = "OK" }, JsonRequestBehavior.AllowGet)

    member this.getCmd (model : PerformanceModel) =
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
        let httpContext = this.HttpContext
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
            ClientSigVer <- this.GetType().Assembly.GetName().Version.ToString()
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
        
        let cmd =
            String.Format
                (@"insert into Berf (
                    BerfId
                    ,navigationStart
                    ,unloadEventStart
                    ,unloadEventEnd
                    ,redirectStart
                    ,redirectEnd
                    ,fetchStart
                    ,domainLookupStart
                    ,domainLookupEnd
                    ,connectStart
                    ,connectEnd
                    ,secureConnectionStart
                    ,requestStart
                    ,responseStart
                    ,responseEnd
                    ,domLoading
                    ,domInteractive
                    ,domContentLoadedEventStart
                    ,domContentLoadedEventEnd
                    ,domComplete
                    ,loadEventStart
                    ,loadEventEnd
                    , ClientSigVer
                    , Server
                    , IP
                    , UserId
                    , Browser
                    , BrowserVersion
                    , BrowserEventDt
                    , Url
                    ) values ('{0}',{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21},'{22}','{23}','{24}','{25}','{26}','{27}','{28}','{29}' );",
                 Guid.NewGuid(), model.timing.navigationStart, model.timing.unloadEventStart,
                 model.timing.unloadEventEnd, model.timing.redirectStart, model.timing.redirectEnd,
                 model.timing.fetchStart, model.timing.domainLookupStart, model.timing.domainLookupEnd,
                 model.timing.connectStart, model.timing.connectEnd, model.timing.secureConnectionStart,
                 model.timing.requestStart, model.timing.responseStart, model.timing.responseEnd,
                 model.timing.domLoading, model.timing.domInteractive, model.timing.domContentLoadedEventStart,
                 model.timing.domContentLoadedEventEnd, model.timing.domComplete, model.timing.loadEventStart,
                 model.timing.loadEventEnd, ClientSigVer, Server, IP, AuthUser + LogonUser, Browser, BrowserVersion,
                 model.browserEventDt, model.url)
        cmd