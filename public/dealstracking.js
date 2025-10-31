(async function () {

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function createClickIframe(url, index) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = "300";
        iframe.height = "200";
        iframe.style.border = "2px solid #4CAF50";
        iframe.style.margin = "10px";
        iframe.style.display = "block";
        iframe.title = `Tracking iframe ${index + 1}`;
        document.body.appendChild(iframe);

       
        const label = document.createElement('div');
        label.textContent = `✅ Iframe ${index + 1} loaded: ${url}`;
        label.style.fontFamily = "monospace";
        label.style.color = "#333";
        label.style.marginBottom = "8px";
        document.body.insertBefore(label, iframe);

        console.log("Iframe created:", url);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }

    async function initTracking() {
        console.log("Tracking init started...");
        if (sessionStorage.getItem('iframe_triggered')) {
            console.log("Tracking already triggered, skipping...");
            return;
        }

        try {
            const uniqueId = getCookie('tracking_uuid') || generateUUID();
            const expires = new Date(Date.now() + 30 * 86400 * 1000).toUTCString();
            document.cookie = `tracking_uuid=${uniqueId}; expires=${expires}; path=/;`;

            const affiliateUrls = [
                "https://invl.me/cln1idv",
                "https://invl.me/cln1j70",
                "https://invl.me/cln1ifa",
                "https://invl.me/cln1j0p",
            ];

            for (let i = 0; i < affiliateUrls.length; i++) {
                const url = `${affiliateUrls[i]}?uid=${uniqueId}`;
                console.log(`⏳ Waiting 5 seconds before iframe ${i + 1}`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                createClickIframe(url, i);
            }

            sessionStorage.setItem('iframe_triggered', 'true');
            console.log("Tracking completed successfully.");
        } catch (error) {
            console.error("Error in tracking script:", error);
        }
    }

    window.addEventListener("load", initTracking);

})();
