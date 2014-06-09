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

[<CLIMutable>]
type Timing =
    { navigationStart : int64
      unloadEventStart : int64
      unloadEventEnd : int64
      redirectStart : int64
      redirectEnd : int64
      fetchStart : int64
      domainLookupStart : int64
      domainLookupEnd : int64
      connectStart : int64
      connectEnd : int64
      secureConnectionStart : int64
      requestStart : int64
      responseStart : int64
      responseEnd : int64
      domLoading : int64
      domInteractive : int64
      domContentLoadedEventStart : int64
      domContentLoadedEventEnd : int64
      domComplete : int64
      loadEventStart : int64
      loadEventEnd : int64 }

[<CLIMutable>]
type PerformanceNavigation =
    { ``type`` : int16
      redirectCount : int16 }

[<CLIMutable>]
type PerformanceModel =
    { url : string
      browserEventDt : string
      timing : Timing
      navigation : PerformanceNavigation }

type BerfMeta =
    { IsOK : bool
      Message : string }