function showPlotInfo(dirt_plot) {
    info_current_plot = dirt_plot;
    
    const plot_number = dirt_plot.id.slice(-1); // grab last # of plot
    const is_rare = seed_types[dirt_plot.seed_type]?.id.includes('+');
    const is_hybrid = dirt_plot.hybrid && dirt_plot.parents?.length === 2; // 2 parents = hybrid 
    const plot_name = `plot ${plot_number}${is_hybrid ? ' [hybridized]' : is_rare ? ' [can hybridize]' : ''}`; // add hybridized indicator or rare indicator
    
    const hybrid_recipe = is_hybrid ? hybrid_recipes.find(r => {
        if (r.parents.length !== 2) return false;
        const [a, b] = r.parents;
        return (
            (a === dirt_plot.parents[0] && b === dirt_plot.parents[1]) ||
            (a === dirt_plot.parents[1] && b === dirt_plot.parents[0])
        );
    }) : null;
    
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
        document.getElementById('growth_flower_img').src = 'assets/icons/undiscovered_small.gif';
    } else {
        const flower = flower_types[dirt_plot.seed_type];
        if (flower) {
            document.getElementById('growth_flower_img').src = flower.img;
        }
    }
    
    document.getElementById('info_container').style.display = 'block';
    pausePlotById(dirt_plot.id);
}

function closeInfoUI() {
    info_container.style.display = 'none';
    if (info_current_plot) {
        resumePlotById(info_current_plot.id);
    }
}