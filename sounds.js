const music = document.getElementById('music');
const canvas = document.getElementById('canvas');

canvas.addEventListener('click', () => {
    music.play();
});

const dirt_btns = document.getElementsByClassName('dirt');
const item_hover = document.getElementById('item_hover');

Array.from(dirt_btns).forEach(dirt_btn => {
    dirt_btn.addEventListener('mouseover', () => {
        item_hover.currentTime = 0;
        item_hover.play();
    });

    dirt_btn.addEventListener('mouseout', () => {
        item_hover.pause();
    });
});

const click = document.getElementById('click');
const sound_click = document.getElementsByClassName('sound_click');
Array.from(sound_click).forEach(btn => {
    btn.addEventListener('click', () => {
        click.currentTime = 0;
        click.play();
    });
});

const ui_pop = document.getElementById('ui_pop');
const sound_ui_pop = document.getElementsByClassName('sound_ui_pop');
Array.from(sound_ui_pop).forEach(btn => {
    btn.addEventListener('click', () => {
        ui_pop.currentTime = 0;
        ui_pop.play();
    });
});

const soft_click = document.getElementById('soft_click');
const sound_soft_click = document.getElementsByClassName('sound_soft_click');
Array.from(sound_soft_click).forEach(btn => {
    btn.addEventListener('click', () => {
        soft_click.currentTime = 0;
        soft_click.play();
    });
});

const pop_hover = document.getElementById('pop_hover');
const sound_pop_hover = document.getElementsByClassName('sound_pop_hover');
Array.from(sound_pop_hover).forEach(btn => {
    btn.addEventListener('mouseover', () => {
        pop_hover.currentTime = 0;
        pop_hover.play();
    });
});
