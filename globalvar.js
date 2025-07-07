const seed_btn = document.getElementById('seed_btn');
const water_btn = document.getElementById('water_btn');
const seed_close_btn = document.getElementById('seed_close_btn');
const seed_ui = document.getElementById('seed_ui');
const background = document.getElementById('background');
const garden = document.getElementById('garden');
const info_btn = document.getElementById('info_btn');
const hybrid_btn = document.getElementById('hybrid_btn');
const cut_btn = document.getElementById('cut_btn');
const close_btn = document.getElementById('close_btn');
const interaction_btns = document.getElementById('interaction_btns');

const hybrid_ui = document.getElementById('hybrid_ui');
const hybrid_sidebar = document.getElementById('hybrid_sidebar');
const hybrid_sidebar_seeds = document.getElementById('hybrid_sidebar_seeds');

const hybrid_hint = document.getElementById('hybrid_hint');
const hybrid_old_seed = document.getElementById('hybrid_old_seed');
const hybrid_new_seed = document.getElementById('hybrid_new_seed');
const hybrid_add_btn = document.getElementById('hybrid_add_btn');
const hybrid_output = document.getElementById('hybrid_output');
const hybrid_possible_seed = document.getElementById('hybrid_possible_seed');
const hybrid_combine_btn = document.getElementById('hybrid_combine_btn');
const hybrid_cancel_btn = document.getElementById('hybrid_cancel_btn');

// dirt plots dataset
const dirt_plots = [
    { id: "dirt1", element: document.getElementById('dirt1'), has_sprout: false, sprout_stage: null },
    { id: "dirt2", element: document.getElementById('dirt2'), has_sprout: false, sprout_stage: null },
    { id: "dirt3", element: document.getElementById('dirt3'), has_sprout: false, sprout_stage: null },
    { id: "dirt4", element: document.getElementById('dirt4'), has_sprout: false, sprout_stage: null },
];

// sprout growth stages
const sprout_stages = [
    { stage: 0, name: "empty" },
    { stage: 1, name: "seedling", img: "assets/growth/1.png" },
    { stage: 2, name: "sprout", img: "assets/growth/2.gif" },
    { stage: 3, name: "sapling", img: "assets/growth/3.gif" },
    { stage: 4, name: "baby bud", img: "assets/growth/4.gif" }, 
    { stage: 5, name: "mature bud", img: "assets/growth/5.gif" }
];

const seed_types = {
    red: { id: "red", name: "red seed", img: "assets/seeds/red_seed.png" },
    blue: { id: "blue", name: "blue seed", img: "assets/seeds/blue_seed.png" },
    green: { id: "green", name: "green seed", img: "assets/seeds/green_seed.png" },
    yellow: { id: "yellow", name: "yellow seed", img: "assets/seeds/yellow_seed.png" },
    brown: { id: "brown", name: "brown seed", img: "assets/seeds/brown_seed.png" },
    grey: { id: "grey", name: "grey seed", img: "assets/seeds/grey_seed.png" },
    purple: { id: "purple", name: "purple seed", img: "assets/seeds/purple_seed.png" },
    beige: { id: "beige", name: "beige seed", img: "assets/seeds/beige_seed.png" },

    red_rare: { id: "red+", name: "red seed+", img: "assets/seeds/red_seed+.png" },
    blue_rare: { id: "blue+", name: "blue seed+", img: "assets/seeds/blue_seed+.png" },
    green_rare: { id: "green+", name: "green seed+", img: "assets/seeds/green_seed+.png" },
    yellow_rare: { id: "yellow+", name: "yellow seed+", img: "assets/seeds/yellow_seed+.png" },
    brown_rare: { id: "brown+", name: "brown seed+", img: "assets/seeds/brown_seed+.png" },
    grey_rare: { id: "grey+", name: "grey seed+", img: "assets/seeds/grey_seed+.png" },
    purple_rare: { id: "purple+", name: "purple seed+", img: "assets/seeds/purple_seed+.png" },
    beige_rare: { id: "beige+", name: "beige seed+", img: "assets/seeds/beige_seed+.png" },
    }

let player_seeds = [
    { id: "red", amount: 1, is_rare: false },
    { id: "blue", amount: 0, is_rare: false },
    { id: "green", amount: 0, is_rare: false },
    { id: "yellow", amount: 1, is_rare: false },
    { id: "brown", amount: 2, is_rare: false },
    { id: "grey", amount: 0, is_rare: false },
    { id: "purple", amount: 0, is_rare: false },
    { id: "beige", amount: 0, is_rare: false },

    { id: "red_rare", amount: 1, is_rare: true },
    { id: "blue_rare", amount: 1, is_rare: true },
    { id: "green_rare", amount: 2, is_rare: true },
    { id: "yellow_rare", amount: 1, is_rare: true },
    { id: "brown_rare", amount: 0, is_rare: true },
    { id: "grey_rare", amount: 0, is_rare: true },
    { id: "purple_rare", amount: 0, is_rare: true },
    { id: "beige_rare", amount: 1, is_rare: true },
]

const flower_types = {
    red: { id: "red", name: "rose shards", img: "assets/flowers/red.gif", ethereal: false },
    blue: { id: "blue", name: "azure fluid", img: "assets/flowers/blue.gif", ethereal: false },
    green: { id: "green", name: "fragments of the wind", img: "assets/flowers/green.gif", ethereal: false },
    yellow: { id: "yellow", name: "sunboy bloom", img: "assets/flowers/yellow.gif", ethereal: false },
    brown: { id: "brown", name: "odd peony", img: "assets/flowers/brown.gif", ethereal: false },
    grey: { id: "grey", name: "ocean vapor", img: "assets/flowers/grey.gif", ethereal: true },
    purple: { id: "purple", name: "purple flower", img: "assets/flowers/purple.gif", ethereal: false },
    beige: { id: "beige", name: "beige flower", img: "assets/flowers/beige.gif", ethereal: false },

    red_rare: { id: "red+", name: "rose shards+", img: "assets/flowers/red.gif", ethereal: false },
    blue_rare: { id: "blue+", name: "azure fluid+", img: "assets/flowers/blue.gif", ethereal: false },
    green_rare: { id: "green+", name: "fragments of the wind+", img: "assets/flowers/green.gif", ethereal: false },
    yellow_rare: { id: "yellow+", name: "sunboy bloom+", img: "assets/flowers/yellow.gif", ethereal: false },
    brown_rare: { id: "brown+", name: "odd peony+", img: "assets/flowers/brown.gif", ethereal: false },
    grey_rare: { id: "grey+", name: "ocean vapor+", img: "assets/flowers/grey.gif", ethereal: true },
    purple_rare: { id: "purple+", name: "purple flower+", img: "assets/flowers/purple.gif", ethereal: false },
    beige_rare: { id: "beige+", name: "beige flower+", img: "assets/flowers/beige.gif", ethereal: false },
}

const hybrid_recipes = [
    { parents: ["brown_rare", "yellow_rare"], child: "beige_rare" },
    { parents: ["brown_rare", "brown_rare"], child: "purple_rare" },
    { parents: ["yellow_rare", "yellow_rare"], child: "red_rare" },
    { parents: ["purple_rare", "beige_rare"], child: "blue_rare" },
    { parents: ["beige_rare", "red_rare"], child: "green_rare" },
    { parents: ["purple_rare", "red_rare"], child: "grey_rare" }
]

let hybrid_current_plot = null;
let hybrid_selected_seed = null;
let hybrid_recipe = null;

const discovered_seeds = {
    red: false,
    blue: false,
    green: false,
    yellow: false,
    brown: false,
    grey: false,
    purple: false,
    beige: false,
}