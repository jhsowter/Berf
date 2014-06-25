var Berf;
(function (Berf) {
    var performance = window.performance || {};

    var Logger = (function () {
        function Logger() {
            var _this = this;
            this.Timeout = 5000;
            this.extend = function (toExtend, extender) {
                for (var key in extender) {
                    toExtend[key] = extender[key];
                }

                return toExtend;
            };
            this.Queue = [];
            var tag = document.querySelector ? document.querySelector('[berf-url]') : { getAttribute: function () {
                } };
            this.Url = tag.getAttribute("berf-url");
            var addEventListener = typeof window.addEventListener === "undefined" ? function () {
            } : window.addEventListener;

            addEventListener("beforeunload", function (e) {
                _this.onBeforeUnload(e);
            });

            addEventListener("load", function (e) {
                _this.onLoad(e);
            });
        }
        Logger.prototype.logResources = function () {
            if (typeof performance.getEntriesByType === "function") {
                var resources = performance.getEntriesByType("resource");
                if (resources.length > 0) {
                    for (var i = 0; i < resources.length; i++) {
                        var resource = resources[i];
                        resource["Source"] = "Navigation2";
                        resource["Url"] = window.location.toString();
                        this.enqueue(resource);
                    }
                }
            }
        };

        Logger.prototype.log = function () {
            if (typeof performance.getEntriesByType === "function") {
                var timing2 = performance.getEntriesByType("navigation");
                if (timing2.length > 0) {
                    timing2[0]["Source"] = "Navigation2";
                    timing2[0]["Url"] = window.location.toString();
                    this.enqueue(timing2[0]);
                }

                this.logResources();
            }

            if (typeof performance.timing === "object") {
                var timing1 = new Navigation(performance.timing);
                timing1["Source"] = "Navigation1";
                timing1["Url"] = window.location.toString();
                this.enqueue(timing1);
            }
        };

        Logger.prototype.onLoad = function (e) {
        };

        Logger.prototype.onBeforeUnload = function (e) {
            this.log();
            this.send(false);
        };

        Logger.prototype.send = function (async, queue) {
            if (typeof async === "undefined") { async = true; }
            if (typeof queue === "undefined") { queue = this.Queue; }
            if (queue.length > 0) {
                this.post(this.Url, queue, async);
            }
        };

        Logger.prototype.enqueue = function (data) {
            // TODO: switch depending on resource type and get appropriate cookie data.
            //if (data.initiatorType === "xmlhttprequest") {
            //    //data = this.extend(data, BerfCookie.XmlHttpRequest(data.name, data.ServerStartDt));
            //} else {
            //if (data.entryType === "navigation") {
            //    data = this.extend(data, BerfCookie.Navigation());
            //    }
            //}
            //if (data.BerfType === 1) {
            //data = this.extend(data, BerfCookie.Navigation());
            //}
            var inQueue = this.contains(this.Queue, data);

            if (!inQueue) {
                this.Queue.push(data);
            }
        };

        Logger.prototype.contains = function (queue, value) {
            for (var i = 0; i < queue.length; i++) {
                if (this.equals(queue[i], value)) {
                    return true;
                }
            }

            return false;
        };

        Logger.prototype.equals = function (value, other) {
            for (var key in value) {
                if (typeof value[key] !== "undefined" && typeof other[key] === "undefined") {
                    return false;
                }

                if (value[key] !== other[key]) {
                    return false;
                }
            }

            for (var otherKey in other) {
                if (typeof other[otherKey] !== "undefined") {
                    if (typeof value[otherKey] === "undefined") {
                        return false;
                    }
                }
            }

            return true;
        };

        Logger.prototype.post = function (url, data, async) {
            var _this = this;
            if (typeof async === "undefined") { async = true; }
            var json = JSON.stringify(data);
            var http = new XMLHttpRequest();

            http.open("POST", url, async);

            http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var upload = http.upload || { addEventListener: function () {
                } };
            upload.addEventListener("error", function (e) {
                throw e;
            }, false);
            upload.addEventListener("progress", function (e) {
                _this.onSuccess(e);
            }, false);

            http.send(json);
        };

        Logger.prototype.onSuccess = function (e) {
            this.Queue = [];
        };
        return Logger;
    })();
    Berf.Logger = Logger;

    var BerfCookie = (function () {
        function BerfCookie() {
        }
        BerfCookie.XmlHttpRequest = function (uri, serverStartDt) {
            var value = BerfCookie.value("berf." + uri + "." + serverStartDt);

            return value;
        };

        BerfCookie.Navigation = function () {
            return BerfCookie.value("berf.navigation");
        };

        BerfCookie.value = function (name) {
            var json = BerfCookie.getCookie(name);
            var value = json === "" ? {} : JSON.parse(json);

            return value;
        };

        BerfCookie.getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }
            return "";
        };
        return BerfCookie;
    })();
    Berf.BerfCookie = BerfCookie;

    var Navigation = (function () {
        function Navigation(nav) {
            if (!nav) {
                nav = performance.timing;
            }
            this.navigationStart = this.delta(nav.navigationStart, nav.navigationStart);
            this.unloadEventStart = this.delta(nav.navigationStart, nav.unloadEventStart);
            this.unloadEventEnd = this.delta(nav.navigationStart, nav.unloadEventEnd);
            this.redirectStart = this.delta(nav.navigationStart, nav.redirectStart);
            this.redirectEnd = this.delta(nav.navigationStart, nav.redirectEnd);
            this.fetchStart = this.delta(nav.navigationStart, nav.fetchStart);
            this.domainLookupStart = this.delta(nav.navigationStart, nav.domainLookupStart);
            this.domainLookupEnd = this.delta(nav.navigationStart, nav.domainLookupEnd);
            this.connectStart = this.delta(nav.navigationStart, nav.connectStart);
            this.connectEnd = this.delta(nav.navigationStart, nav.connectEnd);
            this.secureConnectionStart = this.delta(nav.navigationStart, nav.secureConnectionStart);
            this.requestStart = this.delta(nav.navigationStart, nav.requestStart);
            this.responseStart = this.delta(nav.navigationStart, nav.responseStart);
            this.responseEnd = this.delta(nav.navigationStart, nav.responseEnd);
            this.domLoading = this.delta(nav.navigationStart, nav.domLoading);
            this.domInteractive = this.delta(nav.navigationStart, nav.domInteractive);
            this.domContentLoadedEventStart = this.delta(nav.navigationStart, nav.domContentLoadedEventStart);
            this.domContentLoadedEventEnd = this.delta(nav.navigationStart, nav.domContentLoadedEventEnd);
            this.domComplete = this.delta(nav.navigationStart, nav.domComplete);
            this.loadEventStart = this.delta(nav.navigationStart, nav.loadEventStart);
            this.loadEventEnd = this.delta(nav.navigationStart, nav.loadEventEnd);
            this.redirectCount = nav.redirectCount;

            // The duration attribute MUST return a DOMHighResTimeStamp equal to the difference between loadEventEnd and startTime, respectively.
            this.startTime = this.navigationStart;
            this.duration = this.loadEventEnd - this.navigationStart;
        }
        Navigation.prototype.delta = function (tZero, n) {
            return n === 0 ? 0 : n - tZero;
        };
        return Navigation;
    })();
    Berf.Navigation = Navigation;
})(Berf || (Berf = {}));

try  {
    var berf = new Berf.Logger();
    throw "ah";
} catch (ex) {
    if (typeof console === "object" && typeof console.log === "function") {
        console.log(ex);
    }
}
//declare var XMLHttpRequest;
//var req = new XMLHttpRequest;
//var baseSend = req.send;
//req.send = () => {
//    berf.logResources();
//    console.log("send");
//    return baseSend.apply(req, arguments);
//};
//window["XMLHttpRequest"] = () => { return req; };
//# sourceMappingURL=Berf.js.map
