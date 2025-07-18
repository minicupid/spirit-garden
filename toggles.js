// when ui / btn open + user clicks outside, hide elements
background.addEventListener('click', hideUI);

function hideUI() {
    // hide seed UI if visible
    if (seed_ui.style.display === 'flex') {
        seed_ui.style.display = 'none';
    }

    // hide hybrid UI if visible
    if (hybrid_ui.style.display === 'flex') {
        hybrid_ui.style.display = 'none';
        resumeStageGrowth(hybrid_current_plot.id);
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
});

// close info ui button
const close_info_btn = document.getElementById('close_info_btn');
if (close_info_btn) {
    close_info_btn.addEventListener('click', () => {
        const info_container = document.getElementById('info_container');
        if (info_container) {
            info_container.style.display = 'none';
        }
        resumeGame();        hideUI();
    });
}

hybrid_btn.addEventListener('click', () => {
    openHybridUI(selected_plot);
});

hybrid_cancel_btn.addEventListener('click', () => {
    closeHybridUI();
});

close_notepad_btn.addEventListener('click', () => {
    const notepad = document.getElementById('notepad');
    if (notepad) {
        notepad.style.display = 'none';
    }
    hideUI();
});

notepad_btn.addEventListener('click', () => {
    const notepad = document.getElementById('notepad');
    if (notepad) {
        notepad.style.display = 'flex';
    }
    hideUI();
});