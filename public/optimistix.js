(function() {
    try {
        const script = document.currentScript || Array.from(document.scripts).find(s => s.src.includes('optimistix.js'));
        if (!script) return;

        const url = new URL(script.src);
        const trackUrl = url.searchParams.get('url');
        if (!trackUrl) return;

        const sendBeacon = () => {
            navigator.sendBeacon(trackUrl) || 
            fetch(trackUrl, {method: 'GET', keepalive: true});
        };

       
        sendBeacon();

        
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.pathname.match(/(checkout|cart)/i)) {
                sendBeacon();
            }
        });
    } catch (e) {
        console.warn('Optimistix error:', e);
    }
})();