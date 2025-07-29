function pausePlotById(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot && dirt_plot.stage_timer) {
        clearTimeout(dirt_plot.stage_timer);
        dirt_plot.stage_timer = null;
        dirt_plot.growth_paused = true;
        // console.log('growth paused for plot', plot_id, '- timer cleared');
    } else {
        // console.log('growth paused for plot', plot_id, '- no active timer');
    }
}

function resumePlotById(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot && dirt_plot.growth_paused && dirt_plot.has_sprout && dirt_plot.sprout_stage < 6) {
        dirt_plot.growth_paused = false;
        startStageTimer(dirt_plot.id);
        // console.log('growth resumed for plot', plot_id);
        return true;
    }
    return false;
}