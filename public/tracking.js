(function () {

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function getGAClientId() {
    const gaCookie = getCookie('_ga');
    if (!gaCookie) return null;
    const parts = gaCookie.split('.');
    return parts.slice(-2).join('.');
  }

  function isCartPage() {
    const paths = ['/cart', '/checkout', '/guest-checkout'];
    return paths.some(p => window.location.pathname.includes(p));
  }

  function fireGAEvent(eventName, params = {}) {
    if (typeof gtag === "function") {
      gtag("event", eventName, params);
    }
  }

  function createTrackingPixel(url) {
    const img = document.createElement('img');
    img.src = url;
    img.width = 1;
    img.height = 1;
    img.style.display = "none";
    document.body.appendChild(img);
  }

  async function initTracking() {

  
    if (sessionStorage.getItem('tracking_fired')) return;
    sessionStorage.setItem('tracking_fired', 'true');

    try {

      const uniqueId = getCookie('tracking_uuid') || generateUUID();
      setCookie('tracking_uuid', uniqueId, 30);

      const gaClientId = getGAClientId();

      const urlObj = new URL(window.location.href);

      const payload = {
        utm_source: urlObj.searchParams.get("utm_source") || "",
        utm_campaign: urlObj.searchParams.get("utm_campaign") || "",
        utm_medium: urlObj.searchParams.get("utm_medium") || "",
        referrer: document.referrer,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        page: window.location.href,
        ga_client_id: gaClientId
      };

      fireGAEvent("affiliate_click", {
        event_category: "Affiliate",
        event_label: window.location.href
      });

      const response = await fetch('https://www.tracktraffics.com/api/track-user-withoutUniData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: window.location.href,
          referrer: document.referrer,
          unique_id: uniqueId,
          origin: window.location.hostname,
          payload
        })
      });

      const result = await response.json();

      if (result.success && result.affiliate_url) {

        let affiliateUrl = result.affiliate_url;

      
        affiliateUrl +=
          (affiliateUrl.includes('?') ? '&' : '?') +
          'click_id=' + uniqueId +
          (gaClientId ? '&ga_client_id=' + gaClientId : '');

        
        createTrackingPixel(affiliateUrl);

      } else {
        createTrackingPixel(`https://www.tracktraffics.com/api/fallback-pixel?id=${uniqueId}`);
      }

    } catch (error) {
      console.error('Tracking error:', error);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (isCartPage()) {
      initTracking();
    }
    initTracking();
  });

})();
