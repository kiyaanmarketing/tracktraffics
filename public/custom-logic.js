// custom-logic.js

console.log("Custom affiliate logic loaded for MysteriumVPN");

// Example: fire a tracking pixel
(function() {
    let img = document.createElement("img");
    img.src = "https://www.tracktraffics.com/pixel?offer=mysteriumvpn&host=" + window.location.hostname;
    img.width = 1;
    img.height = 1;
    img.style.display = "none";
    document.body.appendChild(img);
})();
