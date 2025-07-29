

function showFlowerInventory() {
    // console.log("loading flower inventory:");
    const inventory_items = document.getElementById('inventory_items');
    inventory_items.innerHTML = ''; // clear previous records

    let hasFlower = false; // check if player has any flowers

    player_flowers.forEach(flower => {
        if (flower.amount > 0) { // display flower if > 0
            hasFlower = true;
            const flower_type = flower_types[flower.id]; // find flower type
            
            let btn = document.createElement('button'); // create button for each flower
            btn.classList.add('flower_type_btn'); // add class to button
            
            console.log("flower type:", flower_type);
            // create button content
            let buttonContent = `<img src="${flower_type.img}" alt="${flower_type.name}"><span>${flower.amount}</span>`;
            btn.innerHTML = buttonContent;
            
            // hover effects for title
            btn.addEventListener('mouseenter', () => {
                const inventory_h2 = document.querySelector('#inventory h2');
                if (inventory_h2) {
                    inventory_h2.innerHTML = flower_type.name;
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                const inventory_h2 = document.querySelector('#inventory h2');
                if (inventory_h2) {
                    inventory_h2.innerHTML = 'your flowers';
                }
            });
            
            // sound effects
            btn.addEventListener('mouseover', () => {
                item_hover.currentTime = 0;
                item_hover.play();
            });

            btn.addEventListener('mouseout', () => {
                item_hover.pause();
            });

            inventory_items.appendChild(btn); // add button to inventory
        }
    });

    if (!hasFlower) {
        inventory_items.innerHTML = '<p style="color: #666; text-align: center; margin: 20px; line-height: 1.5;">you haven\'t collected any flowers yet. get a seed to blossom, then harvest it!</p>';
    }

    // show inventory
    inventory.style.display = 'flex';
}

function addFlowerToInventory(flowerId) {
    // find or create flower slot
    let flower_slot = player_flowers.find(flower => flower.id === flowerId);
    if (!flower_slot) {
        // create new flower slot if it doesn't exist
        flower_slot = { id: flowerId, amount: 0 };
        player_flowers.push(flower_slot);
    }
    flower_slot.amount++;
    
    const flower_type = flower_types[flowerId];
    // console.log(`added ${flower_type.name} to flower inventory`);
}