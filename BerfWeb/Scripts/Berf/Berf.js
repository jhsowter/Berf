/// <reference path="../jquery.d.ts" />
var Berf;
(function (Berf) {
    var BerfPage = (function () {
        function BerfPage(model) {
            this.url = model.url;
        }
        BerfPage.prototype.getTiming = function (navigationStart, unloadEventStart, unloadEventEnd, redirectStart, redirectEnd, fetchStart, domainLookupStart, domainLookupEnd, connectStart, connectEnd, secureConnectionStart, requestStart, responseStart, responseEnd, domLoading, domInteractive, domContentLoadedEventStart, domContentLoadedEventEnd, domComplete, loadEventStart, loadEventEnd) {
            var baseValue = navigationStart;

            var timing = {
                navigationStart: navigationStart - baseValue,
                unloadEventStart: unloadEventStart - baseValue,
                unloadEventEnd: unloadEventEnd - baseValue,
                redirectStart: redirectStart === 0 ? 0 : (redirectStart - baseValue),
                redirectEnd: redirectEnd === 0 ? 0 : (redirectEnd - baseValue),
                fetchStart: fetchStart - baseValue,
                domainLookupStart: domainLookupStart - baseValue,
                domainLookupEnd: domainLookupEnd - baseValue,
                connectStart: connectStart - baseValue,
                connectEnd: connectEnd - baseValue,
                secureConnectionStart: secureConnectionStart === 0 ? 0 : (secureConnectionStart - baseValue),
                requestStart: requestStart - baseValue,
                responseStart: responseStart - baseValue,
                responseEnd: responseEnd - baseValue,
                domLoading: domLoading - baseValue,
                domInteractive: domInteractive - baseValue,
                domContentLoadedEventStart: domContentLoadedEventStart - baseValue,
                domContentLoadedEventEnd: domContentLoadedEventEnd - baseValue,
                domComplete: domComplete - baseValue,
                loadEventStart: loadEventStart - baseValue,
                loadEventEnd: loadEventEnd - baseValue
            };

            return timing;
        };

        BerfPage.prototype.getBerfData = function () {
            var url = window.location.toString();

            var browserEventDt = (new Date()).toUTCString();

            var t = window.performance.timing;

            var timing = this.getTiming(t.navigationStart, t.unloadEventStart, t.unloadEventEnd, t.redirectStart, t.redirectEnd, t.fetchStart, t.domainLookupStart, t.domainLookupEnd, t.connectStart, t.connectEnd, 0, t.requestStart, t.responseStart, t.responseEnd, t.domLoading, t.domInteractive, t.domContentLoadedEventStart, t.domContentLoadedEventEnd, t.domComplete, t.loadEventStart, t.loadEventEnd);

            var navigation = window.performance.navigation;

            var ajaxData = { 'url': url, 'browserEventDt': browserEventDt, 'timing': timing, 'navigation': navigation };

            return ajaxData;
        };

        BerfPage.prototype.Go = function () {
            if (window) {
                if (window.performance) {
                    //var endpoint = "/BerfWeb/Berf/log";
                    var endpoint = "/Berf/log";
                    var url = Berf.Util.urlSplit(window.location.toString());
                    var dataJson = JSON.stringify(this.getBerfData());
                    var req = { 'url': endpoint, 'type': "post", 'contentType': "application/json", 'cache': false, 'data': dataJson };
                    var doneCallback = function (data, textStatus, jqXhr) {
                        if (data.IsOK) {
                            console.log("Berf log OK ");
                        } else {
                            console.log("Berf log not OK");
                        }
                    };
                    var failCallback = function (jqXhr, textStatus, errorThrown) {
                        console.log(jqXhr.responseText);
                    };
                    var alwaysCallback = function (jqXhr, textStatus, errorThrown) {
                    };
                    $.ajax(req).done(doneCallback).fail(failCallback).always(alwaysCallback);
                }
            }
        };
        return BerfPage;
    })();
    Berf.BerfPage = BerfPage;

    var Url = (function () {
        function Url() {
            this.length = 9;
        }
        return Url;
    })();
    Berf.Url = Url;

    var Util = (function () {
        function Util() {
        }
        Util.urlSplit = function (url) {
            var urlParts = new Url();

            // split the url according the reg
            var urlParserReg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var regSplit = urlParserReg.exec(url);

            var len = urlParts.length;
            var i;
            for (i = 0; i < len; i += 1) {
                switch (i) {
                    case 0:
                        urlParts.url = regSplit[i];
                        break;
                    case 1:
                        urlParts.scheme = regSplit[i];
                        break;
                    case 2:
                        urlParts.slash = regSplit[i];
                        break;
                    case 3:
                        urlParts.host = regSplit[i];
                        break;
                    case 4:
                        urlParts.port = regSplit[i];
                        break;
                    case 5:
                        urlParts.path = regSplit[i];
                        break;
                    case 6:
                        urlParts.query = regSplit[i];
                        break;
                    case 7:
                        urlParts.hash = regSplit[i];
                        break;
                    default:
                        break;
                }
            }

            // get path parts
            urlParts.pathParts = urlParts.path.split('/');

            return urlParts;
        };
        return Util;
    })();
    Berf.Util = Util;
})(Berf || (Berf = {}));

var id = setTimeout(function () {
    var page = new Berf.BerfPage({ 'url': window.location.toString() });
    page.Go();
}, 2000);
// object functions
//public static isNullOrUndefined(object: any) {
//
//    var ret = false;
//
//    ret = (typeof object === "undefined") ? true : ret;
//    ret = (object === null) ? true : ret;
//
//    return ret;
//
//}
//
//public static isString(s: string) {
//    var ret = typeof s === "string";
//    return ret;
//}
//public static isObject(o: any) {
//    var ret = false;
//    ret = ((o !== null) && (typeof (o) === 'object')) ? true : ret;
//    //-Return
//    return ret;
//}
//public static virtualDirectoryName():string {
//    var urlParts = this.urlSplit(window.location.toString());
//    var virtualDirectoryName = urlParts.pathParts[0];
//
//    return virtualDirectoryName;
//}
//public static area() {
//    var urlParts = this.urlSplit(window.location.toString());
//    var area = urlParts.pathParts[1];
//    return area;
//}
//// guids
//public static S4() {
//    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//}
//public static guid() {
//    return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
//}
//var getTiming = function (navigationStart, unloadEventStart, unloadEventEnd, redirectStart, redirectEnd, fetchStart, domainLookupStart, domainLookupEnd, connectStart, connectEnd, secureConnectionStart, requestStart, responseStart, responseEnd, domLoading, domInteractive, domContentLoadedEventStart, domContentLoadedEventEnd, domComplete, loadEventStart, loadEventEnd) {
//
//    var baseValue = navigationStart;
//
//    var timing = {
//        navigationStart: navigationStart - baseValue
//        , unloadEventStart: unloadEventStart - baseValue
//        , unloadEventEnd: unloadEventEnd - baseValue
//        , redirectStart: redirectStart === 0 ? 0 : (redirectStart - baseValue)
//        , redirectEnd: redirectEnd === 0 ? 0 : (redirectEnd - baseValue)
//        , fetchStart: fetchStart - baseValue
//        , domainLookupStart: domainLookupStart - baseValue
//        , domainLookupEnd: domainLookupEnd - baseValue
//        , connectStart: connectStart - baseValue
//        , connectEnd: connectEnd - baseValue
//        , secureConnectionStart: secureConnectionStart === 0 ? 0 : (secureConnectionStart - baseValue)
//        , requestStart: requestStart - baseValue
//        , responseStart: responseStart - baseValue
//        , responseEnd: responseEnd - baseValue
//        , domLoading: domLoading - baseValue
//        , domInteractive: domInteractive - baseValue
//        , domContentLoadedEventStart: domContentLoadedEventStart - baseValue
//        , domContentLoadedEventEnd: domContentLoadedEventEnd - baseValue
//        , domComplete: domComplete - baseValue
//        , loadEventStart: loadEventStart - baseValue
//        , loadEventEnd: loadEventEnd - baseValue
//    };
//
//    return timing;
//};
//
////
//var getBerfData = function () {
//
//    var url = window.location.toString();
//
//    var browserEventDt = (new Date()).toUTCString();
//
//    var t = window.performance.timing;
//
//    var timing = getTiming(t.navigationStart, t.unloadEventStart, t.unloadEventEnd, t.redirectStart, t.redirectEnd, t.fetchStart, t.domainLookupStart, t.domainLookupEnd
//        , t.connectStart
//        , t.connectEnd
//        , 0
//        , t.requestStart, t.responseStart, t.responseEnd, t.domLoading, t.domInteractive, t.domContentLoadedEventStart, t.domContentLoadedEventEnd
//        , t.domComplete, t.loadEventStart, t.loadEventEnd);
//
//    var navigation = window.performance.navigation;
//
//    var ajaxData = { 'url': url, 'browserEventDt': browserEventDt , 'timing': timing, 'navigation': navigation };
//
//    return ajaxData;
//};
//
////
//var berfer = function () {
//
//    if (window) {
//        if (window.performance) {
//            //var endpoint = "/BerfWeb/Berf/log";
//            var endpoint = "/Berf/log";
//            var url = Berf.Util.urlSplit( window.location.toString() );
//            var dataJson = JSON.stringify(getBerfData());
//            var req = { 'url': endpoint, 'type': "post", 'contentType': "application/json", 'cache': false, 'data': dataJson };
//            var doneCallback = function (data, textStatus, jqXhr) {
//                if (data.IsOK) {
//                    console.log("Berf log OK ");
//                } else {
//                    console.log("Berf log not OK");
//                }
//            };
//            var failCallback = function (jqXhr, textStatus, errorThrown) {console.log(jqXhr.responseText);};
//            var alwaysCallback = function (jqXhr, textStatus, errorThrown) {/*console.log(jqXhr.responseText);*/};
//            $.ajax(req).done(doneCallback).fail(failCallback).always(alwaysCallback);
//        }
//    }
//};
//
//
//var id = setTimeout(berfer, 1000);
//# sourceMappingURL=Berf.js.map
