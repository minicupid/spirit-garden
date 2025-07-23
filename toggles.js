// when ui / btn open + user clicks outside, hide elements
background.addEventListener('click', hideUI);

const blurElement = document.getElementById('blur');

function blurBg() {
    blurElement.style.display = 'block';
}

function unblurBg() {
    blurElement.style.display = 'none';
}

function hideUI() {
    // hide seed UI if visible
    if (seed_ui.style.display === 'flex') {
        seed_ui.style.display = 'none';
    }

    // hide hybrid UI if visible
    if (hybrid_ui.style.display === 'flex') {
        hybrid_ui.style.display = 'none';
        if (hybrid_current_plot) {
            resumePlotById(hybrid_current_plot.id);
        }
    }

    //hide info ui if visible
    if (info_container.style.display === 'flex') {
        info_container.style.display = 'none';
    }
    
    // hide buttons if visible
    if (!interaction_btns.classList.contains('hidden')) { // if visible
        interaction_btns.classList.add('hidden');
    }
    
    // hide background to prevent click capture
    background.style.display = 'none';
    
    // clear selection
    selected_plot = null;

    // reset tab index
    dirt.forEach(dirt => {
        dirt.tabIndex = 0;
    });
}

function showBackground() {
    background.style.display = 'block';
}

function hideBackground() {
    background.style.display = 'none';
}

function hideInteractionButtons() {
    interaction_btns.classList.add('hidden');
}

function disableSelection(plot) {
    plot.style.pointerEvents = 'none';
}

function enableSelection(plot) {
    plot.style.pointerEvents = 'auto';
}

function pauseGrowth(plot) {
    const dirt_plot = dirt_plots.find(plot => plot.id === plot.id);
    if (dirt_plot) {
        dirt_plot.growthTimer = null;
    }
}

// INTERACTION BUTTONS ========================================================

close_btn.addEventListener('click', () => {
    hideUI();
    console.log("close button clicked");
});

cut_btn.addEventListener('click', () => {
    console.log("cut button clicked on", selected_plot.id);
    cutSprout(selected_plot.id);
    hideUI();
});

info_btn.addEventListener('click', () => {
    console.log("info button clicked on", selected_plot.id);
    if (!selected_plot) return;
    const dirt_plot = dirt_plots.find(plot => plot.id === selected_plot.id);
    if (!dirt_plot || !dirt_plot.has_sprout) return;
    console.log("dirt plot:", dirt_plot);
    showPlotInfo(dirt_plot);
    hideUI();
    blurBg();
});

// close info ui button
const close_info_btn = document.getElementById('close_info_btn');
if (close_info_btn) {
    close_info_btn.addEventListener('click', () => {
        closeInfoUI();
        unblurBg();
        hideUI();
    });
}

hybrid_btn.addEventListener('click', () => {
    if (!selected_plot) return;
    const dirt_plot = dirt_plots.find(plot => plot.id === selected_plot.id);
    if (dirt_plot && dirt_plot.hybrid) {
        notification("you already attempted hybridizing this seed!", "assets/btns/hybridize.png");
    } else if (dirt_plot && dirt_plot.seed_type !== "rare") {
        notification("you can only hybridize rare seeds!", "assets/btns/close.png");
    }
    else {
        blurBg();
        openHybridUI(selected_plot);
    }
});

hybrid_cancel_btn.addEventListener('click', () => {
    closeHybridUI();
    unblurBg();
});

close_notepad_btn.addEventListener('click', () => {
    const notepad = document.getElementById('notepad');

    if (notepad) {
        unblurBg();
        notepad.style.display = 'none';
    }
    hideUI();
});

notepad_btn.addEventListener('click', () => {
    const notepad = document.getElementById('notepad');

    if (notepad) {
        blurBg();
        notepad.style.display = 'flex';
        const np_flower_list = document.getElementById('np_flower_list');
        if (np_flower_list) {
            np_flower_list.innerHTML = '<img id = "np_cover" src = "assets/notepadUi_cover.png">';
        }
    }
    hideUI();
    if (info_container.style.display === 'block') {
        info_container.style.display = 'none';
    }
});

// INVENTORY BUTTON TOGGLE
if (inventory_btn) {
    inventory_btn.addEventListener('click', () => {
        if (inventory.style.display === 'flex') {
            inventory.style.display = 'none';
            unblurBg();
        } else {
            showFlowerInventory();
            blurBg();
        }
        hideUI();
        if (info_container.style.display === 'block') {
            info_container.style.display = 'none';
        }
    });
}

if (close_inventory_btn) {
    close_inventory_btn.addEventListener('click', () => {
        inventory.style.display = 'none';
        unblurBg();
    });
}