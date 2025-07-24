const seed_btn = document.getElementById('seed_btn');
const water_btn = document.getElementById('water_btn');
const seed_close_btn = document.getElementById('seed_close_btn');
const seed_ui = document.getElementById('seed_ui');
const inventory_btn = document.getElementById('inventory_btn');
const inventory = document.getElementById('inventory');
const close_inventory_btn = document.getElementById('close_inventory_btn');
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
    orange: { id: "orange", name: "orange seed", img: "assets/seeds/orange_seed.png" },
    copper: { id: "copper", name: "copper seed", img: "assets/seeds/copper_seed.png" },
    white: { id: "white", name: "white seed", img: "assets/seeds/white_seed.png" },
    black: { id: "black", name: "black seed", img: "assets/seeds/black_seed.png" },

    red_rare: { id: "red+", name: "red seed+", img: "assets/seeds/red_seed+.png" },
    blue_rare: { id: "blue+", name: "blue seed+", img: "assets/seeds/blue_seed+.png" },
    green_rare: { id: "green+", name: "green seed+", img: "assets/seeds/green_seed+.png" },
    yellow_rare: { id: "yellow+", name: "yellow seed+", img: "assets/seeds/yellow_seed+.png" },
    brown_rare: { id: "brown+", name: "brown seed+", img: "assets/seeds/brown_seed+.png" },
    grey_rare: { id: "grey+", name: "grey seed+", img: "assets/seeds/grey_seed+.png" },
    purple_rare: { id: "purple+", name: "purple seed+", img: "assets/seeds/purple_seed+.png" },
    beige_rare: { id: "beige+", name: "beige seed+", img: "assets/seeds/beige_seed+.png" },
    orange_rare: { id: "orange+", name: "orange seed+", img: "assets/seeds/orange_seed+.png" },
    copper_rare: { id: "copper+", name: "copper seed+", img: "assets/seeds/copper_seed+.png" },
    white_rare: { id: "white+", name: "white seed+", img: "assets/seeds/white_seed+.png" },
    black_rare: { id: "black+", name: "black seed+", img: "assets/seeds/black_seed+.png" },
    }

let player_seeds = [
    { id: "red", amount: 0, is_rare: false },
    { id: "blue", amount: 0, is_rare: false },
    { id: "green", amount: 0, is_rare: false },
    { id: "yellow", amount: 0, is_rare: false },
    { id: "brown", amount: 0, is_rare: false },
    { id: "grey", amount: 0, is_rare: false },
    { id: "purple", amount: 0, is_rare: false },
    { id: "beige", amount: 0, is_rare: false },
    { id: "orange", amount: 0, is_rare: false },
    { id: "copper", amount: 0, is_rare: false },
    { id: "white", amount: 0, is_rare: false },
    { id: "black", amount: 0, is_rare: false },

    { id: "red_rare", amount: 0, is_rare: true },
    { id: "blue_rare", amount: 0, is_rare: true },
    { id: "green_rare", amount: 0, is_rare: true },
    { id: "yellow_rare", amount: 10, is_rare: true },
    { id: "brown_rare", amount: 10, is_rare: true },
    { id: "grey_rare", amount: 0, is_rare: true },
    { id: "purple_rare", amount: 0, is_rare: true },
    { id: "beige_rare", amount: 0, is_rare: true },
    { id: "orange_rare", amount: 0, is_rare: true },
    { id: "copper_rare", amount: 0, is_rare: true },
    { id: "white_rare", amount: 0, is_rare: true },
    { id: "black_rare", amount: 0, is_rare: true },
]

let player_flowers = [
    { id: "red", amount: 0 },
    { id: "blue", amount: 0 },
    { id: "green", amount: 0 },
    { id: "yellow", amount: 0 },
    { id: "brown", amount: 0 },
    { id: "grey", amount: 0 },
    { id: "purple", amount: 0 },
    { id: "beige", amount: 0 },
    { id: "orange", amount: 0 },
    { id: "copper", amount: 0 },
    { id: "white", amount: 0 },
    { id: "black", amount: 0 },
]

const flower_types = {
    red: { id: "red", name: "rose shards", img: "assets/flowers/red.gif", family: "basic", attracts: "tearripple" },
    purple: { id: "purple", name: "purple flower", img: "assets/flowers/purple.gif", family: "basic", attracts: "cloudwisp" },
    beige: { id: "beige", name: "beige flower", img: "assets/flowers/beige.gif", family: "basic", attracts: "sundroplet" },
    yellow: { id: "yellow", name: "sunboy bloom", img: "assets/flowers/yellow.gif", family: "basic", attracts: "lumendew" },
    brown: { id: "brown", name: "odd peony", img: "assets/flowers/brown.gif", family: "basic", attracts: "willowroot" },
    blue: { id: "blue", name: "azure fluid", img: "assets/flowers/blue.gif", family: "mystic", attracts: "opalember" },
    green: { id: "green", name: "fragments of the wind", img: "assets/flowers/green.gif", family: "mystic", attracts: "mosslight" },
    grey: { id: "grey", name: "ocean vapor", img: "assets/flowers/grey.gif", family: "ethereal", attracts: "glassmist" },
    orange: { id: "orange", name: "orange flower", img: "assets/flowers/orange.gif", family: "mystic", attracts: "?" },
    copper: { id: "copper", name: "copper flower", img: "assets/flowers/copper.gif", family: "mystic", attracts: "?" },
    white: { id: "white", name: "white flower", img: "assets/flowers/white.gif", family: "ethereal", attracts: "?" },
    black: { id: "black", name: "black flower", img: "assets/flowers/black.gif", family: "ethereal", attracts: "?" },

    red_rare: { id: "red+", name: "rose shards+", img: "assets/flowers/red.gif", family: "basic", attracts: "bloodtear" },
    purple_rare: { id: "purple+", name: "purple flower+", img: "assets/flowers/purple.gif", family: "basic", attracts: "cloudwisp" },
    beige_rare: { id: "beige+", name: "beige flower+", img: "assets/flowers/beige.gif", family: "basic", attracts: "sundroplet" },
    yellow_rare: { id: "yellow+", name: "sunboy bloom+", img: "assets/flowers/yellow.gif", family: "basic", attracts: "lumendew" },
    brown_rare: { id: "brown+", name: "odd peony+", img: "assets/flowers/brown.gif", family: "basic", attracts: "willowroot" },
    blue_rare: { id: "blue+", name: "azure fluid+", img: "assets/flowers/blue.gif", family: "mystic", attracts: "opalember" },
    green_rare: { id: "green+", name: "fragments of the wind+", img: "assets/flowers/green.gif", family: "mystic", attracts: "mosslight" },
    grey_rare: { id: "grey+", name: "ocean vapor+", img: "assets/flowers/grey.gif", family: "ethereal", attracts: "glassmist" },
    orange_rare: { id: "orange+", name: "orange flower+", img: "assets/flowers/orange.gif", family: "mystic", attracts: "watchling" },
    copper_rare: { id: "copper+", name: "copper flower+", img: "assets/flowers/copper.gif", family: "mystic", attracts: "shimmer" },
    white_rare: { id: "white+", name: "white flower+", img: "assets/flowers/white.gif", family: "ethereal", attracts: "lightvoid" },
    black_rare: { id: "black+", name: "black flower+", img: "assets/flowers/black.gif", family: "ethereal", attracts: "timeleaper" },
}

const hybrid_recipes = [
    { parents: ["brown_rare", "yellow_rare"], child: "beige_rare" },
    { parents: ["brown_rare", "brown_rare"], child: "purple_rare" },
    { parents: ["brown_rare", "purple_rare"], child: "copper_rare" },
    { parents: ["yellow_rare", "yellow_rare"], child: "red_rare" },
    { parents: ["purple_rare", "beige_rare"], child: "blue_rare" },
    { parents: ["beige_rare", "red_rare"], child: "green_rare" },
    { parents: ["purple_rare", "red_rare"], child: "grey_rare" },
    { parents: ["yellow_rare", "red_rare"], child: "orange_rare" },
    { parents: ["orange_rare", "green_rare"], child: "white_rare" },
    { parents: ["copper_rare", "blue_rare"], child: "black_rare" },
]

let hybrid_current_plot = null;
let hybrid_selected_seed = null;
let hybrid_recipe = null;

const discovered_seeds = {
    red: false,
    blue: false,
    green: false,
    yellow: true,
    brown: true,
    grey: false,
    purple: false,
    beige: false,
    orange: false,
    copper: false,
    white: false,
    black: false,

    red_rare: false,
    blue_rare: false,
    green_rare: false,
    yellow_rare: false,
    brown_rare: false,
    grey_rare: false,
    purple_rare: false,
    beige_rare: false,
    orange_rare: false,
    copper_rare: false,
    white_rare: false,
    black_rare: false,
}