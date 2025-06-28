const seed_btn = document.getElementById('seed_btn');
const water_btn = document.getElementById('water_btn');
const seed_close_btn = document.getElementById('seed_close_btn');
const seed_ui = document.getElementById('seed_ui');
const background = document.getElementById('background');
const garden = document.getElementById('garden');
const info_btn = document.getElementById('info_btn');
const interaction_btns = document.getElementById('interaction_btns');

// Dirt plots dataset
const dirt_plots = [
    { id: "dirt1", element: document.getElementById('dirt1'), has_sprout: false, sprout_stage: 0 },
    { id: "dirt2", element: document.getElementById('dirt2'), has_sprout: false, sprout_stage: 0 },
    { id: "dirt3", element: document.getElementById('dirt3'), has_sprout: false, sprout_stage: 0 },
    { id: "dirt4", element: document.getElementById('dirt4'), has_sprout: false, sprout_stage: 0 },
];

// Sprout growth stages
const sprout_stages = [
    { stage: 0, name: "planting" },
    { stage: 1, name: "seedling", img: "assets/growth/stage1.png" },
    { stage: 2, name: "sprout", img: "assets/growth/stage2.png" },
    { stage: 3, name: "sapling", img: "assets/growth/stage3.png" },
    { stage: 4, name: "budding", img: "assets/growth/stage4.png" }, 
    { stage: 5, name: "bloomed", img: "assets/growth/stage5.png" }
];

const seed_types =[
    { id: "red", name: "red seed", img: "assets/seeds/red_seed.png" },
    { id: "blue", name: "blue seed", img: "assets/seeds/blue_seed.png" },
    { id: "green", name: "green seed", img: "assets/seeds/green_seed.png" },
    { id: "yellow", name: "yellow seed", img: "assets/seeds/yellow_seed.png" },
    { id: "brown", name: "brown seed", img: "assets/seeds/brown_seed.png" },
]

let player_seeds = [
    { id: "red", amount: 0 },
    { id: "blue", amount: 0 },
    { id: "green", amount: 0 },
    { id: "yellow", amount: 1 },
    { id: "brown", amount: 3 },
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

function toggleSeedUI() {
    if (seed_ui) {
        if (seed_ui.style.display === 'none' || seed_ui.style.display === '') { // if closed
            seed_ui.style.display = 'flex'; // open
            interaction_btns.classList.add('hidden'); // hide buttons when ui open
            showBackground(); // activate background clicks for hiding UI
        } else {
            seed_ui.style.display = 'none'; // close
            interaction_btns.classList.add('hidden'); // hide buttons
            hideBackground(); // disable background when UI is closed
        }
    }
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
    
    // show buttons after clicking on dirt
    interaction_btns.classList.remove('hidden');
    
    // ensure all individual buttons are visible
    seed_btn.classList.remove('hidden');
    info_btn.classList.remove('hidden');
    water_btn.classList.remove('hidden');
    
    // activate background clicks for hiding UI
    showBackground();
    
    // get the position of the selected dirt plot
    const plotRect = plot.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    
    // button positioning relative to the dirt plot
    seed_btn.style.position = 'absolute';
    seed_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - seed_btn.offsetWidth / 2) + 'px';
    seed_btn.style.top = (plotRect.top - canvasRect.top - 13) + 'px';

    info_btn.style.position = 'absolute';
    info_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - info_btn.offsetWidth / 2) + 'px';
    info_btn.style.top = (plotRect.top - canvasRect.top + 100-13) + 'px';

    water_btn.style.position = 'absolute';
    water_btn.style.left = (plotRect.left - canvasRect.left + plotRect.width / 2 - water_btn.offsetWidth / 2 - 50) + 'px';
    water_btn.style.top = (plotRect.top - canvasRect.top + 40) + 'px';
}

seed_btn.addEventListener('click', () => {
    info_btn.classList.add('hidden');
    showSeedUI();
    console.log("selected plant on:", selected_plot.id);
});

function showSeedUI() { // shows seed ui with updated seed items
    seed_ui.style.display = 'flex';
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
            btn.addEventListener('click', () => {
                plantSeed(seed.id, selected_plot); // plants seed type in selected plot
                console.log("loaded seeds:", seed_items);
            });
            seed_items.appendChild(btn); // adds button inside seed items div
        }
    });

    if (!hasSeed) {
        seed_items.innerHTML = '<p>looks pretty empty in here...</p>';
    }
}

function plantSeed(seed_id, plot_element) {
    console.log("planted seed:", seed_id, "on plot:", plot_element.id);
    
    // Find the dirt plot in our dataset
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_element.id);
    
    if (dirt_plot) {
        // Update the dirt plot data
        dirt_plot.has_sprout = true;
        dirt_plot.sprout_stage = 0; // Start at seed stage
        dirt_plot.seed_type = seed_id;
        
        // Get the current sprout stage info
        const current_stage = sprout_stages.find(stage => stage.stage === 0);
        
        // planting animation
        const gifUrl = "assets/dirt_plant.gif";
        plot_element.innerHTML = `<img src="${gifUrl}?t=${Date.now()}" alt="planting animation">`;

        
        console.log(`Created ${current_stage.name} in ${plot_element.id}`);
        console.log("Dirt plot info:", dirt_plot);
        
        // Set timer to advance to stage 1 after 5 seconds
        setTimeout(() => {
            advanceSprout(plot_element.id);
        }, 8000);
    }
    
    // update seed inventory
    const seed_slot = player_seeds.find(seed => seed.id === seed_id);
    seed_slot.amount--;

    // hide UI
    seed_ui.style.display = 'none';
    interaction_btns.classList.add('hidden');
    // hide background when seed is planted
    hideBackground();
    selected_plot = null; // clear selection
}

function advanceSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    
    if (dirt_plot && dirt_plot.has_sprout && dirt_plot.sprout_stage < 5) {
        dirt_plot.sprout_stage++;
        const new_stage = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage);
        
        // Update the visual sprout
        const plot_element = dirt_plot.element;
        
        // Change the innerHTML image source to stage 1
        if (dirt_plot.sprout_stage === 1) {
            plot_element.innerHTML = `<img src = "assets/growth/stage1.png">`;
        }
        
        const sprout = plot_element.querySelector('.sprout');
        if (sprout) {
            sprout.src = new_stage.img;
            sprout.alt = new_stage.name;
        }
        
        console.log(`Advanced ${plot_id} to ${new_stage.name} stage`);
        console.log("Updated dirt plot info:", dirt_plot);
    }
}

function getSproutInfo(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot && dirt_plot.has_sprout) {
        const current_stage = sprout_stages.find(stage => stage.stage === dirt_plot.sprout_stage);
        console.log(`Sprout info for ${plot_id}:`, {
            seed_type: dirt_plot.seed_type,
            current_stage: current_stage.name,
            stage_number: dirt_plot.sprout_stage,
            is_fully_grown: dirt_plot.sprout_stage === 5
        });
        return dirt_plot;
    }
    return null;
}

