var Berf;
(function (Berf) {
    var Logger = (function () {
        function Logger() {
            var _this = this;
            this.Timeout = 5000;
            this.extend = function (toExtend, extender) {
                var key, val;
                for (key in extender) {
                    val = extender[key];
                    toExtend[key] = val;
                }

                return toExtend;
            };
            this.Queue = [];
            var tag = document.querySelector('[berf-url]');
            this.Url = tag.getAttribute("berf-url");

            window.addEventListener("beforeunload", function (e) {
                _this.onBeforeUnload(e);
            });

            document.addEventListener("DOMContentLoaded", function (e) {
                _this.onDOMContentLoaded(e);
            });
            //setTimeout(() => { this.send(); }, this.timeout);
        }
        Logger.prototype.onDOMContentLoaded = function (e) {
            if (typeof window.performance.getEntriesByType === "function") {
                var timing2 = window.performance.getEntriesByType("navigation");
                if (timing2.length > 0) {
                    timing2["BerfType"] = 2;
                    this.enqueue(timing2);
                }
            }

            if (typeof window.performance.timing === "object") {
                var timing1 = new Navigation(window.performance.timing);
                timing1["BerfType"] = 1;
                this.enqueue(timing1);
            }

            this.send();
        };

        Logger.prototype.onBeforeUnload = function (e) {
        };

        Logger.prototype.send = function (queue) {
            if (typeof queue === "undefined") { queue = this.Queue; }
            if (queue.length > 0) {
                this.post(queue);
            }
        };

        Logger.prototype.enqueue = function (data) {
            this.extend(data, BerfCookie.value());
            this.Queue.push(data);
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
            this.navigationStart = 0;
            if (!nav) {
                nav = window.performance.timing;
            }

            //this.navigationStart = 0;
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
        Navigation.prototype.deltaFromStart = function (n) {
            if (typeof n === "number") {
                return this.delta(this.navigationStart, n);
            }
        };

        Navigation.prototype.delta = function (tZero, n) {
            return n === 0 ? 0 : n - tZero;
        };
        return Navigation;
    })();
    Berf.Navigation = Navigation;
})(Berf || (Berf = {}));

new Berf.Logger();
//# sourceMappingURL=Berf.js.map
