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

type internal EntityConnection = SqlEntityConnection< "data source=.\SQLSERVER2012;Initial Catalog=Berf;Integrated Security=SSPI;" >

[<CLIMutable>]
type Packet = 
    { source : string;
        navigationStart: System.Double;
      unloadEventStart: System.Double;
      url: string;
      unloadEventEnd: System.Double;
      name: string;
      linkNegotiationStart: System.Double;
      linkNegotiationEnd: System.Double;
      redirectStart: System.Double;
      redirectEnd: System.Double;
      fetchStart: System.Double;
      domainLookupStart: System.Double;
      domainLookupEnd: System.Double;
      duration: System.Double;
      entryType: string;
      initiatorType: string;
      connectStart: System.Double;
      connectEnd: System.Double;
      secureConnectionStart: System.Double;
      startTime: System.Double;
      requestStart: System.Double;
      responseStart: System.Double;
      responseEnd: System.Double;
      domLoading: System.Double;
      domInteractive: System.Double;
      domContentLoadedEventStart: System.Double;
      domContentLoadedEventEnd: System.Double;
      domComplete: System.Double;
      loadEventStart: System.Double;
      loadEventEnd: System.Double;
      prerenderSwitch: System.Double
      redirectCount: int }

[<CLIMutable>]
type HttpSummary =
    { Server : String
      Browser : String
      BrowserVersion : String
      controller : String
      action : String
      IP : String
      AuthUser : String
      LogonUser : String
      ClientSigVer : String 
      UserAgent: String
      }

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
      actionTime : float
      viewTime : float 
      }
