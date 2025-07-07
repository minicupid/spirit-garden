// HYBRID UI ========================================================

function openHybridUI(plot) {
    showBackground();
    hideUI();
    pauseStageGrowth(plot.id);
    // set up ui
    hybrid_current_plot = plot;
    hybrid_ui.style.display = 'flex';
    hybrid_sidebar.style.display = 'none';
    
    const dirt_plot = dirt_plots.find(d => d.id === plot.id);
    if (!dirt_plot || !dirt_plot.seed_type) {
        console.error(`no seed type found for plot: ${plot.id}`);
        return;
    }
    // input 1 is old seed
    const plot_seed_type = seed_types[dirt_plot.seed_type];
    if (plot_seed_type) {
        console.log(plot_seed_type);
        hybrid_old_seed.innerHTML = `<img src="${plot_seed_type.img}" style="width:64px; height:64px;">`;
        hybrid_hint.innerHTML = `<p> add another seed+ to attempt hybridizing your ${plot_seed_type.name} </p>`;
    } else {
        console.error(`seed type not found for plot: ${dirt_plot.seed_type}`);
        return;
    }
    // input 2 is new seed
    hybrid_new_seed.innerHTML = `<img src="assets/add.png" style="width:50px; height:50px;">`;
    hybrid_new_seed.style.opacity = 0.7;
    hybrid_new_seed.style.cursor = 'pointer';
    hybrid_selected_seed = null;
    // output is possible seed
    hybrid_possible_seed.innerHTML = '';
    hybrid_possible_seed.style.opacity = 0.7;
    hybrid_combine_btn.disabled = true;
}

// click input2 to open sidebar
hybrid_new_seed.onclick = () => {
    showHybridSidebar();
    showBackground();
};

// officially hybridize
hybrid_combine_btn.onclick = () => {
    combineHybrid();
};

function showHybridSidebar() {
    // get all rare seeds in player inventory
    hybrid_sidebar.style.display = 'flex';
    hybrid_sidebar_seeds.innerHTML = '';
    player_seeds.forEach(seed => {
        if (seed.is_rare && seed.amount > 0) {
            const type = seed_types[seed.id];
            if (type) {
                let btn = document.createElement('button');
                btn.innerHTML = `<img src="${type.img}" style="width:32px; height:32px;">`;
                btn.classList.add('hybrid_sidebar_seed');
                // when click update new input
                btn.onclick = () => {
                    hybrid_selected_seed = seed.id;
                    hybrid_sidebar.style.display = 'none';
                    hybrid_new_seed.innerHTML = `<img src="${type.img}" style="width:64px; height:64px;">`;
                    hybrid_new_seed.style.opacity = 1;
                    checkHybridResult();
                };
                hybrid_sidebar_seeds.appendChild(btn);
            } else {
                console.error(`seed type not found: ${seed.id}`);
            }
        }
    });
}

// checks if valid combo, then updates output
function checkHybridResult() {
    const dirt_plot = dirt_plots.find(d => d.id === hybrid_current_plot.id);
    const parent1 = dirt_plot ? dirt_plot.seed_type : null;
    const parent2 = hybrid_selected_seed;
    
    console.log("checking hybrid result:", { parent1, parent2 });
    
    if (!parent1 || !parent2) {
        console.log("missing parent seeds");
        return;
    }
    
    // see if a combo exists
    hybrid_recipe = hybrid_recipes.find(r =>
        (r.parents.includes(parent1) && r.parents.includes(parent2))
    );
    
    console.log("found recipe:", hybrid_recipe);
    
    if (hybrid_recipe) {
        const result_seed = hybrid_recipe.child;
        console.log("result seed:", result_seed);
        
        // check if discovered
        if (discovered_seeds[result_seed]) {
            const seed = seed_types[result_seed];
            if (seed) {
                hybrid_possible_seed.innerHTML = `<img src="${seed.img}" style="width:64px; height:64px;">`;
                hybrid_possible_seed.style.opacity = 1;
            } else {
                console.error(`seed type not found: ${result_seed}`);
                hybrid_possible_seed.innerHTML = `<img src="assets/unfound.gif" style="width:64px; height:64px;">`;
                hybrid_possible_seed.style.opacity = 0.7;
            }
        } else {
            console.log("seed not discovered yet:", result_seed);
            hybrid_possible_seed.innerHTML = `<img src="assets/undiscovered.gif" style="width:64px; height:64px;">`;
            hybrid_possible_seed.style.opacity = 0.7;
        }
        hybrid_combine_btn.disabled = false;
    } else {
        console.log("no valid recipe found");
        hybrid_possible_seed.innerHTML = `<img src="assets/unfound.gif" style="width:64px; height:64px;">`;
        hybrid_possible_seed.style.opacity = 0.7;
        hybrid_combine_btn.disabled = true;
        notification("this combination is illegal!", "assets/btns/close.png");
        setTimeout(() => {
            notification("check your notepad!", "assets/notif.png");
        }, 1000);
    }
}

function closeHybridUI() {
    hybrid_ui.style.display = 'none';
    resumeStageGrowth(hybrid_current_plot.id);
}

// HYBRID COMBINE FUNCTION ========================================================

function combineHybrid() {
    pauseStageGrowth(hybrid_current_plot.id);
    if (!hybrid_recipe || !hybrid_current_plot) {
        console.log("no recipe or plot selected");
        return;
    }
    
    const dirt_plot = dirt_plots.find(d => d.id === hybrid_current_plot.id);
    if (!dirt_plot) {
        console.log("dirt plot not found");
        return;
    }
    
    // Add parent seeds info to the plot
    dirt_plot.parents = [dirt_plot.seed_type, hybrid_selected_seed];
    dirt_plot.hybrid = true;
    
    console.log("hybrid parents added to plot:", dirt_plot.parents);
    console.log("plot hybrid status:", dirt_plot.hybrid);
    
    closeHybridUI();
    
    const seed1 = seed_types[dirt_plot.seed_type];
    const seed2 = seed_types[hybrid_selected_seed];
    notification(`attempting to hybridize ${seed1.id} and ${seed2.id}...`, "assets/btns/hybridize.png");
}

// CUT SPROUT ========================================================

function cutSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot) {
        // flower return calculation
        if (dirt_plot.sprout_stage === 6) {
            const flower_type = flower_types[dirt_plot.seed_type];
            if (flower_type) {
                const flower_return = Math.floor(Math.random() * (2 - 0));
                console.log("added", flower_return, flower_type.name, "to inventory"); // log flower return
            } else {
                console.error(`flower type not found for seed: ${dirt_plot.seed_type}`);
            }
        }
        else {
            const seed_slot = player_seeds.find(seed => seed.id === dirt_plot.seed_type);
            seed_slot.amount ++;
            console.log("returned 1", dirt_plot.seed_type, "to inventory:", seed_slot.amount); // log seed return

        }


        // reset growth timer
        if (dirt_plot.growthTimer) {
            clearInterval(dirt_plot.growthTimer);
            dirt_plot.growthTimer = null;
        }
        
        // reset plot data
        dirt_plot.has_sprout = false;
        dirt_plot.sprout_stage = null;
        dirt_plot.seed_type = null;
        console.log(plot_id, "'s sprout has been cut");

        // cut animation overlay 1s
        const plot_element = dirt_plot.element;
        
        // fade the plant to 0% opacity
        const plantImg = plot_element.querySelector('img');
        if (plantImg) {
            plantImg.style.transition = 'opacity 1s ease-out';
            plantImg.style.opacity = '0';
        }
        
        const overlay = document.createElement('img');
        overlay.src = `assets/cut.gif?t=${Date.now()}`;
        overlay.alt = "cut animation";
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '10';
        
        plot_element.style.position = 'relative';
        plot_element.appendChild(overlay);
        
        // remove overlay after 1s
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                plot_element.removeChild(overlay);
            }
            // show default dirt
            plot_element.innerHTML = `<img src = "assets/dirt.png">`;

        }, 1000);

        hideUI();
        
    }
}