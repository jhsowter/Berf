namespace berf.Controllers

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

type dbSchema = SqlDataConnection<"data source=.\SQLSERVER2012 ; Initial Catalog=Mash ; user id=sa; password=blue01 ;">

[<CLIMutable>]
type Timing = { 
    navigationStart             :int64;  
    unloadEventStart            :int64;
    unloadEventEnd              :int64;
    redirectStart               :int64;
    redirectEnd                 :int64;
    fetchStart                  :int64;
    domainLookupStart           :int64;
    domainLookupEnd             :int64;
    connectStart                :int64;
    connectEnd                  :int64;
    secureConnectionStart       :int64;
    requestStart                :int64;
    responseStart               :int64;
    responseEnd                 :int64;
    domLoading                  :int64;
    domInteractive              :int64;
    domContentLoadedEventStart  :int64;
    domContentLoadedEventEnd    :int64;
    domComplete                 :int64;
    loadEventStart              :int64;
    loadEventEnd                :int64;
}

[<CLIMutable>]
type PerformanceNavigation= {
    ``type``:int16;
    redirectCount:int16;
}

[<CLIMutable>]
type PerformanceModel = { 
    timing : Timing ; 
    navigation:PerformanceNavigation 
}

type BerfMeta = {
    IsOK : bool ; 
    Message:string 
}

type BerfController() =
    inherit Controller()

    member this.Index () = 
        let ret = {IsOK= true ; Message="OK"}
        this.Json( ret, JsonRequestBehavior.AllowGet ) 

    member this.log ( model:PerformanceModel ) =

        let db = dbSchema.GetDataContext()

        // save record
        try
            // { [Berf type] ;  field-names  ; values } 
            // ...
            //let cmd = String.Format( "insert into Berf (BerfId, navigationStart) values ( '{0}' , {1} );" , Guid.NewGuid() , model.timing.navigationStart) 
            let cmd = this.getCmd model
            db.DataContext.ExecuteCommand(cmd) |> ignore
        with
            | exn -> printfn "Exception:\n%s" exn.Message

        let ret = {IsOK= true ; Message="OK"}
        this.Json( ret, JsonRequestBehavior.AllowGet ) 

    member this.getCmd ( model:PerformanceModel ) =

        let cmd = String.Format( @"insert into Berf (
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
) values ('{0}',{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21} );" 
            , Guid.NewGuid() 
            , model.timing.navigationStart 
            , model.timing.unloadEventStart     
            , model.timing.unloadEventEnd
            , model.timing.redirectStart
            , model.timing.redirectEnd
            , model.timing.fetchStart
            , model.timing.domainLookupStart
            , model.timing.domainLookupEnd
            , model.timing.connectStart
            , model.timing.connectEnd
            , model.timing.secureConnectionStart
            , model.timing.requestStart
            , model.timing.responseStart
            , model.timing.responseEnd
            , model.timing.domLoading
            , model.timing.domInteractive
            , model.timing.domContentLoadedEventStart
            , model.timing.domContentLoadedEventEnd
            , model.timing.domComplete
            , model.timing.loadEventStart
            , model.timing.loadEventEnd
            ) 

        cmd


        (*
        //interface PerformanceTiming {
        //    readonly attribute unsigned long long navigationStart;
        //    readonly attribute unsigned long long unloadEventStart;
        //    readonly attribute unsigned long long unloadEventEnd;
        //    readonly attribute unsigned long long redirectStart;
        //    readonly attribute unsigned long long redirectEnd;
        //    readonly attribute unsigned long long fetchStart;
        //    readonly attribute unsigned long long domainLookupStart;
        //    readonly attribute unsigned long long domainLookupEnd;
        //    readonly attribute unsigned long long connectStart;
        //    readonly attribute unsigned long long connectEnd;
        //    readonly attribute unsigned long long secureConnectionStart;
        //    readonly attribute unsigned long long requestStart;
        //    readonly attribute unsigned long long responseStart;
        //    readonly attribute unsigned long long responseEnd;
        //    readonly attribute unsigned long long domLoading;
        //    readonly attribute unsigned long long domInteractive;
        //    readonly attribute unsigned long long domContentLoadedEventStart;
        //    readonly attribute unsigned long long domContentLoadedEventEnd;
        //    readonly attribute unsigned long long domComplete;
        //    readonly attribute unsigned long long loadEventStart;
        //    readonly attribute unsigned long long loadEventEnd;
        //};
        
        *)

