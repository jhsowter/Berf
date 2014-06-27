namespace Berf

open System
open System.Web
open System.Linq


type HttpModule() =
    
    interface IHttpModule with

        member this.Dispose() = 
            ()

        member this.Init (app: HttpApplication) =
//            let evth = fun (x:System.EventArgs) -> 
//                let cookie = if app.Request.Cookies.["berf"] = null then new HttpCookie("berf") else app.Request.Cookies.["berf"]
//                if not (not (app.Request.AcceptTypes.Any(fun s -> s = "text/html")) || (app.Request.Url.LocalPath = "/Berf") || app.Request.Headers.["X-Requested-With"] = "XMLHttpRequest") then
////                    let id = if String.IsNullOrEmpty(cookie.Values.[app.Request.Url.ToString()]) then Guid.NewGuid() else Guid.Parse(cookie.Values.[app.Request.Url.ToString()])
//                    cookie.Values.[app.Request.Url.ToString()] <- Guid.NewGuid().ToString()
//                    app.Response.Cookies.Add cookie
//                ()
//
//            app.BeginRequest.Add evth
            ()
