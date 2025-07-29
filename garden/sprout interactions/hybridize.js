// HYBRID UI ========================================================

let info_current_plot = null;

function openHybridUI(plot) {
    showBackground();
    hideUI();
    pausePlotById(plot.id);
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
    hybrid_new_seed.innerHTML = `<img src="assets/btns/add.png" style="width:50px; height:50px;">`;
    hybrid_new_seed.style.opacity = 0.7;
    hybrid_new_seed.style.cursor = 'pointer';
    hybrid_selected_seed = null;
    // output is possible seed
    hybrid_possible_seed.innerHTML = '';
    hybrid_possible_seed.style.opacity = 0.7;
    hybrid_combine_btn.disabled = true;
}

document.addEventListener('DOMContentLoaded', function() {
    // click input2 to open sidebar
    hybrid_new_seed.onclick = () => {
        showHybridSidebar();
        showBackground();
    };

    // officially hybridize
    hybrid_combine_btn.onclick = () => {
        combineHybrid();
        if (hybrid_current_plot) {
            resumePlotById(hybrid_current_plot.id);
        }
    };
});

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
                btn.addEventListener('click', () => {
                    click.currentTime = 0;
                    click.play();
                });
                btn.addEventListener('mouseover', () => {
                    item_hover.currentTime = 0;
                    item_hover.play();
                });
                btn.addEventListener('mouseout', () => {
                    item_hover.pause();
                });
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
    
    // console.log("checking hybrid result:", { parent1, parent2 });
    
    if (!parent1 || !parent2) {
        // console.log("missing parent seeds");
        return;
    }
    
    // see if a combo exists
    hybrid_recipe = hybrid_recipes.find(r => {
        if (r.parents.length !== 2) return false;
        const [a, b] = r.parents;
        return (
            (a === parent1 && b === parent2) ||
            (a === parent2 && b === parent1)
        );
    });
    
    // console.log("found recipe:", hybrid_recipe);
    
    if (hybrid_recipe) {
        const result_seed = hybrid_recipe.child;
        
        // check if discovered
        if (discovered_seeds[result_seed]) {
            const seed = seed_types[result_seed];
            if (seed) {
                hybrid_possible_seed.innerHTML = `<img src="${seed.img}" style="width:64px; height:64px;">`;
                hybrid_possible_seed.style.opacity = 1;
            } else {
                console.error(`seed type not found: ${result_seed}`);
                hybrid_possible_seed.innerHTML = `<img src="assets/icons/unfound.gif" style="width:64px; height:64px;">`;
                hybrid_possible_seed.style.opacity = 0.7;
            }
        } else {
            hybrid_possible_seed.innerHTML = `<img src="assets/icons/undiscovered.gif" style="width:64px; height:64px;">`;
            hybrid_possible_seed.style.opacity = 0.7;
        }
        hybrid_combine_btn.disabled = false;
    } else {
                    hybrid_possible_seed.innerHTML = `<img src="assets/icons/unfound.gif" style="width:64px; height:64px;">`;
        hybrid_possible_seed.style.opacity = 0.7;
        hybrid_combine_btn.disabled = true;
        notification("this combination is illegal!", "assets/btns/close.png");
    }
}

function closeHybridUI() {
    hybrid_ui.style.display = 'none';
    if (hybrid_current_plot) {
        resumePlotById(hybrid_current_plot.id);
    }
}

// HYBRID COMBINE FUNCTION ========================================================

function combineHybrid() {
    if (hybrid_current_plot) {
        pausePlotById(hybrid_current_plot.id);
    }
    if (!hybrid_recipe || !hybrid_current_plot) {
        return;
    }
    
    const dirt_plot = dirt_plots.find(d => d.id === hybrid_current_plot.id);
    if (!dirt_plot) {
        return;
    }
    
    // Add parent seeds info to the plot
    dirt_plot.parents = [dirt_plot.seed_type, hybrid_selected_seed];
    dirt_plot.hybrid = true;
    // remove selected seed from inventory
    const selected_seed = player_seeds.find(seed => seed.id === hybrid_selected_seed);
    if (selected_seed) {
        selected_seed.amount--;
    }
    
    closeHybridUI();
    unblurBg();
    
    const seed1 = seed_types[dirt_plot.seed_type];
    const seed2 = seed_types[hybrid_selected_seed];
    notification(`${seed2.id} added. let's see how this turns out.`, "assets/btns/hybridize.png");
}