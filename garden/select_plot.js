function selectPlot(plot) {
    selected_plot = plot; // set selected plot to the clicked dirt plot
    // console.log("selected plot:", selected_plot);
    
    // find the corresponding data object for the selected plot
    const dirt_plot = dirt_plots.find(d => d.id === plot.id);
    
    if (dirt_plot && dirt_plot.has_sprout) {
        const seed = seed_types[dirt_plot.seed_type];
        // console.log("seed:", seed);

        // Check if fully grown (stage 6)
        if (dirt_plot.sprout_stage === 6) {
            // show grown flower buttons
            interaction_btns.classList.remove('hidden');
            seed_btn.classList.add('hidden');
            info_btn.classList.remove('hidden');
            water_btn.classList.add('hidden');
            hybrid_btn.classList.remove('hidden');
            cut_btn.classList.remove('hidden');
        } else {
            // show growing plant buttons
            interaction_btns.classList.remove('hidden');
            seed_btn.classList.add('hidden');
            info_btn.classList.remove('hidden');
            water_btn.classList.remove('hidden');

            // check if plot has water_notification
            if (dirt_plot.element.querySelector('.water_notification')) {
                water_btn.style.opacity = '1';
            } else {
                water_btn.style.opacity = '0.5';
            }
            
            hybrid_btn.classList.remove('hidden');
            cut_btn.classList.remove('hidden');
        }
    }
    else {
        // show interaction_btns to display seed_btn when no sprout
        interaction_btns.classList.remove('hidden');
        seed_btn.classList.remove('hidden');
        info_btn.classList.add('hidden');
        water_btn.classList.add('hidden');
        hybrid_btn.classList.add('hidden');
        cut_btn.classList.add('hidden');
    }

    dirt.forEach(dirt => {
        dirt.tabIndex = -1;
    });
    
    // activate background clicks for hiding UI
    showBackground();
    
    // position buttons relative to the selected plot
    positionButtons(plot);
}