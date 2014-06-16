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

type BerfMeta =
    { IsOK : bool
      Message : string }

[<CLIMutable>]
type Other =
    { Server : String
      Browser : String
      BrowserVersion : String
      controller : String
      action : String
      IP : String
      AuthUser : String
      LogonUser : String
      ClientSigVer : String
      UserAgent: String }

[<CLIMutable>]
type Timing =
    { navigationStart : float
      unloadEventStart : float
      unloadEventEnd : float
      redirectStart : float
      redirectEnd : float
      fetchStart : float
      domainLookupStart : float
      domainLookupEnd : float
      connectStart : float
      connectEnd : float
      secureConnectionStart : float
      requestStart : float
      responseStart : float
      responseEnd : float
      domLoading : float
      domInteractive : float
      domContentLoadedEventStart : float
      domContentLoadedEventEnd : float
      domComplete : float
      loadEventStart : float
      loadEventEnd : float }

[<CLIMutable>]
type TimingResource =
    { connectEnd : System.Double
      connectStart : System.Double
      domainLookupEnd : System.Double
      domainLookupStart : System.Double
      duration : System.Double
      entryType : System.String
      fetchStart : System.Double
      initiatorType : System.String
      name : System.String
      redirectEnd : System.Double
      redirectStart : System.Double
      requestStart : System.Double
      responseEnd : System.Double
      responseStart : System.Double
      startTime : System.Double }

//connectEnd                            : 1.6406110861237808
//connectStart                          : 1.6406110861237808
//domainLookupEnd                       : 1.6406110861237808
//domainLookupStart                     : 1.6406110861237808
//duration                              : 0.5149737834272623
//entryType                             : "resource"
//fetchStart                            : 1.6406110861237808
//initiatorType                         : "link"
//name                                  : "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
//redirectEnd                           : 0
//redirectStart                         : 0
//requestStart                          : 1.6406110861237808
//responseEnd                               : 1.7239245469830566
//responseStart                         : 1.6406110861237808
//startTime                                 : 1.2089507635557943
[<CLIMutable>]
type PerformanceNavigation =
    { ``type`` : int16
      redirectCount : int16 }

[<CLIMutable>]
type BerfSession =
    { berfSessionId : string
      serverStartDt : string
      serverEndDt : string
      area : string
      controller : string
      action : string 
      actionTime: float
      viewTime: float
      }

[<CLIMutable>]
type BerfPerfPacket =
    { berfSessionId : string
      url : string
      browserEventDt : string
      timing : Timing
      navigation : PerformanceNavigation
      berfSession : BerfSession
      timingResources : TimingResource [] }