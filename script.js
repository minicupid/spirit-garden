
const dirt = document.querySelectorAll('.dirt');

dirt.forEach(dirt => {
    dirt.addEventListener('click', () => {
        selectPlot(dirt); // calls selectPlot function when player clicks on dirt
    });
});

let selected_plot = null;

// click for music
document.addEventListener('click', () => {
    const music = document.getElementById('music');
    if (music && music.paused) {
        music.play();
    }
});

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

// ADD SEED INTERACTION ========================================================

seed_btn.addEventListener('click', () => {
    // console.log("seed button clicked on:", selected_plot.id);
    seedUI();

});

seed_close_btn.addEventListener('click', () => {
    seedUI();
});

function seedUI() { // shows seed ui with updated seed items

    if (seed_ui) {
        if (seed_ui.style.display === 'none' || seed_ui.style.display === '') { // if closed
            // console.log("open seed UI");
            seed_ui.style.display = 'flex'; // open
            interaction_btns.classList.add('hidden'); // hide buttons when ui open
            showBackground(); // activate background clicks for hiding UI
        } else {
            // console.log("close seed UI");
            seed_ui.style.display = 'none'; // close
            interaction_btns.classList.add('hidden'); // hide buttons
            hideBackground(); // disable background when UI is closed
            // reset tab index
            dirt.forEach(dirt => {
                dirt.tabIndex = 0;
            });
            return; // exit function when closing UI

        }
    }
    
    // console.log("loading current seeds:");
    const seed_items = document.getElementById('seed_items');
    seed_items.innerHTML = ''; // clears previous records

    let hasSeed = false; // sets all seed types to false (doesn't display type)

    player_seeds.forEach(seed => {
        if (seed.amount > 0) { // display seed type if > 0
            hasSeed = true;
            discovered_seeds[seed.id] = true;
            // console.log("discovered seeds:", discovered_seeds);
            const seed_type = seed_types[seed.id]; // finds seed type
            
            let btn = document.createElement('button'); // creates button for each seed type
            btn.classList.add('seed_type_btn'); // adds class to button
            
            // console.log("seed type:", seed_type);
            // create button
            // console.log("seed type img:", seed_type.img);
            let buttonContent = `<img src="${seed_type.img}" alt="${seed_type.name}"><span>${seed.amount}</span>`;
            // rare indicator
            if (seed.is_rare) {
                buttonContent += `<img src="assets/rare.png" alt="rare" class="rare-indicator">`;
            }

            btn.innerHTML = buttonContent;
            // console.log("loaded seeds:", seed_items);
            
            // change h2 when hover seed btn
            btn.addEventListener('mouseenter', () => {
                const seed_ui_h2 = document.querySelector('#seed_ui h2');
                if (seed_ui_h2) {
                    seed_ui_h2.innerHTML = seed_type.name;
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                const seed_ui_h2 = document.querySelector('#seed_ui h2');
                if (seed_ui_h2) {
                    seed_ui_h2.innerHTML = 'select a seed';
                }
            });
            
            btn.addEventListener('focus', () => {
                const seed_ui_h2 = document.querySelector('#seed_ui h2');
                if (seed_ui_h2) {
                    seed_ui_h2.innerHTML = seed_type.name;
                }
            });
            
            btn.addEventListener('blur', () => {
                const seed_ui_h2 = document.querySelector('#seed_ui h2');
                if (seed_ui_h2) {
                    seed_ui_h2.innerHTML = 'select a seed';
                }
            });
            
            btn.addEventListener('click', () => {
                plantSeed(seed.id, selected_plot); // sends seed and plot to plantSeed function
                // reset tab index
                dirt.forEach(dirt => {
                    dirt.tabIndex = 0;
                });
            });
            seed_items.appendChild(btn); // adds button inside seed items div
            seed_items.addEventListener("wheel", (event) => {
                event.preventDefault();
                seed_items.scrollLeft += event.deltaY;
            });
            btn.addEventListener('mouseover', () => {
                item_hover.currentTime = 0;
                item_hover.play();
            });

            btn.addEventListener('mouseout', () => {
                item_hover.pause();
            });

            btn.addEventListener('click', () => {
                click.currentTime = 0;
                click.play();
            });
        }
    });

    if (!hasSeed) {
        seed_items.innerHTML = '<p>looks pretty empty in here...</p>';
    }
}

// PLANTING SEED ========================================================

function plantSeed(seed_id, plot_element) {
    // console.log("planted a", seed_id, "seed on", plot_element.id);
    notification(`planted a ${seed_types[seed_id].name}`, seed_types[seed_id].img);

    // find dirt plot in dataset
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_element.id);
    
    if (dirt_plot) {
        // update the dirt plot data
        dirt_plot.has_sprout = true;
        dirt_plot.sprout_stage = 0;
        dirt_plot.seed_type = seed_id;
        dirt_plot.parents = [];
        dirt_plot.hybrid = false; // check if parents = 2 -> true
        
        // get current sprout stage info
        const current_stage = sprout_stages.find(stage => stage.stage === 0);
        
        // planting animation stage 0
        const planting_gif = "assets/dirt_plant.gif";
        plot_element.innerHTML = `<img src="${planting_gif}?t=${Date.now()}" alt="planting animation">`; // new gif after 8s
        plant_seed_sound.currentTime = 0;
        plant_seed_sound.play();
        
        setTimeout(() => {
            advanceSprout(plot_element.id);
            // console.log("advanced to stage 1");
            
            // start growth process
            growth(plot_element.id);
            // console.log("growth started");
            enableSelection(plot_element);
        }, 6000);

        // console.log(`adding seed to ${plot_element.id}`);
        // console.log("current plot info:", dirt_plot);

        // update seed inventory (remove 1 from player_seeds)
        const seed_slot = player_seeds.find(seed => seed.id === seed_id);
        seed_slot.amount--;

        // hide UI and background
        seed_ui.style.display = 'none';
        interaction_btns.classList.add('hidden');
        disableSelection(plot_element);
        hideBackground();
        selected_plot = null; // clear selection
        return; // exit function
    }
}

function waterPlease(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (!dirt_plot || !dirt_plot.has_sprout) return;
    
    pauseStageGrowth(plot_id);
    
    // create water notification
    const plot_element = dirt_plot.element;
    const water_notification = document.createElement('div');
    water_notification.className = 'water_notification';
    water_notification.innerHTML = '<img src = "assets/waterPls.gif">';
    
    plot_element.style.position = 'relative';
    plot_element.appendChild(water_notification);
}

// water button listener
water_btn.addEventListener('click', () => {
    if (!selected_plot) return;
    
    const dirt_plot = dirt_plots.find(plot => plot.id === selected_plot.id);
    if (!dirt_plot || !dirt_plot.element.querySelector('.water_notification')) return;
    
    const water_notification = dirt_plot.element.querySelector('.water_notification');
    if (water_notification) water_notification.remove();
    
    water_sound.currentTime = 0;
    water_sound.play();
    
    // water overlay
    const overlay = document.createElement('img');
    overlay.src = `assets/waterOverlay.gif?t=${Date.now()}`;
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:10';
    dirt_plot.element.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 3000);
    
    resumePlotById(selected_plot.id);
    hideUI();
});


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

// NOTIFICATIONS ========================================================

function notification(message, img) {
    const notification_container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<img src = "${img}"> <span>${message}</span>`;
    notification_container.appendChild(notification);
    notification.style.display = 'block';
    notif_sound.currentTime = 0;
    notif_sound.play();
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 2500);
    }, 3000);
}

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

// CLOCK ========================================================

function updateClock() {
    const now = new Date();
    let h = now.getHours();
    let m = String(now.getMinutes()).padStart(2, '0'); // add 0 if less than 10
    let ampm = h >= 12 ? 'P<br>M' : 'A<br>M';
    h = h % 12; // convert to 12-hour format
    if (h === 0) h = 12; // show 12 instead of 0
    h = String(h).padStart(2, '0');
    let formatted = `${h}:${m}`;
    document.getElementById('clock').innerHTML = `<h1> ${formatted} </h1> <p> ${ampm} </p>`;
}
setInterval(updateClock, 1000);
updateClock();