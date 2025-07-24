function advanceSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    console.log("in advanceSprout");
    
    if (dirt_plot && dirt_plot.has_sprout && dirt_plot.sprout_stage < 6) {
        dirt_plot.sprout_stage++;
        console.log("advanced to stage:", dirt_plot.sprout_stage);
        
        // update sprout visual
        const plot_element = dirt_plot.element;
        
        if (dirt_plot.sprout_stage === 6) {
            hideUI();
            // check if hybrid
            if (dirt_plot.hybrid) {
                const seed1 = seed_types[dirt_plot.parents[0]]; 
                const seed2 = seed_types[dirt_plot.parents[1]];
                
                // find the hybrid recipe to get the result
                const hybrid_recipe = hybrid_recipes.find(r => {
                    if (r.parents.length !== 2) return false;
                    const [a, b] = r.parents;
                    return (
                        (a === dirt_plot.parents[0] && b === dirt_plot.parents[1]) ||
                        (a === dirt_plot.parents[1] && b === dirt_plot.parents[0])
                    );
                });
                
                if (hybrid_recipe) {
                    const hybrid_success = Math.random();
                    
                    if (hybrid_success < 0.2) {
                        // 20% hybridization fail
                        const parent1_flower = flower_types[dirt_plot.parents[0]];
                        if (parent1_flower) {
                            plot_element.innerHTML = `<img src="${parent1_flower.img}" alt="${parent1_flower.name}">`;
                            advanceAnimation(plot_element);
                            notification(`${seed1.id} seed has failed to hybridize.`, "assets/btns/hybridize.png");
                        }
                    } 
                        else {
                            // 80% hybridization success
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
                else { // display non hybrid flower
                    const plot_element = dirt_plot.element;
                    const flower_type = flower_types[dirt_plot.seed_type];
                    
                    if (flower_type) {
                        plot_element.innerHTML = `<img src="${flower_type.img}" alt="${flower_type.name}">`;
                        console.log(`flower bloomed: ${flower_type.name} on ${plot_id}`);
                        advanceAnimation(plot_element);
                        }
                    }
                }
        
        
        else { // < stage 6
            const stage_info = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage);
                
                const plot_element = dirt_plot.element;
                plot_element.innerHTML = `<img src="${stage_info.img}" alt="${stage_info.name}">`;
                console.log("displaying stage:", stage_info.img);
                advanceAnimation(plot_element);
            }
            
            // check if it needs water
            if (dirt_plot.sprout_stage === 2 || dirt_plot.sprout_stage === 4) {
                console.log(plot_id, "needs water");
                waterPlease(plot_id);
                return;  
            }
        
            console.log(`advanced ${plot_id} to ${dirt_plot.sprout_stage} stage`);
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

            // stage progress bar
            const progressValue = document.getElementById('growth-progress-value');
            if (progressValue) {
                const percent = Math.max(0, Math.min(100, (dirt_plot.sprout_stage / 6) * 100));
                progressValue.style.width = percent + '%';
            }
        }
    }
}