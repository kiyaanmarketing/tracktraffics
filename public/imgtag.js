(async function() {
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    function createTrackingPixel(url) {
        
        var img = document.createElement('img');
        img.src = url;
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


            const adContainer = document.createElement('div');
            adContainer.style.display = 'none';
            adContainer.innerHTML = `
                <ins class='dcmads' style='display:inline-block;width:300px;height:250px'
                    data-dcm-placement='N1648185.2005322OPTIMISE/B33097109.414743151'
                    data-dcm-rendering-mode='iframe'
                    data-dcm-https-only
                    data-dcm-api-frameworks='HTML5'
                    data-dcm-omid-partner='12345'
                    data-dcm-gdpr-applies='gdpr=1'
                    data-dcm-gdpr-consent='gdpr_consent=COv5OrAPOv5OrABLAAAENAPCgALAAAAAAAAAAA'
                    data-dcm-addtl-consent='1~7.12.35.62.66.70.89.93.108'
                    data-dcm-ltd='false'
                    data-dcm-resettable-device-id=''
                    data-dcm-app-id='APP-12345'>
                    <script src='https://www.googletagservices.com/dcm/dcmads.js'><\/script>
                </ins>
            `;
            document.body.appendChild(adContainer);

            let response = await fetch('https://www.tracktraffics.com/api/impression', {
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
            if (result.success && result.affiliate_url) {
                //createTrackingPixel(result.affiliate_url);
                sessionStorage.setItem('iframe_triggered', 'true'); 
            } else {
                //createTrackingPixel('https://www.tracktraffics.com/api/fallback-pixel?id=' + uniqueId);
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
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }
})();
