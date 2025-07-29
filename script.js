function loadCSS(href) {
    // check if it's already loaded to avoid duplicates
    if ([...document.styleSheets].some(s => s.href && s.href.endsWith(href))) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function unloadCSS(href) {
    const link = document.querySelector(`link[href="${href}"]`);
    if (link) {
        link.remove();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCSS("css styles/UI/seed_inv.css");
    loadCSS("css styles/UI/notification.css");
    loadCSS("css styles/UI/notepad.css");
});

const dirt = document.querySelectorAll('.dirt');

dirt.forEach(dirt => {
    dirt.addEventListener('click', () => {
        selectPlot(dirt); // calls selectPlot function when player clicks on dirt
    });
});

let selected_plot = null;

// click for music
document.addEventListener('click', () => {
    const music = document.getElementById('music');
    if (music && music.paused) {
        music.play().catch(error => {
            if (error.name !== 'AbortError') {
                console.warn('music play failed:', error);
            }
        });
    }
});
