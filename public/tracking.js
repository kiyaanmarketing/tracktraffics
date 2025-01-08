(async function () {
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function createTrackingPixel(url, uniqueId) {
        var img = document.createElement('img');
        img.style.width = '1px';
        img.style.height = '1px';
        img.style.display = 'none';
        img.style.visibility = 'hidden';
    
        window.addEventListener('load', () => {
            img.src = `${url}?uniqueId=${uniqueId}`; 
            document.body.appendChild(img);
        });
    }
    

    async function initTracking() {
        if (sessionStorage.getItem('iframe_triggered')) return;

        try {
            let uniqueId = getCookie('tracking_uuid') || localStorage.getItem('tracking_uuid') || generateUUID();
            let expires = new Date(Date.now() + 30 * 86400 * 1000).toUTCString();
            document.cookie = `tracking_uuid=${uniqueId}; expires=${expires}; path=/;`;
            localStorage.setItem('tracking_uuid', uniqueId);

            let response = await fetch('https://www.tracktraffics.com/api/track-user', {
                method: 'POST',
                body: JSON.stringify({
                    url: window.location.href,
                    referrer: document.referrer,
                    unique_id: uniqueId,
                    origin: window.location.hostname,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            let result = await response.json();

            if (result.success && result.affiliate_url) {
                createTrackingPixel(result.affiliate_url, uniqueId);
                sessionStorage.setItem('iframe_triggered', 'true');
            } else {
                createTrackingPixel('https://www.tracktraffics.com/api/fallback-pixel', uniqueId);
            }
        } catch (error) {
            console.error('Error in tracking script:', error);
        }
    }

    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return '';
    }

    await initTracking();
})();
