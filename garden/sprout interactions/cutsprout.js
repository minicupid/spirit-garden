function cutSprout(plot_id) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot_id);
    if (dirt_plot) {
        swish.play();
        // flower return calculation
        if (dirt_plot.sprout_stage === 6) {
            // if hybrid flower, use hybrid_result, otherwise use seed_type
            const flower_seed_type = dirt_plot.hybrid ? (dirt_plot.hybrid_result || dirt_plot.seed_type) : dirt_plot.seed_type;
            const flower_type = flower_types[flower_seed_type];
            
            if (flower_type) {
                addFlowerToInventory(flower_seed_type);
                
                // 100% chance to return rare seed, 0% chance to return normal seed
                const rare_chance = 0.1;
                let baseSeed = flower_seed_type.replace(/_rare$/, ''); // remove _rare if present
                const seed_id = rare_chance < 0.5 ? `${baseSeed}_rare` : baseSeed;
                
                // find or create the seed slot if it doesn't exist
                let seed_slot = player_seeds.find(seed => seed.id === seed_id);
                if (!seed_slot) {
                    // new seed slot
                    seed_slot = { id: seed_id, amount: 0, is_rare: seed_id.includes('_rare') };
                    player_seeds.push(seed_slot);
                }
                seed_slot.amount++;
                
                let displayName = seed_id;
                if (seed_id.includes('_rare')) {
                    displayName = seed_id.replace('_rare', '');
                    notification(`${displayName} (rare) seed added to inventory.`, `assets/icons/notif.png`);
                } else {
                    notification(`${seed_id} seed added to inventory.`, `assets/icons/notif.png`);
                }
                // console.log(`returned ${seed_id.replace('_rare','+')} to inventory`);
            } else {
                console.error(`flower type not found for seed: ${flower_seed_type}`);
            }
        }
        else {
            const seed_slot = player_seeds.find(seed => seed.id === dirt_plot.seed_type);
            seed_slot.amount ++;
            notification(`${dirt_plot.seed_type.replace('_rare','+')} seed returned.`, `assets/icons/notif.png`); // notification
            // console.log("returned a", dirt_plot.seed_type, "to inventory");
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

        // cut animation overlay 1s
        const plot_element = dirt_plot.element;
        
        // fade the plant to 0% opacity
        const plantImg = plot_element.querySelector('img');
        if (plantImg) {
            plantImg.style.transition = 'opacity 1s ease-out';
            plantImg.style.opacity = '0';
        }
        
        const overlay = document.createElement('img');
        overlay.src = `assets/overlays/cut.gif?t=${Date.now()}`;
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