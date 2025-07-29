function waterPlease(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot || !dirt_plot.has_sprout) return;
    
    pauseStageGrowth(plot_id);
    
    // create water notification
    const plot_element = dirt_plot.element;
    const water_notification = document.createElement('div');
    water_notification.className = 'water_notification';
    water_notification.innerHTML = '<img src = "assets/overlays/waterPls.gif">';
    
    plot_element.style.position = 'relative';
    plot_element.appendChild(water_notification);
}

// water button listener
water_btn.addEventListener('click', () => {
    if (!selected_plot) return;
    
    const dirt_plot = dirt_plots.find(plot => plot.id === selected_plot.id);
    if (!dirt_plot || !dirt_plot.element.querySelector('.water_notification')) return;
    
    const water_notification = dirt_plot.element.querySelector('.water_notification');
    if (water_notification) water_notification.remove();
    
    water_sound.currentTime = 0;
    water_sound.play();
    
    // water overlay
    const overlay = document.createElement('img');
            overlay.src = `assets/overlays/waterOverlay.gif?t=${Date.now()}`;
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:10';
    dirt_plot.element.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 3000);
    
    resumePlotById(selected_plot.id);
    hideUI();
});