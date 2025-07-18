// HYBRID UI ========================================================

function openHybridUI(plot) {
    showBackground();
    hideUI();
    pauseGame();
    console.log('game paused for hybrid view');
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
        console.log("discovered_seeds[result_seed]:", discovered_seeds[result_seed]);
        
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
        console.log("enabling combine button");
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
    resumeGame();
    console.log('game resumed after hybrid view');
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
    notification(`${seed2.id} added. let's see how this turns out.`, "assets/btns/hybridize.png");
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
            plot_element.style.animation = 'popup 0.3s ease-out';

        }, 1000);

        hideUI();
        
    }
}

// INFO FUNCTION ========================================================

function showPlotInfo(dirt_plot) {
    const plot_number = dirt_plot.id.slice(-1); // grab last # of plot
    const is_rare = seed_types[dirt_plot.seed_type]?.id.includes('+');
    const plot_name = `plot ${plot_number}${is_rare ? ' ✦ ✦ ✦' : ''}`; // add rare indicator
    
    const is_hybrid = dirt_plot.hybrid && dirt_plot.parents?.length === 2; // 2 parents = hybrid
    const hybrid_recipe = is_hybrid ? hybrid_recipes.find(r => 
        r.parents.includes(dirt_plot.parents[0]) && r.parents.includes(dirt_plot.parents[1])
    ) : null;
    
    const getDisplayText = (base_type, hybrid_type, discovered) => {
        let text = base_type?.name || '';
        if (hybrid_type && discovered) text += `<br>${hybrid_type.name}`; // if hybrid and discovered, show name
        else if (hybrid_type) text += `<br>???`; // if hybrid but not discovered, show ???
        return text;
    };
    
    const parent_seeds = is_hybrid ? 
        `${seed_types[dirt_plot.parents[0]]?.id} x ${seed_types[dirt_plot.parents[1]]?.id}` : // if hybrid, show both parents
        seed_types[dirt_plot.seed_type]?.id; // if not hybrid
    
    const bloom_text = getDisplayText(
        flower_types[is_hybrid ? dirt_plot.parents[0] : dirt_plot.seed_type],
        hybrid_recipe ? flower_types[hybrid_recipe.child] : null,
        hybrid_recipe ? discovered_seeds[hybrid_recipe.child] : false
    );
    
    const drop_text = getDisplayText(
        seed_types[is_hybrid ? dirt_plot.parents[0] : dirt_plot.seed_type],
        hybrid_recipe ? seed_types[hybrid_recipe.child] : null,
        hybrid_recipe ? discovered_seeds[hybrid_recipe.child] : false
    );
    
    document.getElementById('plot_name').textContent = plot_name;
    document.getElementById('parent_seeds').innerHTML = parent_seeds;
    document.getElementById('bloom_into').innerHTML = bloom_text;
    document.getElementById('can_drop').innerHTML = drop_text;
    
    // make image match plot
    const plot_img = dirt_plot.element.querySelector('img');
    if (plot_img) {
        document.getElementById('sprout_img').src = plot_img.src;
    }
    
    // stage progress bar
    const progressValue = document.getElementById('growth-progress-value');
    if (progressValue) {
        const percent = Math.max(0, Math.min(100, (dirt_plot.sprout_stage / 6) * 100));
        progressValue.style.width = percent + '%';
    }
    
    // growth scale images
    const seed_type = seed_types[dirt_plot.seed_type];
    if (seed_type) {
        document.getElementById('growth_seed_img').src = seed_type.img;
    }
    
    if (dirt_plot.hybrid) {
        document.getElementById('growth_flower_img').src = 'assets/undiscovered.gif';
    } else {
        const flower = flower_types[dirt_plot.seed_type];
        if (flower) {
            document.getElementById('growth_flower_img').src = flower.img;
        }
    }
    
    document.getElementById('info_container').style.display = 'block';
    pauseGame();
    console.log('game paused for info view');
}

// NOTEPAD ========================================================

const basic_flowers_btn = document.getElementById('basic_flowers_btn');
const mystic_flowers_btn = document.getElementById('mystic_flowers_btn');
const ethereal_flowers_btn = document.getElementById('ethereal_flowers_btn');
const np_flower_list = document.getElementById('np_flower_list');

function populateNotepadFlowers(family) {
    if (!np_flower_list) return;
    np_flower_list.innerHTML = '';
    // get all flower keys for selected family
    const flowerKeys = Object.keys(flower_types).filter(key => flower_types[key].family === family && !key.includes('rare'));
    flowerKeys.forEach(flowerKey => {
        const discovered = discovered_seeds[flowerKey];
        const flower = flower_types[flowerKey];
        let imgSrc, name, parents, attracts;
        let parentDisplay = '';
        const singleSeed = seed_types[flowerKey]?.name || '?';
        const recipe = hybrid_recipes.find(r => r.child.replace('_rare','') === flowerKey);
        if (discovered) {
            imgSrc = flower.img;
            name = flower.name;
            // find the rare parents for this flower (from hybrid_recipes)
            let parentNames = '? + ?';
            if (recipe) {
                // remove + for display, use base names
                const parent1 = seed_types[recipe.parents[0].replace('_rare','')];
                const parent2 = seed_types[recipe.parents[1].replace('_rare','')];
                parentNames = parent1 && parent2 ? `${parent1.name} + ${parent2.name}` : '? + ?';
                parentDisplay = `• ${parentNames}<br>• ${singleSeed}`;
            } else {
                parentDisplay = `• ${singleSeed}`;
            }
            parents = parentNames;
            attracts = flower.attracts || '???';
        } else {
            imgSrc = 'assets/undiscovered_small.gif';
            // Obfuscate name: replace random letters with '-'
            const baseName = flower.name || '?';
            name = baseName.split('').map(c => /[a-zA-Z]/.test(c) && Math.random() < 0.5 ? '-' : c).join('');
            // find the parents of flower (from hybrid_recipes)
            let parentFamilies = '? + ?';
            if (recipe) {
                const parent1 = recipe.parents[0].replace('_rare','');
                const parent2 = recipe.parents[1].replace('_rare','');
                const fam1 = flower_types[parent1]?.family || '?';
                const parent2Seed = seed_types[parent2]?.name || '?';
                // show one family hint: [family] + seed
                parentFamilies = `• ${fam1} + ${parent2Seed}`;
                parentDisplay = parentFamilies;
            } else {
                parentDisplay = '';
            }
            parents = parentFamilies;
            attracts = '???';
        }
        // Create the flower item
        const item = document.createElement('div');
        item.className = 'np_flower_item';
        item.innerHTML = `
            <div class="np_flower_name_container">
                <p class="np_flower_name">${name}</p>
            </div>
            <div class="np_flower_container">
                <img class="np_flower_img" src="${imgSrc}">
                <div class="np_flower_item_data">
                    <div class="np_data_title">parents</div>
                    <p class="np_flower_parents">${parentDisplay}</p>
                    <div class="np_data_title">attracts</div>
                    <p class="np_flower_attracts">• ${attracts}</p>
                </div>
            </div>
        `;
        np_flower_list.appendChild(item);
    });
}

if (basic_flowers_btn) {
    basic_flowers_btn.addEventListener('click', () => {
        populateNotepadFlowers('basic');
    });
}
if (mystic_flowers_btn) {
    mystic_flowers_btn.addEventListener('click', () => {
        populateNotepadFlowers('mystic');
    });
}
if (ethereal_flowers_btn) {
    ethereal_flowers_btn.addEventListener('click', () => {
        populateNotepadFlowers('ethereal');
    });
}