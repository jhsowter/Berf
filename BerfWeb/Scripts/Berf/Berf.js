﻿var Berf;
(function (Berf) {
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
            this.Sent = [];
            var tag = document.querySelector('[berf-url]');
            this.Url = tag.getAttribute("berf-url");

            window.addEventListener("beforeunload", function (e) {
                _this.onBeforeUnload(e);
            });

            window.addEventListener("load", function (e) {
                _this.onLoad(e);
            });
        }
        Logger.prototype.logResources = function () {
            if (typeof window.performance.getEntriesByType === "function") {
                var resources = window.performance.getEntriesByType("resource");
                if (resources.length > 0) {
                    for (var i = 0; i < resources.length; i++) {
                        var resource = resources[i];
                        resource["BerfType"] = 2;
                        this.enqueue(resource);
                    }
                }
            }
        };

        Logger.prototype.log = function () {
            if (typeof window.performance.getEntriesByType === "function") {
                var timing2 = window.performance.getEntriesByType("navigation");
                if (timing2.length > 0) {
                    timing2[0]["BerfType"] = 2;
                    this.enqueue(timing2[0]);
                }

                this.logResources();
            }

            if (typeof window.performance.timing === "object") {
                var timing1 = new Navigation(window.performance.timing);
                timing1["BerfType"] = 1;
                this.enqueue(timing1);
            }
        };

        Logger.prototype.onLoad = function (e) {
            this.log();
            this.send();
        };

        Logger.prototype.onBeforeUnload = function (e) {
            this.log();
            this.send();
        };

        Logger.prototype.send = function (queue) {
            if (typeof queue === "undefined") { queue = this.Queue; }
            if (queue.length > 0) {
                this.post(queue);
            }
        };

        Logger.prototype.enqueue = function (data) {
            var extended = this.extend(data, BerfCookie.value());

            var inQueue = this.contains(this.Queue, extended);
            var isSent = this.contains(this.Sent, extended);

            if (!inQueue && !isSent) {
                this.Queue.push(extended);
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

        Logger.prototype.post = function (data) {
            var _this = this;
            var json = JSON.stringify(data);
            var http = new XMLHttpRequest();

            http.open("POST", this.Url, true);

            http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

            http.upload.addEventListener("error", function (e) {
                throw e;
            }, false);
            http.upload.addEventListener("progress", function (e) {
                _this.onSuccess(e);
            }, false);

            http.send(json);
        };

        Logger.prototype.onSuccess = function (e) {
            for (var i = 0; i < this.Queue.length; i++) {
                this.Sent.push(this.Queue[i]);
            }
            this.Queue = [];
        };
        return Logger;
    })();
    Berf.Logger = Logger;

    var BerfCookie = (function () {
        function BerfCookie() {
        }
        BerfCookie.value = function () {
            var json = BerfCookie.getCookie("berfData");
            var value = JSON.parse(json);

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
                nav = window.performance.timing;
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
        }
        Navigation.prototype.delta = function (tZero, n) {
            return n === 0 ? 0 : n - tZero;
        };
        return Navigation;
    })();
    Berf.Navigation = Navigation;
})(Berf || (Berf = {}));

var berf = new Berf.Logger();

//declare var XMLHttpRequest;
var req = new XMLHttpRequest;
var baseSend = req.send;
req.send = function () {
    berf.logResources();
    console.log("send");
    return baseSend.apply(req, arguments);
};
window["XMLHttpRequest"] = function () {
    return req;
};
//# sourceMappingURL=Berf.js.map
