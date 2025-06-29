const seed_btn = document.getElementById('seed_btn');
const water_btn = document.getElementById('water_btn');
const seed_close_btn = document.getElementById('seed_close_btn');
const seed_ui = document.getElementById('seed_ui');
const background = document.getElementById('background');
const garden = document.getElementById('garden');
const info_btn = document.getElementById('info_btn');
const hybrid_btn = document.getElementById('hybrid_btn');
const cut_btn = document.getElementById('cut_btn');
const close_btn = document.getElementById('close_btn');
const interaction_btns = document.getElementById('interaction_btns');

// dirt plots dataset
const dirt_plots = [
    { id: "dirt1", element: document.getElementById('dirt1'), has_sprout: false, sprout_stage: null },
    { id: "dirt2", element: document.getElementById('dirt2'), has_sprout: false, sprout_stage: null },
    { id: "dirt3", element: document.getElementById('dirt3'), has_sprout: false, sprout_stage: null },
    { id: "dirt4", element: document.getElementById('dirt4'), has_sprout: false, sprout_stage: null },
];

// sprout growth stages
const sprout_stages = [
    { stage: 0, name: "empty" },
    { stage: 1, name: "seedling", img: "assets/growth/1.png" },
    { stage: 2, name: "sprout", img: "assets/growth/2.png" },
    { stage: 3, name: "sapling", img: "assets/growth/3.png" },
    { stage: 4, name: "baby bud", img: "assets/growth/4.png" }, 
    { stage: 5, name: "mature bud", img: "assets/growth/5.png" }
];

const seed_types =[
    { id: "red", name: "red seed", img: "assets/seeds/red_seed.png" },
    { id: "blue", name: "blue seed", img: "assets/seeds/blue_seed.png" },
    { id: "green", name: "green seed", img: "assets/seeds/green_seed.png" },
    { id: "yellow", name: "yellow seed", img: "assets/seeds/yellow_seed.png" },
    { id: "brown", name: "brown seed", img: "assets/seeds/brown_seed.png" },
    { id: "grey", name: "grey seed", img: "assets/seeds/grey_seed.png" },
]

let player_seeds = [
    { id: "red", amount: 1 },
    { id: "blue", amount: 0 },
    { id: "green", amount: 0 },
    { id: "yellow", amount: 1 },
    { id: "brown", amount: 2 },
    { id: "grey", amount: 0 },
]

const flower_types = [
    { id: "red", name: "rose shards", img: "assets/flowers/red.gif" },
    { id: "blue", name: "azure fluid", img: "assets/flowers/blue.gif" },
    { id: "green", name: "fragments of the wind", img: "assets/flowers/green.gif" },
    { id: "yellow", name: "sunboy bloom", img: "assets/flowers/yellow.gif" },
    { id: "brown", name: "odd peony", img: "assets/flowers/brown.gif" },
    { id: "grey", name: "ocean vapor", img: "assets/flowers/grey.gif" },
]

// when ui / btn open + user clicks outside, hide elements
background.addEventListener('click', hideUI);

function hideUI() {
    // hide seed UI if visible
    if (seed_ui.style.display === 'flex') {
        seed_ui.style.display = 'none';
    }
    
    // hide buttons if visible
    if (!interaction_btns.classList.contains('hidden')) { // if visible
        interaction_btns.classList.add('hidden');
    }
    
    // hide background to prevent click capture
    background.style.display = 'none';
    
    // clear selection
    selected_plot = null;
}

function showBackground() {
    background.style.display = 'block';
}

function hideBackground() {
    background.style.display = 'none';
}



const dirt = document.querySelectorAll('.dirt');

dirt.forEach(dirt => {
    dirt.addEventListener('click', () => {
        selectPlot(dirt); // calls selectPlot function when player clicks on dirt
    });
});

let selected_plot = null;

function selectPlot(plot) {
    selected_plot = plot; // set selected plot to the clicked dirt plot
    console.log("selected plot:", selected_plot.id);
    
    // find the corresponding data object for the selected plot
    const dirt_plot = dirt_plots.find(d => d.id === plot.id);
    
    if (dirt_plot && dirt_plot.has_sprout) {
        // show buttons after clicking on dirt with sprout
        interaction_btns.classList.remove('hidden');
        
        if (dirt_plot.sprout_stage >= 3) {
            cut_btn.classList.remove('hidden'); // show cut if > stage 3
            hybrid_btn.classList.add('hidden'); // hide hybrid if > stage 3
        }
        else {
            cut_btn.classList.add('hidden'); // hide cut if < stage 3
            hybrid_btn.classList.remove('hidden'); // show hybrid if < stage 3
        }
        
        // show info and water buttons, hide seed button
        seed_btn.classList.add('hidden');
        info_btn.classList.remove('hidden');
        water_btn.classList.remove('hidden');
        
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
    
    // activate background clicks for hiding UI
    showBackground();
    
    // position buttons relative to the selected plot
    positionButtons(plot);
}

// INTERACTION BUTTONS ========================================================

close_btn.addEventListener('click', () => {
    hideUI();
    console.log("close button clicked");
});

water_btn.addEventListener('click', () => {
    console.log("water button clicked on", selected_plot.id);
    advanceSprout(selected_plot.id);
    hideUI();
});

cut_btn.addEventListener('click', () => {
    console.log("cut button clicked on", selected_plot.id);
    cutSprout(selected_plot.id);
    hideUI();
});

// ADD SEED INTERACTION ========================================================

seed_btn.addEventListener('click', () => {
    console.log("seed button clicked on:", selected_plot.id);
    seedUI();

});

seed_close_btn.addEventListener('click', () => {
    seedUI();
});

function seedUI() { // shows seed ui with updated seed items

    if (seed_ui) {
        if (seed_ui.style.display === 'none' || seed_ui.style.display === '') { // if closed
            console.log("open seed UI");
            seed_ui.style.display = 'flex'; // open
            interaction_btns.classList.add('hidden'); // hide buttons when ui open
            showBackground(); // activate background clicks for hiding UI
        } else {
            console.log("close seed UI");
            seed_ui.style.display = 'none'; // close
            interaction_btns.classList.add('hidden'); // hide buttons
            hideBackground(); // disable background when UI is closed
            return; // exit function when closing UI
        }
    }
    
    console.log("loading current seeds:");
    const seed_items = document.getElementById('seed_items');
    seed_items.innerHTML = ''; // clears previous records

    let hasSeed = false; // sets all seed types to false (doesn't display type)

    player_seeds.forEach(seed => {
        if (seed.amount > 0) { // display seed type if > 0
            hasSeed = true;
            const seed_type = seed_types.find(type => type.id === seed.id); // finds seed type
            let btn = document.createElement('button'); // creates button for each seed type
            btn.classList.add('seed_type_btn'); // adds class to button
            btn.innerHTML = `<img src = "${seed_type.img}" alt = "${seed_type.name}" style = "width: 32px; height: 32px;"><span style = "font-family: monospace;">${seed.amount}</span>` ;
            console.log("loaded seeds:", seed_items);
            btn.addEventListener('click', () => {
                plantSeed(seed.id, selected_plot); // sends seed and plot to plantSeed function
            });
            seed_items.appendChild(btn); // adds button inside seed items div
        }
    });

    if (!hasSeed) {
        seed_items.innerHTML = '<p>looks pretty empty in here...</p>';
    }
}

// PLANTING SEED ========================================================

function plantSeed(seed_id, plot_element) {
    console.log("planted a", seed_id, "seed on", plot_element.id);
    
    // find dirt plot in dataset
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_element.id);
    
    if (dirt_plot) {
        // update the dirt plot data
        dirt_plot.has_sprout = true;
        dirt_plot.sprout_stage = 0;
        dirt_plot.seed_type = seed_id;
        
        // get current sprout stage info
        const current_stage = sprout_stages.find(stage => stage.stage === 0);
        
        // planting animation stage 0
        const planting_gif = "assets/dirt_plant.gif";
        plot_element.innerHTML = `<img src="${planting_gif}?t=${Date.now()}" alt="planting animation">`; // new gif after 8s
        
        setTimeout(() => {
            advanceSprout(plot_element.id);
            console.log("advanced to stage 1");
            
            // start growth process
            growth(plot_element.id);
            console.log("growth started");
        }, 8000);

        console.log(`adding seed to ${plot_element.id}`);
        console.log("current plot info:", dirt_plot);

        // update seed inventory (remove 1 from player_seeds)
        const seed_slot = player_seeds.find(seed => seed.id === seed_id);
        seed_slot.amount--;

        // hide UI and background
        seed_ui.style.display = 'none';
        interaction_btns.classList.add('hidden');
        hideBackground();
        selected_plot = null; // clear selection
        return; // exit function
    }
}

// GROWTH PROCESS ========================================================

function growth(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot) return;
    
    const totalDuration = 60000; // 60 secs
    const stageDuration = totalDuration / 5; // 12 secs
    const interval = 1000; // update every 1 sec
    
    let timeElapsed = 0;
    
    const growthTimer = setInterval(() => {
        timeElapsed += interval;
        
        // advance to next stage every stageDuration
        if (timeElapsed % stageDuration === 0 && timeElapsed > 0) {
            advanceSprout(plot_id);
        }
        
        // stop when complete
        if (timeElapsed >= totalDuration) {
            clearInterval(growthTimer);
            dirt_plot.growthTimer = null;
            console.log(`growth complete for ${plot_id}`);
        }
        
        const progress = (timeElapsed / totalDuration) * 100;
        console.log(`growth progress for ${plot_id}: ${progress.toFixed(1)}%`);
    }, interval);
    
    // savetimer
    dirt_plot.growthTimer = growthTimer;
}

// ADVANCE STAGE ========================================================

function advanceSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    
    if (dirt_plot && dirt_plot.has_sprout && dirt_plot.sprout_stage < 6) {
        dirt_plot.sprout_stage++;
        const new_stage = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage);
        
        // update sprout visual
        const plot_element = dirt_plot.element;
        
        if (dirt_plot.sprout_stage === 1) {
            plot_element.innerHTML = `<img src = "assets/growth/1.png">`;
        }
        if (dirt_plot.sprout_stage === 2) {
            plot_element.innerHTML = `<img src = "assets/growth/2.png">`;
        }
        if (dirt_plot.sprout_stage === 3) {
            plot_element.innerHTML = `<img src = "assets/growth/3.png">`;
        }
        if (dirt_plot.sprout_stage === 4) {
            plot_element.innerHTML = `<img src = "assets/growth/4.png">`;
        }
        if (dirt_plot.sprout_stage === 5) {
            plot_element.innerHTML = `<img src = "assets/growth/5.png">`;
        }
        if (dirt_plot.sprout_stage === 6) {
            loadFlower(plot_id);
        }
        
        console.log(`advanced ${plot_id} to ${new_stage.name} stage`);
        console.log("current plot info:", dirt_plot);
        
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
        overlay.style.animation = 'fade-hover 3s ease-in-out';
        
        plot_element.style.position = 'relative';
        plot_element.appendChild(overlay);
        
        // remove overlay after 3s
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                plot_element.removeChild(overlay);
            }
        }, 3000);
        
        return;
    }
}

// GET SPROUT INFO ========================================================

function getSproutInfo(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id); // find plot in dataset
    if (dirt_plot && dirt_plot.has_sprout) {
        const current_stage = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage); // find current stage in dataset
        console.log(`sprout info for ${plot_id}:`, {
            seed_type: dirt_plot.seed_type,
            current_stage: current_stage.name,
            stage: dirt_plot.sprout_stage, // current stage number
            hydration: dirt_plot.hydration,
            is_fully_grown: dirt_plot.sprout_stage === 5 // check if fully grown
        });
        return dirt_plot;
    }
    return null;
}

// CUT SPROUT ========================================================

function cutSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot) {
        // reset growth timer
        if (dirt_plot.growthTimer) {
            clearInterval(dirt_plot.growthTimer);
            dirt_plot.growthTimer = null;
        }
        
        // reset plot data
        dirt_plot.has_sprout = false;
        dirt_plot.sprout_stage = null;
        dirt_plot.seed_type = null;
        console.log("cut sprout on", plot_id);

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

// STAGE 6 LOAD FLOWER ========================================================

function loadFlower(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot) {
        const plot_element = dirt_plot.element;
        const flower_type = flower_types.find(flower => flower.id === dirt_plot.seed_type);
        
        if (flower_type) {
            plot_element.innerHTML = `<img src="${flower_type.img}" alt="${flower_type.name}">`;
            console.log(`flower bloomed: ${flower_type.name} on ${plot_id}`);
        }
    }
}