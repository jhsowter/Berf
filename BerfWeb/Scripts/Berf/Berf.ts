﻿/// <reference path="../jquery.d.ts" />
module Berf {

    export class Navigation {
        public static NOT_SET: number = -99.01;
        navigationStart: number = Navigation.NOT_SET;
        unloadEventStart: number;
        unloadEventEnd: number;
        redirectStart: number;
        redirectEnd: number;
        fetchStart: number;
        domainLookupStart: number;
        domainLookupEnd: number;
        connectStart: number;
        connectEnd: number;
        secureConnectionStart: number;
        requestStart: number;
        responseStart: number;
        responseEnd: number;
        domLoading: number;
        domInteractive: number;
        domContentLoadedEventStart: number;
        domContentLoadedEventEnd: number;
        domComplete: number;
        loadEventStart: number;
        loadEventEnd: number;

        constructor(nav: any) {
            this.navigationStart = nav.navigationStart;
            this.unloadEventStart = this.deltaFromStart(nav.unloadEventStart);
            this.unloadEventEnd = this.deltaFromStart(nav.unloadEventEnd);
            this.redirectStart = this.deltaFromStart(nav.redirectStart);
            this.redirectEnd = this.deltaFromStart(nav.redirectEnd);
            this.fetchStart = this.deltaFromStart(nav.fetchStart);
            this.domainLookupStart = this.deltaFromStart(nav.domainLookupStart);
            this.domainLookupEnd = this.deltaFromStart(nav.domainLookupEnd);
            this.connectStart = this.deltaFromStart(nav.connectStart);
            this.connectEnd = this.deltaFromStart(nav.connectEnd);
            this.secureConnectionStart = this.deltaFromStart(nav.secureConnectionStart);
            this.requestStart = this.deltaFromStart(nav.requestStart);
            this.responseStart = this.deltaFromStart(nav.responseStart);
            this.responseEnd = this.deltaFromStart(nav.responseEnd);
            this.domLoading = this.deltaFromStart(nav.domLoading);
            this.domInteractive = this.deltaFromStart(nav.domInteractive);
            this.domContentLoadedEventStart = this.deltaFromStart(nav.domContentLoadedEventStart);
            this.domContentLoadedEventEnd = this.deltaFromStart(nav.domContentLoadedEventEnd);
            this.domComplete = this.deltaFromStart(nav.domComplete);
            this.loadEventStart = this.deltaFromStart(nav.loadEventStart);
            this.loadEventEnd = this.deltaFromStart(nav.loadEventEnd);
        }

        deltaFromStart(n: number) {
            if (this.navigationStart === Navigation.NOT_SET) {throw "navigationStart is not set." };
            return this.delta(this.navigationStart, n);
        }

        delta(tZero: number, n: number) {
            return n === 0 ? 0 : n - tZero;
        }
    }

    export class BerfPage {
        url: string;

        static getBerfSession() {
            var berfDataJson = Berf.BerfPage.getCookie("berfData");

            // REFACTOR
            var berfSession = eval("(" + berfDataJson + ')');

            return berfSession;
        }

        static getCookie(cname: string) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }

        constructor(config: any) {
            if (config) {
                this.setup(config);
            }
        }

        public getTiming(navigationStart, unloadEventStart, unloadEventEnd, redirectStart, redirectEnd, fetchStart, domainLookupStart, domainLookupEnd, connectStart, connectEnd, secureConnectionStart, requestStart, responseStart, responseEnd, domLoading, domInteractive, domContentLoadedEventStart, domContentLoadedEventEnd, domComplete, loadEventStart, loadEventEnd) {

            var baseValue = navigationStart;

            var timing = {
                navigationStart: navigationStart - baseValue
                , unloadEventStart: unloadEventStart - baseValue
                , unloadEventEnd: unloadEventEnd - baseValue
                , redirectStart: redirectStart === 0 ? 0 : (redirectStart - baseValue)
                , redirectEnd: redirectEnd === 0 ? 0 : (redirectEnd - baseValue)
                , fetchStart: fetchStart - baseValue
                , domainLookupStart: domainLookupStart - baseValue
                , domainLookupEnd: domainLookupEnd - baseValue
                , connectStart: connectStart - baseValue
                , connectEnd: connectEnd - baseValue
                , secureConnectionStart: secureConnectionStart === 0 ? 0 : (secureConnectionStart - baseValue)
                , requestStart: requestStart - baseValue
                , responseStart: responseStart - baseValue
                , responseEnd: responseEnd - baseValue
                , domLoading: domLoading - baseValue
                , domInteractive: domInteractive - baseValue
                , domContentLoadedEventStart: domContentLoadedEventStart - baseValue
                , domContentLoadedEventEnd: domContentLoadedEventEnd - baseValue
                , domComplete: domComplete - baseValue
                , loadEventStart: loadEventStart - baseValue
                , loadEventEnd: loadEventEnd - baseValue
            };

            return timing;
        }

        public getTimingResources(resourceList: any) {

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
        }

        public getBerfData(berfSession: any) {
            // REFACTOR
            var url = window.location.toString();

            var browserEventDt = (new Date()).toUTCString();

            var t = window.performance.timing;
            var timing = new Navigation(t);
            //var timing = this.getTiming(t.navigationStart, t.unloadEventStart, t.unloadEventEnd, t.redirectStart, t.redirectEnd, t.fetchStart, t.domainLookupStart, t.domainLookupEnd
            //    , t.connectStart
            //    , t.connectEnd
            //    , 0
            //    , t.requestStart, t.responseStart, t.responseEnd, t.domLoading, t.domInteractive, t.domContentLoadedEventStart, t.domContentLoadedEventEnd
            //    , t.domComplete, t.loadEventStart, t.loadEventEnd);

            var navigation = window.performance.navigation;

            // get other timing resources about this page
            var resourceList = (window.performance && window.performance.getEntriesByType) ? window.performance.getEntriesByType("resource") : [];

            var timingResources = this.getTimingResources(resourceList);

            // REFACTOR
            var ajaxData = { 'url': url, 'browserEventDt': browserEventDt, 'timing': timing, 'navigation': navigation, 'berfSessionId': berfSession.berfSessionId, 'berfSession': berfSession, 'timingResources': timingResources };

            //
            return ajaxData;
        }

        public setup(config) {
            this.url = config.url;
        }

        public go(config, berfSession) {
            this.setup(config);

            if (window) {
                if (window.performance) {
                    // REFACTOR
                    var endpoint = $("script[berf-url]").attr("berf-url");

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
                    var alwaysCallback = function (jqXhr, textStatus, errorThrown) {/*console.log(jqXhr.responseText);*/};
                    $.ajax(req).done(doneCallback).fail(failCallback).always(alwaysCallback);
                }
            }
        }
    }
}

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
