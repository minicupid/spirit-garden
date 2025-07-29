document.addEventListener('DOMContentLoaded', function() {
    if (typeof flower_types === 'undefined' || typeof discovered_seeds === 'undefined' || typeof seed_types === 'undefined' || typeof hybrid_recipes === 'undefined') {
        console.error('Global variables not available yet, retrying...');
        setTimeout(() => {
            if (typeof flower_types !== 'undefined' && typeof discovered_seeds !== 'undefined' && typeof seed_types !== 'undefined' && typeof hybrid_recipes !== 'undefined') {
                initializeNotepad();
            } else {
                console.error('Global variables still not available');
            }
        }, 100);
        return;
    }
    
    initializeNotepad();
});

function initializeNotepad() {
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
                imgSrc = 'assets/icons/undiscovered_small.gif';
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
}