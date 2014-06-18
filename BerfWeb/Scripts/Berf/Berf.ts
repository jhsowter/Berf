module Berf {
    export class Logger {
        Timeout = 5000;
        Url: string;
        Queue: Array<any>;

        constructor() {
            this.Queue = [];
            var tag = document.querySelector('[berf-url]');
            this.Url = tag.getAttribute("berf-url");

            window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
                this.onBeforeUnload(e);
            });

            document.addEventListener("DOMContentLoaded", (e: Event) => {
                this.onDOMContentLoaded(e);
            });

            //setTimeout(() => { this.send(); }, this.timeout);
        }

        onDOMContentLoaded(e: Event) {
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
        }

        onBeforeUnload(e: BeforeUnloadEvent) {
        }

        send(queue: Array<any> = this.Queue) {
            if (queue.length > 0) {
                this.post(queue);
            }
        }

        enqueue(data) {
            this.extend(data, BerfCookie.value());
            this.Queue.push(data);
        }

        post(data: any) {
            var json = JSON.stringify(data);
            var http = new XMLHttpRequest();

            http.open("POST", this.Url, true);

            http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

            http.upload.addEventListener("error", (e) => { throw e; }, false);
            http.upload.addEventListener("progress", (e: ProgressEvent) => {
                this.onSuccess(e);
            }, false);

            http.send(json);
        }

        onSuccess(e: ProgressEvent) {
            this.Queue = [];
        }

        extend = function (toExtend, extender: any) {
            var key, val;
            for (key in extender) {
                val = extender[key];
                toExtend[key] = val;
            }

            return toExtend;
        };
    }

    export class BerfCookie {
        static value() {
            var json = BerfCookie.getCookie("berfData");
            var value = JSON.parse(json);

            return value;
        }

        private static getCookie(cname: string) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }
    }

    export class Navigation {
        navigationStart: number = 0;
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

        constructor(nav?: any) {
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

        deltaFromStart(n: number) {
            if (typeof n === "number") {
                return this.delta(this.navigationStart, n);
            }
        }

        delta(tZero: number, n: number) {
            return n === 0 ? 0 : n - tZero;
        }
    }
}

new Berf.Logger();

