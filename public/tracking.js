(function() {
    
    async function mainTracking() {
        
        function getCookie(cookieName) {
            return document.cookie.split('; ').reduce((value, cookie) => {
                const [name, val] = cookie.split('=');
                return (name === encodeURIComponent(cookieName)) ? decodeURIComponent(val) : value;
            }, null);
        }

        function setCookie(cookieName, cookieValue) {
            document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}; expires=${(new Date(Date.now() + 86400000)).toUTCString()}; path=/`;
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

        const re_ret_uid = getCookie('re_ret_uid') || crypto.randomUUID();
        const re_ret_ref = getCookie('re_ret_ref') || encodeURIComponent(document.referrer);

        if (!getCookie('re_ret_uid')) setCookie('re_ret_uid', re_ret_uid);
        if (getCookie('re_ret_ref') !== encodeURIComponent(document.referrer)) {
            setCookie('re_ret_ref', encodeURIComponent(document.referrer));
        }

        const trackingResponse = await fetch('https://www.tracktraffics.com/api/track-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: window.location.href,
                referrer: document.referrer,
                coo: re_ret_uid,
                origin: window.location.hostname
            })
        });

        const { url: dynamicUrl } = await trackingResponse.json();

        function createTrackingPixel(url) {
            const img = new Image();
            img.src = url;
            img.style.cssText = 'width:1px;height:1px;display:none;visibility:hidden;';
            document.body.appendChild(img);
        }

        function triggerPixelLogic() {
         
            createTrackingPixel(dynamicUrl);

            const isCartPage = ['/cart', '/checkout'].some(path => 
                window.location.pathname.includes(path)
            );
            if (isCartPage) createTrackingPixel(dynamicUrl);

            if (window.location.pathname.includes('/order-success')) {
                createTrackingPixel(dynamicUrl);
            }

            setTimeout(() => createTrackingPixel(dynamicUrl), 2000);
        }

        triggerPixelLogic();
    }

    if (document.readyState === 'complete') {
        mainTracking();
    } else {
        window.addEventListener('load', mainTracking);
    }
})();