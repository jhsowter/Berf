/// <reference path="../jquery.d.ts" />
var Berf;
(function (Berf) {
    var BerfPage = (function () {
        function BerfPage(config) {
            if (config) {
                this.setup(config);
            }
        }
        BerfPage.getBerfSession = function () {
            var berfDataJson = Berf.BerfPage.getCookie("berfData");

            // REFACTOR
            var berfSession = eval("(" + berfDataJson + ')');

            return berfSession;
        };

        BerfPage.getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }
            return "";
        };

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

        BerfPage.prototype.getTimingResources = function (resourceList) {
            var ret = [];

            if (resourceList) {
                for (var i = 0; i < resourceList.length; i++) {
                    var res = resourceList[i];

                    var msg = "";

                    //msg += "connectEnd:" + res.connectEnd + " ;";
                    //connectStart: 1.6406110861237808
                    //domainLookupEnd: 1.6406110861237808
                    //domainLookupStart: 1.6406110861237808
                    //duration: 0.5149737834272623
                    msg += "duration:" + res.duration + " ;";

                    //entryType: "resource"
                    //fetchStart: 1.6406110861237808
                    //initiatorType: "link"
                    msg += "initiatorType:" + res.initiatorType + " ;";

                    //name: "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
                    msg += "name:" + res.name + " ;";

                    //redirectEnd: 0
                    //redirectStart: 0
                    //requestStart: 1.6406110861237808
                    //responseEnd: 1.7239245469830566
                    //responseStart: 1.6406110861237808
                    //startTime: 1.2089507635557943
                    //console.log(msg);
                    //console.log(JSON.stringify(res));
                    //console.log(res);
                    //console.log(JSON.stringify(res));
                    //console.log(JSON.stringify(res, null, 2));
                    //var msg = JSON.stringify(res, undefined, 2);
                    //connectEnd: 1.6406110861237808
                    //connectStart: 1.6406110861237808
                    //domainLookupEnd: 1.6406110861237808
                    //domainLookupStart: 1.6406110861237808
                    //duration: 0.5149737834272623
                    //entryType: "resource"
                    //fetchStart: 1.6406110861237808
                    //initiatorType: "link"
                    //name: "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
                    //redirectEnd: 0
                    //redirectStart: 0
                    //requestStart: 1.6406110861237808
                    //responseEnd: 1.7239245469830566
                    //responseStart: 1.6406110861237808
                    //startTime: 1.2089507635557943
                    //readonly attribute DOMHighResTimeStamp redirectStart;
                    //  readonly attribute DOMHighResTimeStamp redirectEnd;
                    //  readonly attribute DOMHighResTimeStamp fetchStart;
                    //  readonly attribute DOMHighResTimeStamp domainLookupStart;
                    //  readonly attribute DOMHighResTimeStamp domainLookupEnd;
                    //  readonly attribute DOMHighResTimeStamp connectStart;
                    //  readonly attribute DOMHighResTimeStamp connectEnd;
                    //  readonly attribute DOMHighResTimeStamp secureConnectionStart;
                    //  readonly attribute DOMHighResTimeStamp requestStart;
                    //  readonly attribute DOMHighResTimeStamp responseStart;
                    //  readonly attribute DOMHighResTimeStamp responseEnd;
                    if (resourceList[i].initiatorType == "img") {
                        //alert("End to end resource fetch: " + resourceList[i].responseEnd - resourceList[i].startTime);
                    }

                    ret.push(res);
                }
            }

            return ret;
        };

        BerfPage.prototype.getBerfData = function (berfSession) {
            // REFACTOR
            var url = window.location.toString();

            var browserEventDt = (new Date()).toUTCString();

            var t = window.performance.timing;

            var timing = this.getTiming(t.navigationStart, t.unloadEventStart, t.unloadEventEnd, t.redirectStart, t.redirectEnd, t.fetchStart, t.domainLookupStart, t.domainLookupEnd, t.connectStart, t.connectEnd, 0, t.requestStart, t.responseStart, t.responseEnd, t.domLoading, t.domInteractive, t.domContentLoadedEventStart, t.domContentLoadedEventEnd, t.domComplete, t.loadEventStart, t.loadEventEnd);

            var navigation = window.performance.navigation;

            // get other timing resources about this page
            var resourceList = (window.performance && window.performance.getEntriesByType) ? window.performance.getEntriesByType("resource") : [];

            var timingResources = this.getTimingResources(resourceList);

            // REFACTOR
            var ajaxData = { 'url': url, 'browserEventDt': browserEventDt, 'timing': timing, 'navigation': navigation, 'berfSessionId': berfSession.berfSessionId, 'berfSession': berfSession, 'timingResources': timingResources };

            //
            return ajaxData;
        };

        BerfPage.prototype.setup = function (config) {
            this.url = config.url;
        };

        BerfPage.prototype.go = function (config, berfSession) {
            this.setup(config);

            if (window) {
                if (window.performance) {
                    // REFACTOR
                    //var endpoint = "/BerfWeb/Berf/log";
                    //var endpoint = "/Berf/log";
                    var endpoint = $("script[berf-url]").attr("berf-url");
                    var url = Berf.Util.urlSplit(window.location.toString());

                    var berfPerfPacket = this.getBerfData(berfSession);

                    var dataJson = JSON.stringify(berfPerfPacket);
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
    var config = { 'url': window.location.toString() };

    var berfSession = Berf.BerfPage.getBerfSession();

    var page = new Berf.BerfPage(null);

    page.go(config, berfSession);
}, 2000);

var berfLog = function () {
    // REFACTOR
    console.log("berflog...");

    var berfDataJson = Berf.BerfPage.getCookie("berfData");

    //console.log(berfDataJson);
    // print the cookie json data sent from the server
    var berf = eval("(" + berfDataJson + ')');
    console.log("berf.BerfSessionId <- " + berf.BerfSessionId);

    var resourceList = window.performance.getEntriesByType ? window.performance.getEntriesByType("resource") : [];

    for (var i = 0; i < resourceList.length; i++) {
        var res = resourceList[i];
        var msg = "";

        //msg += "connectEnd:" + res.connectEnd + " ;";
        //connectStart: 1.6406110861237808
        //domainLookupEnd: 1.6406110861237808
        //domainLookupStart: 1.6406110861237808
        //duration: 0.5149737834272623
        msg += "duration:" + res.duration + " ;";

        //entryType: "resource"
        //fetchStart: 1.6406110861237808
        //initiatorType: "link"
        msg += "initiatorType:" + res.initiatorType + " ;";

        //name: "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
        msg += "name:" + res.name + " ;";

        //redirectEnd: 0
        //redirectStart: 0
        //requestStart: 1.6406110861237808
        //responseEnd: 1.7239245469830566
        //responseStart: 1.6406110861237808
        //startTime: 1.2089507635557943
        //console.log(msg);
        //console.log(JSON.stringify(res));
        //console.log(res);
        //console.log(JSON.stringify(res));
        //console.log(JSON.stringify(res, null, 2));
        //var msg = JSON.stringify(res, undefined, 2);
        //connectEnd: 1.6406110861237808
        //connectStart: 1.6406110861237808
        //domainLookupEnd: 1.6406110861237808
        //domainLookupStart: 1.6406110861237808
        //duration: 0.5149737834272623
        //entryType: "resource"
        //fetchStart: 1.6406110861237808
        //initiatorType: "link"
        //name: "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
        //redirectEnd: 0
        //redirectStart: 0
        //requestStart: 1.6406110861237808
        //responseEnd: 1.7239245469830566
        //responseStart: 1.6406110861237808
        //startTime: 1.2089507635557943
        //readonly attribute DOMHighResTimeStamp redirectStart;
        //  readonly attribute DOMHighResTimeStamp redirectEnd;
        //  readonly attribute DOMHighResTimeStamp fetchStart;
        //  readonly attribute DOMHighResTimeStamp domainLookupStart;
        //  readonly attribute DOMHighResTimeStamp domainLookupEnd;
        //  readonly attribute DOMHighResTimeStamp connectStart;
        //  readonly attribute DOMHighResTimeStamp connectEnd;
        //  readonly attribute DOMHighResTimeStamp secureConnectionStart;
        //  readonly attribute DOMHighResTimeStamp requestStart;
        //  readonly attribute DOMHighResTimeStamp responseStart;
        //  readonly attribute DOMHighResTimeStamp responseEnd;
        if (resourceList[i].initiatorType == "img") {
            //alert("End to end resource fetch: " + resourceList[i].responseEnd - resourceList[i].startTime);
        }
    }
};

var id = setTimeout(berfLog, 5000);
//// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/beforeunload
//window.addEventListener("beforeunload", function (e) {
//    // ask to leave page
//    var confirmationMessage = "abc \o  def /  ghi";
//
//    var x = (e || window.event);
//
//    x['returnValue'] = confirmationMessage;     //Gecko + IE
//
//    return confirmationMessage;                                //Webkit, Safari, Chrome etc.
//
//});
//# sourceMappingURL=Berf.js.map
