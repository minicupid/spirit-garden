// GROWTH PROCESS ========================================================

function growth(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot) return;
    if (dirt_plot.sprout_stage >= 6) return;

    // start the first stage timer
    startStageTimer(plot_id);
}

function startStageTimer(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot || dirt_plot.sprout_stage >= 6) return;

    console.log(`starting stage timer for ${plot_id} at stage ${dirt_plot.sprout_stage}`);
    
    // Set 10 second timer for current stage
    dirt_plot.stage_timer = setTimeout(() => {
        advanceSprout(plot_id);

        // Clear timer
        dirt_plot.stage_timer = null;
        
        // Start next stage if not done - check AFTER advanceSprout
        const updated_plot = dirt_plots.find(plot => plot.id === plot_id);
        if (updated_plot && updated_plot.sprout_stage < 6 && !updated_plot.growth_paused) {
            startStageTimer(plot_id);
        }
    }, 10000);
}

function pauseStageGrowth(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot || !dirt_plot.stage_timer) return;
    
    console.log(`pausing stage growth for ${plot_id}`);
    
    // Clear the current timer
    clearTimeout(dirt_plot.stage_timer);
    dirt_plot.stage_timer = null;
    dirt_plot.growth_paused = true;
}

function resumeStageGrowth(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot || !dirt_plot.growth_paused) return;
    
    console.log(`resuming stage growth for ${plot_id}`);
    
    // Reset pause flag
    dirt_plot.growth_paused = false;
    
    // Restart the stage timer
    startStageTimer(plot_id);
}