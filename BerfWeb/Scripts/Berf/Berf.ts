/// <reference path="../jquery.d.ts" />





module Berf {
    export class BerfPage {
        url: string;

        constructor(model: any) {
            this.url = model.url;
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

        public getBerfData() {
            var url = window.location.toString();

            var browserEventDt = (new Date()).toUTCString();

            var t = window.performance.timing;

            var timing = this.getTiming(t.navigationStart, t.unloadEventStart, t.unloadEventEnd, t.redirectStart, t.redirectEnd, t.fetchStart, t.domainLookupStart, t.domainLookupEnd
                , t.connectStart
                , t.connectEnd
                , 0
                , t.requestStart, t.responseStart, t.responseEnd, t.domLoading, t.domInteractive, t.domContentLoadedEventStart, t.domContentLoadedEventEnd
                , t.domComplete, t.loadEventStart, t.loadEventEnd);

            var navigation = window.performance.navigation;

            var ajaxData = { 'url': url, 'browserEventDt': browserEventDt, 'timing': timing, 'navigation': navigation };

            return ajaxData;
        }

        public Go() {
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
                    var failCallback = function (jqXhr, textStatus, errorThrown) { console.log(jqXhr.responseText); };
                    var alwaysCallback = function (jqXhr, textStatus, errorThrown) {/*console.log(jqXhr.responseText);*/};
                    $.ajax(req).done(doneCallback).fail(failCallback).always(alwaysCallback);
                }
            }
        }
    }

    export class Url {
        url: string;
        scheme: string;
        slash: string;
        host: string;
        port: string;
        path: string;
        query: string;
        hash: string;
        pathParts: string[];
        length: number = 9;
    }

    export class Util {
        public static urlSplit(url: string): Url {
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
        }
    }
}

var id = setTimeout(function () {
    var page = new Berf.BerfPage({ 'url': window.location.toString() });
    page.Go();
}, 2000);


