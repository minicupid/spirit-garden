function positionButtons(plot) {
    // get the position of the selected dirt plot
    const plotRect = plot.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    
    // find the corresponding data object for the selected plot
    const dirt_plot = dirt_plots.find(d => d.id === plot.id);
    console.log("dirt_plot:", dirt_plot);
    console.log("plot:", plot);

    
    // position buttons relative to plot
    if (dirt_plot && dirt_plot.sprout_stage >= 3) {
        console.log("displaying mature btn positions");

        info_btn.style.position = 'absolute';
        info_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - info_btn.offsetWidth / 2) + 'px';
        info_btn.style.top = (plotRect.top - canvasRect.top - 30) + 'px';

        hybrid_btn.style.position = 'absolute';
        hybrid_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - hybrid_btn.offsetWidth / 2 + 50) + 'px';
        hybrid_btn.style.top = (plotRect.top - canvasRect.top + 25) + 'px';

        cut_btn.style.position = 'absolute';
        cut_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - cut_btn.offsetWidth / 2 + 50) + 'px';
        cut_btn.style.top = (plotRect.top - canvasRect.top + 25) + 'px';

        water_btn.style.position = 'absolute';
        water_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - water_btn.offsetWidth / 2 - 50) + 'px';
        water_btn.style.top = (plotRect.top - canvasRect.top + 25) + 'px';

        close_btn.style.position = 'absolute';
        close_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - close_btn.offsetWidth / 2) + 'px';
        close_btn.style.top = (plotRect.top - canvasRect.top + 80) + 'px';

    } else {
        console.log("displaying normal btn positions");
        
        seed_btn.style.position = 'absolute';
        seed_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - seed_btn.offsetWidth / 2) + 'px';
        seed_btn.style.top = (plotRect.top - canvasRect.top - 10) + 'px';

        info_btn.style.position = 'absolute';
        info_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - info_btn.offsetWidth / 2) + 'px';
        info_btn.style.top = (plotRect.top - canvasRect.top - 13) + 'px';

        hybrid_btn.style.position = 'absolute';
        hybrid_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - hybrid_btn.offsetWidth / 2 + 50) + 'px';
        hybrid_btn.style.top = (plotRect.top - canvasRect.top + 40) + 'px';

        water_btn.style.position = 'absolute';
        water_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - water_btn.offsetWidth / 2 - 50) + 'px';
        water_btn.style.top = (plotRect.top - canvasRect.top + 40) + 'px';

        close_btn.style.position = 'absolute';
        close_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - close_btn.offsetWidth / 2) + 'px';
        close_btn.style.top = (plotRect.top - canvasRect.top + 100-13) + 'px';

    }
} 