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

// ADVANCE STAGE ========================================================

function advanceSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    let new_stage = null;
    
    if (dirt_plot && dirt_plot.has_sprout && dirt_plot.sprout_stage < 6) {
        dirt_plot.sprout_stage++;
        new_stage = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage);
        
        // update sprout visual
        const plot_element = dirt_plot.element;
        
        if (dirt_plot.sprout_stage === 6) {
            const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
            if (dirt_plot) {
                hideUI();
                // check if hybrid
                if (dirt_plot.hybrid) {
                    const seed1 = seed_types[dirt_plot.parents[0]];
                    const seed2 = seed_types[dirt_plot.parents[1]];
                    
                    // find the hybrid recipe to get the result
                    const hybrid_recipe = hybrid_recipes.find(r =>
                        (r.parents.includes(dirt_plot.parents[0]) && r.parents.includes(dirt_plot.parents[1]))
                    );
                    
                    if (hybrid_recipe) {
                        const hybrid_success = Math.floor(Math.random() * 2) + 1; // randomly pick 1 or 2 as 50/50
                        
                        if (hybrid_success === 1) {
                            // 50% hybridization fail
                            const parent1_flower = flower_types[dirt_plot.parents[0]];
                            if (parent1_flower) {
                                plot_element.innerHTML = `<img src="${parent1_flower.img}" alt="${parent1_flower.name}">`;
                                console.log(`hybrid failed, showing ${parent1_flower.name} on ${plot_id}`);
                                advanceAnimation(plot_element);
                                notification(`looks like ${seed1.id} seed has failed to hybridize.`, "assets/btns/hybridize.png");
                                setTimeout(() => {
                                    notification(`try again with another ${seed2.id} seed!`, "assets/notif.png");
                                }, 1000);
                            }
                        } else {
                            // 50% hybridization success
                            const result_seed = seed_types[hybrid_recipe.child];
                            const flower_type = flower_types[hybrid_recipe.child];
                            
                            console.log("hybrid result:", hybrid_recipe.child);
                            console.log("flower type:", flower_type);
                            
                            if (flower_type) {
                                plot_element.innerHTML = `<img src="${flower_type.img}" alt="${flower_type.name}">`;
                                console.log(`hybrid flower bloomed: ${flower_type.name} on ${plot_id}`);
                                advanceAnimation(plot_element);
                                
                                // store hybrid result 
                                dirt_plot.hybrid_result = hybrid_recipe.child.replace('_rare', '');
                                
                                // check if this flower/seed is discovered and update if not
                                const result_seed_id = hybrid_recipe.child.replace('_rare', '');
                                if (!discovered_seeds[result_seed_id]) {
                                    discovered_seeds[result_seed_id] = true;
                                    console.log(`new flower discovered: ${result_seed_id}`);
                                    setTimeout(() => {
                                        notification(`you discovered a new flower: ${flower_type.name}!`, flower_type.img);
                                    }, 1000);
                                }
                            } else {
                                console.error(`flower type not found for hybrid result: ${hybrid_recipe.child}`);
                            }
                            
                            notification(`${seed1.id} has successfully hybridized!`, "assets/btns/hybridize.png");
                        }
                    }
                }
                else {
                    const plot_element = dirt_plot.element;
                    const flower_type = flower_types[dirt_plot.seed_type];
                    
                    if (flower_type) {
                        plot_element.innerHTML = `<img src="${flower_type.img}" alt="${flower_type.name}">`;
                        console.log(`flower bloomed: ${flower_type.name} on ${plot_id}`);
                        advanceAnimation(plot_element);
                        }
                    }
                }
            }
        } 
        
        else {
            const stage_info = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage);
            if (stage_info && stage_info.img) {
                plot_element.innerHTML = `<img src="${stage_info.img}" alt="${stage_info.name}">`;
                advanceAnimation(plot_element);
            }
            
            // check if it needs water
            if (dirt_plot.sprout_stage === 2 || dirt_plot.sprout_stage === 4) {
                console.log(plot_id, "needs water");
                waterPlease(plot_id);
                return;  
            }
        }
        
        if (new_stage) {
            console.log(`advanced ${plot_id} to ${new_stage.name} stage`);
        } else {
            console.log(`advanced ${plot_id} to stage ${dirt_plot.sprout_stage}`);
        }
        console.log("current plot info:", dirt_plot);
        
        function advanceAnimation(plot_element) {
        // advancement animation 3s
        const overlay = document.createElement('img');
        overlay.src = "assets/advance.gif";
        overlay.alt = "advancement animation";
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '10';
        overlay.style.animation = 'fade-hover 2.5s ease-in-out';
        growth_sound.currentTime = 0;
        growth_sound.play();
        plot_element.style.position = 'relative';
        plot_element.appendChild(overlay);
        
        // remove overlay after 3s
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                plot_element.removeChild(overlay);
            }

        }, 2500);
        }

        // stage progress bar
        const progressValue = document.getElementById('growth-progress-value');
        if (progressValue) {
            const percent = Math.max(0, Math.min(100, (dirt_plot.sprout_stage / 6) * 100));
            progressValue.style.width = percent + '%';
        }
    }