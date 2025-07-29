seed_btn.addEventListener('click', () => {
    // console.log("seed button clicked on:", selected_plot.id);
    loadCSS("css styles/UI/seed_inv.css");
    seedUI();

});

seed_close_btn.addEventListener('click', () => {
    unloadCSS("css styles/UI/seed_inv.css");
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
                buttonContent += `<img src="assets/icons/rare.png" alt="rare" class="rare-indicator">`;
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
        const planting_gif = "assets/overlays/dirt_plant.gif";
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