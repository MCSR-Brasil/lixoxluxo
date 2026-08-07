// =====================================================
// Buff & Debuff definitions from cards.js
// Each entry has:
//   id, name, type ("buff" or "debuff")
//   commands: array of MC 1.16.1 commands
//             {SELECTOR}  = target selector placeholder
//             {COORDS}    = coordinate placeholder for command block placement
//             {SH1}       = stronghold 1 portal room coords (overworld)
//             {SH2}       = stronghold 2 portal room coords (overworld)
//             {SH3}       = stronghold 3 portal room coords (overworld)
//             {FORTRESS}  = nether fortress coords
//             {BASTION}   = bastion remnant coords
// Commands that should run once can be plain commands.
// Commands that should repeat should already be setblock commands using {COORDS}.
// =====================================================

// =====================================================
// Seed data — fill in coords for each seed
// Loaded from localStorage, falls back to defaults.
// =====================================================
const DEFAULT_SEEDS = [
    {
        id: 'test',
        name: 'Example',
        overworld_seed: '207248864720615269',
        nether_seed: '88126458369131',
        end_seed: '207248864720615269',
        rng_seed: '207248864720615269',
        sh1: '-42 32 1635',
        sh2: '-1808 36 -1123',
        sh3: '1784 26 -926',
        fortress: '-205 63 177',
        bastion: '-130 68 -73',
        nether_spawn: '19 76 24',
        second_overworld: '73 75 -164'
    }
];

const DEFAULT_SEED_FIELDS = {
    overworld_seed: '',
    nether_seed: '',
    end_seed: '',
    rng_seed: '',
    sh1: '',
    sh2: '',
    sh3: '',
    fortress: '-205 63 177',
    bastion: '',
    nether_spawn: '19 76 24',
    second_overworld: '73 75 -164'
};

function loadSeeds() {
    const raw = localStorage.getItem('mcsr_generator_seeds');
    if (!raw) return DEFAULT_SEEDS.map(s => ({ ...DEFAULT_SEED_FIELDS, ...s }));
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
            return parsed.map(s => ({ ...DEFAULT_SEED_FIELDS, ...s }));
        }
        return DEFAULT_SEEDS.map(s => ({ ...DEFAULT_SEED_FIELDS, ...s }));
    } catch (e) {
        return DEFAULT_SEEDS.map(s => ({ ...DEFAULT_SEED_FIELDS, ...s }));
    }
}

let SEEDS = loadSeeds();

function saveSeeds() {
    localStorage.setItem('mcsr_generator_seeds', JSON.stringify(SEEDS));
}

function makeSeedId(name) {
    const base = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    let id = base || 'seed';
    let counter = 1;
    while (SEEDS.some(s => s.id === id)) {
        id = `${base}_${counter++}`;
    }
    return id;
}

function addSeed() {
    const name = document.getElementById("seed-name").value.trim();
    const overworld_seed = document.getElementById("seed-overworld-seed").value.trim();
    const nether_seed = document.getElementById("seed-nether-seed").value.trim();
    const end_seed = document.getElementById("seed-end-seed").value.trim();
    const rng_seed = document.getElementById("seed-rng-seed").value.trim();
    const sh1 = document.getElementById("seed-sh1").value.trim();
    const sh2 = document.getElementById("seed-sh2").value.trim();
    const sh3 = document.getElementById("seed-sh3").value.trim();
    const fortress = document.getElementById("seed-fortress").value.trim();
    const bastion = document.getElementById("seed-bastion").value.trim();
    const nether_spawn = document.getElementById("seed-nether-spawn").value.trim();
    const second_overworld = document.getElementById("seed-second-overworld").value.trim();

    if (!name || !sh1 || !sh2 || !sh3 || !fortress || !bastion) {
        alert("Fill the required seed fields (name, sh1, sh2, sh3, fortress, bastion).");
        return;
    }

    SEEDS.push({
        id: makeSeedId(name),
        name,
        overworld_seed,
        nether_seed,
        end_seed,
        rng_seed,
        sh1,
        sh2,
        sh3,
        fortress,
        bastion,
        nether_spawn,
        second_overworld
    });

    saveSeeds();
    renderSeeds();
    renderSeedList();
    clearSeedForm();
}

function deleteSeed(id) {
    SEEDS = SEEDS.filter(s => s.id !== id);
    saveSeeds();
    renderSeeds();
    renderSeedList();
}

function clearSeedForm() {
    document.getElementById("seed-name").value = "";
    document.getElementById("seed-overworld-seed").value = "";
    document.getElementById("seed-nether-seed").value = "";
    document.getElementById("seed-end-seed").value = "";
    document.getElementById("seed-rng-seed").value = "";
    document.getElementById("seed-sh1").value = "";
    document.getElementById("seed-sh2").value = "";
    document.getElementById("seed-sh3").value = "";
    document.getElementById("seed-fortress").value = "";
    document.getElementById("seed-bastion").value = "";
    document.getElementById("seed-nether-spawn").value = "";
    document.getElementById("seed-second-overworld").value = "";
}

function renderSeedList() {
    const list = document.getElementById("seed-list");
    if (!list) return;
    list.innerHTML = "";
    SEEDS.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${s.name}</span><button onclick="deleteSeed('${s.id}')">x</button>`;
        list.appendChild(li);
    });
}

const AURA_MOBS = [
    "creeper",
    "skeleton",
    "zombie",
    "spider",
    "cave_spider",
    "ghast",
    "blaze",
    "wither_skeleton",
    "witch",
    "enderman",
    "phantom",
    "drowned",
    "husk",
    "stray",
    "magma_cube",
    "slime",
    "shulker",
    "endermite",
    "silverfish",
    "vex",
    "vindicator",
    "pillager",
    "ravager",
    "guardian",
    "elder_guardian",
    "cow",
    "pig",
    "chicken",
    "sheep",
    "rabbit",
    "horse",
    "donkey",
    "mule",
    "llama",
    "panda",
    "bee",
    "fox",
    "cat",
    "ocelot",
    "wolf",
    "mooshroom",
    "squid",
    "dolphin",
    "cod",
    "salmon",
    "tropical_fish",
    "pufferfish",
    "turtle",
    "strider",
    "iron_golem",
    "snow_golem",
    "polar_bear",
    "parrot",
    "bat",
    "hoglin",
    "zoglin",
    "zombified_piglin"
];

const BUFFS = [
    {
        id: 'golden_armor',
        name: 'Armadura de Ouro',
        commands: [
            "replaceitem entity {SELECTOR} armor.head minecraft:golden_helmet 1",
            "replaceitem entity {SELECTOR} armor.chest minecraft:golden_chestplate 1",
            "replaceitem entity {SELECTOR} armor.legs minecraft:golden_leggings 1",
            "replaceitem entity {SELECTOR} armor.feet minecraft:golden_boots 1"
        ]
    },
    {
        id: 'fire_res',
        name: 'Imune ao Fogo',
        commands: [
            "gamerule fireDamage false"
        ]
    },
    {
        id: 'no_fall',
        name: 'Peso Pena',
        commands: [
            "gamerule fallDamage false"
        ]
    },
    {
        id: 'bonus_chest',
        name: 'Bonus Chest OP',
        description: "Cria um bau na frente do jogador com 7 rolagens de loot da end city treasure (itens raros).",
        commands: [
            "execute as {SELECTOR} at @s run setblock ~ ~ ~ minecraft:chest",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure",
            "execute as {SELECTOR} at @s run loot insert ~ ~ ~ loot minecraft:chests/end_city_treasure"
        ]
    },
    {
        id: 'keep_inventory',
        name: 'Cafe Com Leite',
        description: "Ativa keepInventory: o jogador nao perde os itens do inventario ao morrer.",
        commands: [
            "gamerule keepInventory true"
        ]
    },
    {
        id: 'ender_arrows',
        name: 'Ender Flechas',
        description: "Da um arco e flechas especiais que teleportam quem acertar, como uma perola do ender. Cuidado ao usar por acidente.",
        commands: [
            "scoreboard objectives add tpBowUsed minecraft.used:minecraft.bow",
            "scoreboard objectives add tpBowUsedPrev dummy",
            "scoreboard objectives add tpUUID0 dummy",
            "scoreboard objectives add tpArrowOwner0 dummy",
            "scoreboard players set @a tpBowUsedPrev 0",
            "give {SELECTOR} bow{Unbreakable:1b}",
            "give {SELECTOR} tipped_arrow{Potion:\"minecraft:luck\",CustomPotionColor:3381504,display:{Name:'{\"text\":\"Ender Arrow\",\"color\":\"green\",\"italic\":false}'}} 100",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{Command:\"execute as @a store result score @s tpUUID0 run data get entity @s UUID[0] 1\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @a if score @s tpBowUsed > @s tpBowUsedPrev run tag @s add tpBowShot\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @a run scoreboard players operation @s tpBowUsedPrev = @s tpBowUsed\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @a[tag=tpBowShot] at @s run scoreboard players operation @e[type=arrow,tag=!tpLinked,nbt={Color:3381504},sort=nearest,limit=1,distance=..6] tpArrowOwner0 = @s tpUUID0\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @a[tag=tpBowShot] at @s run tag @e[type=arrow,tag=!tpLinked,nbt={Color:3381504},sort=nearest,limit=1,distance=..6] add tpLinked\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @a[tag=tpBowShot] run tag @s remove tpBowShot\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @e[type=arrow,tag=tpLinked,tag=!tpDone,nbt={inGround:1b,Color:3381504}] at @s run execute as @a if score @s tpUUID0 = @e[type=arrow,tag=tpLinked,tag=!tpDone,nbt={Color:3381504},distance=..0,limit=1] tpArrowOwner0 run effect give @s resistance 1 255 true\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @e[type=arrow,tag=tpLinked,tag=!tpDone,nbt={inGround:1b,Color:3381504}] at @s run execute as @a if score @s tpUUID0 = @e[type=arrow,tag=tpLinked,tag=!tpDone,nbt={Color:3381504},distance=..0,limit=1] tpArrowOwner0 run tp @s ~ ~1 ~\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @e[type=arrow,tag=tpLinked,tag=!tpDone,nbt={inGround:1b,Color:3381504}] at @a run playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 10 1\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"execute as @e[type=arrow,tag=tpLinked,tag=!tpDone,nbt={inGround:1b,Color:3381504}] run tag @s add tpDone\",auto:1b} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{Command:\"kill @e[type=arrow,tag=tpDone,nbt={Color:3381504}]\",auto:1b} replace",
            "tellraw @a [\"\",{\"text\":\"Ender Arrows\",\"bold\":true,\"color\":\"aqua\"},{\"text\":\"\\nFlechas Ender Funcionam que nem perolas, mas cuidado pra nao usar sem querer!\",\"color\":\"green\"}]"
        ]
    },
    {
        id: 'icarus',
        name: 'Icarus',
        commands: [
            "replaceitem entity {SELECTOR} armor.chest minecraft:elytra",
            "give {SELECTOR} minecraft:firework_rocket 128"
        ]
    },
    {
        id: 'notch_apple',
        name: 'Dieta Equilibrada',
        description: "Da 2 mas encantadas (notch apples) para o jogador.",
        commands: [
            "give {SELECTOR} minecraft:enchanted_golden_apple 2"
        ]
    },
    {
        id: 'call_a_friend',
        name: 'Corrida dos Bobos',
        description: "Regra apenas para o host/narrador: nao gera comandos, serve como lembrete de regra do torneio (ex: chamar um amigo para ajudar).",
        commands: [
            // Meta rule — no command needed
        ]
    },
    {
        id: 'disarmed_piglins',
        name: 'Piglins Amigos',
        description: "Tira a arma dos piglins e zombified piglins, colocando uma rosa na mao principal. Preserva ouro que estiverem segurando.",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as @e[type=minecraft:piglin] at @s unless data entity @s HandItems[0] {id:'minecraft:gold_ingot'} run data modify entity @s HandItems[0] set value {id:'minecraft:poppy',Count:1b}\"} replace"
        ]
    },
    {
        id: 'double_health',
        name: '28% Gato',
        description: "Aumenta a vida maxima para 40 coracoes (dobro)",
        commands: [
            "gamerule doImmediateRespawn false",
            "scoreboard objectives add testdeath deathCount",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run attribute @s minecraft:generic.max_health base set 40\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={testdeath=1..}] run effect give @s minecraft:instant_health 1 10 true\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players reset {SELECTOR}[scores={testdeath=1..}] testdeath\"} replace"
        ]
    },
    {
        id: 'no_crystals',
        name: 'Sem Cristais',
        commands: [
            "execute in minecraft:the_end run forceload add 32 32 -32 -32",
            "execute in minecraft:the_end run kill @e[type=minecraft:end_crystal]"
        ]
    },
    {
        id: 'win_on_enter',
        name: 'Entrou, Ganhou',
        description: "Para o timer do SpeedRunIGT assim que algum jogador ganhar a conquista de entrar no End.",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as @a[advancements={minecraft:story/enter_the_end=true}] run speedrunigt stop\"} replace"
        ]
    },
    {
        id: 'structure_compass',
        name: 'Bussolas',
        description: "Da duas bussolas de lodestone apontando para o bastion e a fortress definidos na seed.",
        commands: [
            "give {SELECTOR} minecraft:compass{LodestoneDimension:\"minecraft:the_nether\",LodestonePos:{X:{BASTION_X},Y:{BASTION_Y},Z:{BASTION_Z}},LodestoneTracked:0b,display:{Name:'{\"text\":\"Bastion Compass\"}'}} 1",
            "give {SELECTOR} minecraft:compass{LodestoneDimension:\"minecraft:the_nether\",LodestonePos:{X:{FORTRESS_X},Y:{FORTRESS_Y},Z:{FORTRESS_Z}},LodestoneTracked:0b,display:{Name:'{\"text\":\"Fortress Compass\"}'}} 1"
        ]
    },
    {
        id: 'god_tool',
        name: 'Martelo Lendario',
        description: "Da uma picareta de netherite com encantamentos no maximo e looting.",
        commands: [
            "give {SELECTOR} netherite_pickaxe{Enchantments:[{id:'minecraft:efficiency',lvl:10s},{id:'minecraft:unbreaking',lvl:10s},{id:'minecraft:fortune',lvl:10s},{id:'minecraft:sharpness',lvl:255s},{id:'minecraft:looting',lvl:3s}]} 1"
        ]
    },
    {
        id: 'aura',
        name: 'Aura',
        description: "Mobs nao vao mais atras de voce, congelados pela sua aura, mas se chegar bem perto, ainda batem",
        commands: AURA_MOBS.map((mob, i) =>
            `setblock {COORDS} minecraft:${i === 0 ? 'repeating_command_block' : 'chain_command_block'}[facing=up]{auto:1b,Command:"execute as {SELECTOR} at @s run execute as @e[type=minecraft:${mob},distance=..30] run attribute @s minecraft:generic.follow_range base set 1"} replace`
        )
    },
    {
        id: 'buffet',
        name: 'Comida Infinita',
        description: "Mantem a barra de saturacao sempre cheia, entao o jogador nunca fica com fome.",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"effect give {SELECTOR} minecraft:saturation 9 0 true\"} replace"
        ]
    },
    {
        id: 'portal_radar',
        name: 'Raio X de Stronghold',
        description: "Cria slimes invisiveis e brilhando exatamente nas coordenadas das 3 strongholds da seed, funcionando como marcadores visiveis atraves de paredes (glowing).",
        commands: [
            "forceload add {SH1_X} {SH1_Z}",
            "forceload add {SH2_X} {SH2_Z}",
            "forceload add {SH3_X} {SH3_Z}",
            "execute unless entity @e[type=minecraft:slime,tag=marker_slime,limit=1] run summon minecraft:slime {SH1} {Tags:[\"marker_slime\"],Size:1,NoAI:1b,NoGravity:1b,Glowing:1b,Silent:1b,Invulnerable:1b,PersistenceRequired:1b,ActiveEffects:[{Id:14b,Amplifier:0b,Duration:2147483647,ShowParticles:0b},{Id:24b,Amplifier:0b,Duration:2147483647,ShowParticles:0b}]}",
            "execute unless entity @e[type=minecraft:slime,tag=marker_slime2,limit=1] run summon minecraft:slime {SH2} {Tags:[\"marker_slime2\"],Size:1,NoAI:1b,NoGravity:1b,Glowing:1b,Silent:1b,Invulnerable:1b,PersistenceRequired:1b,ActiveEffects:[{Id:14b,Amplifier:0b,Duration:2147483647,ShowParticles:0b},{Id:24b,Amplifier:0b,Duration:2147483647,ShowParticles:0b}]}",
            "execute unless entity @e[type=minecraft:slime,tag=marker_slime3,limit=1] run summon minecraft:slime {SH3} {Tags:[\"marker_slime3\"],Size:1,NoAI:1b,NoGravity:1b,Glowing:1b,Silent:1b,Invulnerable:1b,PersistenceRequired:1b,ActiveEffects:[{Id:14b,Amplifier:0b,Duration:2147483647,ShowParticles:0b},{Id:24b,Amplifier:0b,Duration:2147483647,ShowParticles:0b}]}"
        ]   
    },
    {
        id: 'dejavu',
        name: 'Deja Vu',
        description: "Ao morrer, o jogador renasce no ultimo ponto onde deu um split (como se fosse um checkpoint) e mantem o inventario. Modo beginner da ranked",
        commands: [
            "gamerule respawnAtSplit true",
            "gamerule keepInventory true"
        ]
    },
    {
        id: 'coquetel',
        name: 'Coquetel',
        description: "3 pocoes foda",
        commands: [
            "give {SELECTOR} minecraft:splash_potion{Potion:\"minecraft:empty\",CustomPotionEffects:[{Id:5,Amplifier:9,Duration:1800},{Id:11,Amplifier:9,Duration:1800}],CustomPotionColor:11534336,display:{Name:'{\"text\":\"Coquetel de Combate\",\"color\":\"red\",\"italic\":false}',Lore:['[{\"text\":\"Forca X + Resistencia X\",\"color\":\"gray\",\"italic\":false}]']}} 1",
            "give {SELECTOR} minecraft:splash_potion{Potion:\"minecraft:empty\",CustomPotionEffects:[{Id:1,Amplifier:1,Duration:1800},{Id:8,Amplifier:1,Duration:1800}],CustomPotionColor:8900331,display:{Name:'{\"text\":\"Coquetel de Movimento\",\"color\":\"aqua\",\"italic\":false}',Lore:['[{\"text\":\"Velocidade II + Impulso II\",\"color\":\"gray\",\"italic\":false}]']}} 1",
            "give {SELECTOR} minecraft:splash_potion{Potion:\"minecraft:empty\",CustomPotionEffects:[{Id:10,Amplifier:9,Duration:1800},{Id:21,Amplifier:9,Duration:1800}],CustomPotionColor:16711867,display:{Name:'{\"text\":\"Coquetel de Sustento\",\"color\":\"green\",\"italic\":false}',Lore:['[{\"text\":\"Regeneracao X + Saude X\",\"color\":\"gray\",\"italic\":false}]']}} 1"
        ]
    }
];

const DEBUFFS = [
    {
        id: 'no_regen',
        name: 'Sem Regeneracao',
        commands: [
            "gamerule naturalRegeneration false"
        ]
    },
    {
        id: 'half_hearts',
        name: 'Metade da Vida',
        commands: [
            "gamerule doImmediateRespawn false",
            "scoreboard objectives add testdeath deathCount",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run attribute @s minecraft:generic.max_health base set 12\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={testdeath=1..}] run effect give @s minecraft:instant_health 1 10 true\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players reset {SELECTOR}[scores={testdeath=1..}] testdeath\"} replace"
        ]
    },
    {
        id: 'less_slots',
        name: 'Jeans Feminina',
        description: "Bloqueia boa parte do inventario.",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.9 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.10 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.11 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.12 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.13 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.14 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.15 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.16 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.17 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.18 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.19 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.20 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.21 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.22 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.23 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.24 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.25 minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} container.26 minecraft:knowledge_book 1\"} replace"
        ]
    },
    {
        id: 'no_armor_slots',
        name: 'Sem Armadura',
        description: "Bloqueia os 4 slots de armadura.",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.head minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.chest minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.legs minecraft:knowledge_book 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.feet minecraft:knowledge_book 1\"} replace"
        ]
    },
    {
        id: 'no_loot',
        name: 'Loot RSG',
        description: "Desativa as loot tables modificadas do MCSR Ranked, deixando o loot de baus/mobs igual ao vanilla (horrive).",
        commands: [
            "gamerule modifiedLootTables false"
        ]
    },
    {
        id: 'random_effects',
        name: 'Efeitos Aleatorios',
        description: "A cada 15 segundos um efeito aleatorio (bom ou ruim) e aplicado, com contagem regressiva na actionbar e sons de aviso.",
        commands: [
            "scoreboard objectives add effectTimer dummy",
            "scoreboard objectives add effectRemain dummy",
            "scoreboard objectives add random dummy",
            "scoreboard objectives add range dummy",
            "scoreboard objectives add effectID dummy",
            "scoreboard players set {SELECTOR} effectTimer 0",
            "scoreboard players set {SELECTOR} effectRemain 300",
            "scoreboard players set {SELECTOR} range 25",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run scoreboard players add @s effectTimer 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run scoreboard players set @s effectRemain 300\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run scoreboard players operation @s effectRemain -= @s effectTimer\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run execute as @s if score @s effectRemain matches ..-1 run scoreboard players set @s effectRemain 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run title @s actionbar {\\\"text\\\":\\\"Next Effect in: \\\",\\\"extra\\\":[{\\\"score\\\":{\\\"name\\\":\\\"@s\\\",\\\"objective\\\":\\\"effectRemain\\\"}}]}\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=270}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=280}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 0.5\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=290}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=299}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 2\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..}] at @s run summon area_effect_cloud ~ ~ ~ {Tags:['random_uuid']}\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..}] store result score @s random run data get entity @e[type=area_effect_cloud,tag=random_uuid,limit=1] UUID[0] 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..}] run scoreboard players operation @s random %= @s range\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..}] at @s run kill @e[type=area_effect_cloud,tag=random_uuid,distance=..5]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..}] run scoreboard players operation @s effectID = @s random\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=0}] at @s run effect give @s speed 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=1}] at @s run effect give @s jump_boost 12 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=2}] at @s run effect give @s regeneration 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=3}] at @s run effect give @s strength 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=4}] at @s run effect give @s slowness 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=5}] at @s run effect give @s blindness 12 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=6}] at @s run effect give @s haste 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=7}] at @s run effect give @e levitation 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=8}] at @s run effect give @s mining_fatigue 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=9}] at @s run effect give @s dolphins_grace 150 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=10}] at @s run effect give @s slow_falling 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=11}] at @s run effect give @s poison 10 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=12}] at @s run effect give @s weakness 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=13}] at @s run effect give @s wither 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=14}] at @s run effect give @e invisibility 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=15}] at @s run effect give @s slow_falling 10 2\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=16}] at @s run effect give @s fire_resistance 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=17}] at @s run effect give @e minecraft:glowing 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=18}] at @s run effect give @s minecraft:absorption 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=19}] at @s run effect give @e levitation 10 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=20}] at @s run effect give @s speed 10 5\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=21}] at @s run effect give @s jump_boost 10 5\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=22}] at @s run effect give @s haste 10 5\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=23}] at @s run attribute @s minecraft:generic.max_health base set 40\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=24}] at @s run effect give @s slow_falling 10 10\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..,effectID=25}] at @s run effect give @s strength 10 10\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={effectTimer=300..}] run scoreboard players set @s effectTimer 0\"} replace",
            "scoreboard players set {SELECTOR} range 20",
            "tellraw @a [\"\",{\"text\":\"MCSR Rankeada mas...\",\"bold\":true,\"color\":\"green\"},{\"text\":\"\\n\"},{\"text\":\"Um efeito aleatorio e aplicado a cada 15 segundos\",\"color\":\"aqua\"}]"
        ]
    },
    {
        id: 'thirst',
        name: 'Sede',
        description: "Adiciona uma barra de sede que desce com o tempo. Beber pocao, leite ou mel recupera. Com sede zerada, o jogador fica envenenado.",
        commands: [
            "scoreboard objectives add thirst dummy",
            "scoreboard objectives add thirstTimer dummy",
            "scoreboard objectives add usedPotion minecraft.used:minecraft.potion",
            "scoreboard objectives add usedMilk minecraft.used:minecraft.milk_bucket",
            "scoreboard objectives add usedHoney minecraft.used:minecraft.honey_bottle",
            "scoreboard objectives add deaths deathCount",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} unless score @s thirst matches 0..9 run scoreboard players set @s thirst 9\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} unless score @s thirstTimer matches -500..500 run scoreboard players set @s thirstTimer -500\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={deaths=1..}] run scoreboard players set @s thirst 9\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={deaths=1..}] run scoreboard players set @s thirstTimer -500\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players set {SELECTOR}[scores={deaths=1..}] deaths 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players add {SELECTOR} thirstTimer 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={thirstTimer=460..,thirst=1..}] unless entity @s[nbt={Dimension:-1}] run scoreboard players remove @s thirst 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={thirstTimer=380..,thirst=1..}] if entity @s[nbt={Dimension:-1}] run scoreboard players remove @s thirst 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={thirstTimer=460..}] unless entity @s[nbt={Dimension:-1}] run scoreboard players set @s thirstTimer 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={thirstTimer=380..}] if entity @s[nbt={Dimension:-1}] run scoreboard players set @s thirstTimer 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={usedPotion=1..}] run scoreboard players add @s thirst 3\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players set {SELECTOR}[scores={usedPotion=1..}] usedPotion 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={usedMilk=1..}] run scoreboard players add @s thirst 4\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players set {SELECTOR}[scores={usedMilk=1..}] usedMilk 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={usedHoney=1..}] run scoreboard players add @s thirst 2\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"scoreboard players set {SELECTOR}[scores={usedHoney=1..}] usedHoney 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={thirst=10..}] run scoreboard players set @s thirst 9\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={thirst=0}] run effect give @s minecraft:poison 5 0 true\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=9}] actionbar [{\\\"text\\\":\\\"                    ■■■■■■■■■\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=8}] actionbar [{\\\"text\\\":\\\"                    ■■■■■■■■□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=7}] actionbar [{\\\"text\\\":\\\"                    ■■■■■■■□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=6}] actionbar [{\\\"text\\\":\\\"                    ■■■■■■□□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=5}] actionbar [{\\\"text\\\":\\\"                    ■■■■■□□□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=4}] actionbar [{\\\"text\\\":\\\"                    ■■■■□□□□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=3}] actionbar [{\\\"text\\\":\\\"                    ■■■□□□□□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=2}] actionbar [{\\\"text\\\":\\\"                    ■■□□□□□□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=1}] actionbar [{\\\"text\\\":\\\"                    ■□□□□□□□□\\\",\\\"color\\\":\\\"aqua\\\"}]\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"title {SELECTOR}[scores={thirst=0}] actionbar [{\\\"text\\\":\\\"                    □□□□□□□□□\\\",\\\"color\\\":\\\"gray\\\"}]\"} replace"
        ]
    },
    {
        id: 'fast_hunger',
        name: 'Fome Acelerada',
        description: "Aplica Hunger constantemente.",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"effect give {SELECTOR} minecraft:hunger 5 1 true\"} replace"
        ]
    },
    {
        id: 'thorns_mobs',
        name: 'Espinhos nos Mobs',
        description: "Sempre que o jogador acerta um mob, ele recebe dano de volta, como se todos os mobs tivessem o encantamento Throns.",
        commands: [
            "scoreboard objectives add test minecraft.custom:minecraft.damage_dealt",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as @a[scores={test=1..}] run effect give @s minecraft:instant_damage 1 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as @a[scores={test=1..}] run effect give @s minecraft:instant_health 1 0\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as @a[scores={test=1..}] run scoreboard players set @s test 0\"} replace"
        ]
    },
    {
        id: 'angry_piglins',
        name: 'Piglins Raivosos',
        description: "Faz todos os piglins e zombified piglins ficarem permanentemente com raiva do jogador, mesmo com armadura.",
        commands: [
           "execute at {SELECTOR} run setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as @e[type=minecraft:zombified_piglin] run data modify entity @s AngryAt set from entity @p UUID\"} replace",
           "execute at {SELECTOR} run setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as @e[type=minecraft:piglin] run data modify entity @s Brain.memories.'minecraft:angry_at'.value set from entity @p UUID\"} replace"
        ]
    },
    {
        id: 'crossed_eyes',
        name: 'Olho Vesgo',
        description: "Desvia levemente a trajetoria de todos os olhos do ender lancados, fica dificil pegar o angulo, mas ainda da",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as @e[type=minecraft:eye_of_ender] at @s run teleport @s ~0.10 ~0.02 ~\"} replace"
        ]
    },
    {
        id: 'knockback',
        name: 'Peso Pena (Knockback)',
        description: "Jogador leva knockback insano de todos os mobs",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute at @a as @e[distance=..30] run attribute @s minecraft:generic.attack_knockback base set 100\"} replace"
        ]
    },

    {
        id: 'no_pearl',
        name: 'Maratona',
        description: "Toda perola jogada vai ser deletada isntantaneamente",
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} at @s run kill @e[type=minecraft:ender_pearl,distance=..64]\"} replace"
        ]
    },
    {
        id: 'no_overworld',
        name: 'Overworld Skip',
        description: "Teleporta o jogador diretamente para as coordenadas de spawn do Nether definidas na seed.",
        commands: [
            "execute in minecraft:the_nether run tp {SELECTOR} {NETHER_SPAWN}"
        ]
    },
    {
        id: 'structureless',
        name: 'Structureless',
        description: "Teleporta o jogador para a segunda coordenada de spawn do Overworld definida na seed.",
        commands: [
            "execute in minecraft:overworld run tp {SELECTOR} {SECOND_OVERWORLD}"
        ]
    },
    {
        id: 'tnt_15s',
        name: 'TNT 15s',
        commands: [
            "scoreboard objectives add tntTimer dummy",
            "scoreboard objectives add tntRemain dummy",
            "scoreboard players set {SELECTOR} tntTimer 0",
            "scoreboard players set {SELECTOR} tntRemain 300",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run scoreboard players add @s tntTimer 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run scoreboard players set @s tntRemain 300\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run scoreboard players operation @s tntRemain -= @s tntTimer\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run title @s actionbar {\\\"text\\\":\\\"Next TNT in: \\\",\\\"extra\\\":[{\\\"score\\\":{\\\"name\\\":\\\"@s\\\",\\\"objective\\\":\\\"tntRemain\\\"}}]}\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=250}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=260}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 0.5\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=270}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=280}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 0.5\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=290}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 1\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=300}] at @s run playsound minecraft:block.note_block.xylophone master @s ~ ~ ~ 1 2\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=300..}] at @s run summon minecraft:tnt ~ ~ ~ {Fuse:80}\"} replace",
            "setblock {COORDS} minecraft:chain_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR}[scores={tntTimer=300..}] run scoreboard players set @s tntTimer 0\"} replace",
            "tellraw @a [\"\",{\"text\":\"MCSR Rankeada mas...\",\"bold\":true,\"color\":\"green\"},{\"text\":\"\\n\"},{\"text\":\"Uma TNT Spawna a cada 15 segundos\",\"color\":\"red\"}]"
        ]
    },
];

// =====================================================
// UI Rendering
// =====================================================

function renderSeeds() {
    const select = document.getElementById("seed-select");
    const previousValue = select.value;
    select.innerHTML = "";
    SEEDS.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name;
        select.appendChild(opt);
    });
    if (previousValue && SEEDS.some(s => s.id === previousValue)) {
        select.value = previousValue;
    } else if (SEEDS.length) {
        select.value = SEEDS[0].id;
    }
    updateSeedInfoSidebar();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderTemplates() {
    const buffList = document.getElementById("buff-list");
    const debuffList = document.getElementById("debuff-list");

    [BUFFS, DEBUFFS].forEach(list => {
        const targetList = list === BUFFS ? buffList : debuffList;
        list.forEach(t => {
            const div = document.createElement("div");
            div.className = "template-item";
            const info = t.description
                ? `<span class="info-icon">i<span class="tooltip">${escapeHtml(t.description)}</span></span>`
                : "";
            div.innerHTML = `
                <input type="checkbox" id="tmpl-${t.id}">
                <label for="tmpl-${t.id}">${escapeHtml(t.name)}</label>
                ${info}
            `;
            targetList.appendChild(div);
        });
    });
}

function updateSeedInfoSidebar() {
    const select = document.getElementById("seed-select");
    const seed = select ? SEEDS.find(s => s.id === select.value) : null;

    const fields = [
        { id: "seed-info-name", value: seed ? seed.name : "No seed selected" },
        { id: "seed-info-overworld-seed", value: seed ? seed.overworld_seed : "-" },
        { id: "seed-info-nether-seed", value: seed ? seed.nether_seed : "-" },
        { id: "seed-info-end-seed", value: seed ? seed.end_seed : "-" },
        { id: "seed-info-rng-seed", value: seed ? seed.rng_seed : "-" },
        { id: "seed-info-sh1", value: seed ? seed.sh1 : "-" },
        { id: "seed-info-sh2", value: seed ? seed.sh2 : "-" },
        { id: "seed-info-sh3", value: seed ? seed.sh3 : "-" },
        { id: "seed-info-fortress", value: seed ? seed.fortress : "-" },
        { id: "seed-info-bastion", value: seed ? seed.bastion : "-" },
        { id: "seed-info-nether-spawn", value: seed ? seed.nether_spawn : "-" },
        { id: "seed-info-second-overworld", value: seed ? seed.second_overworld : "-" }
    ];

    fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) el.textContent = f.value || "-";
    });
}

// =====================================================
// Command Generation
// =====================================================

function resolveSeedPlaceholders(cmd, seed) {
    if (!seed) return cmd;
    const [sh1x, sh1y, sh1z] = seed.sh1.split(' ');
    const [sh2x, sh2y, sh2z] = seed.sh2.split(' ');
    const [sh3x, sh3y, sh3z] = seed.sh3.split(' ');
    const [fortx, forty, fortz] = seed.fortress.split(' ');
    const [bastx, basty, bastz] = seed.bastion.split(' ');

    if (seed.nether_spawn) {
        const [nsx, nsy, nsz] = seed.nether_spawn.split(' ');
        cmd = cmd
            .replace(/\{NETHER_SPAWN\}/g, seed.nether_spawn)
            .replace(/\{NETHER_SPAWN_X\}/g, nsx)
            .replace(/\{NETHER_SPAWN_Y\}/g, nsy)
            .replace(/\{NETHER_SPAWN_Z\}/g, nsz);
    }

    if (seed.second_overworld) {
        const [sowx, sowy, sowz] = seed.second_overworld.split(' ');
        cmd = cmd
            .replace(/\{SECOND_OVERWORLD\}/g, seed.second_overworld)
            .replace(/\{SECOND_OVERWORLD_X\}/g, sowx)
            .replace(/\{SECOND_OVERWORLD_Y\}/g, sowy)
            .replace(/\{SECOND_OVERWORLD_Z\}/g, sowz);
    }

    return cmd
        .replace(/\{SH1\}/g, seed.sh1)
        .replace(/\{SH2\}/g, seed.sh2)
        .replace(/\{SH3\}/g, seed.sh3)
        .replace(/\{SH1_X\}/g, sh1x).replace(/\{SH1_Y\}/g, sh1y).replace(/\{SH1_Z\}/g, sh1z)
        .replace(/\{SH2_X\}/g, sh2x).replace(/\{SH2_Y\}/g, sh2y).replace(/\{SH2_Z\}/g, sh2z)
        .replace(/\{SH3_X\}/g, sh3x).replace(/\{SH3_Y\}/g, sh3y).replace(/\{SH3_Z\}/g, sh3z)
        .replace(/\{FORTRESS_X\}/g, fortx).replace(/\{FORTRESS_Y\}/g, forty).replace(/\{FORTRESS_Z\}/g, fortz)
        .replace(/\{BASTION_X\}/g, bastx).replace(/\{BASTION_Y\}/g, basty).replace(/\{BASTION_Z\}/g, bastz)
        .replace(/\{FORTRESS\}/g, seed.fortress)
        .replace(/\{BASTION\}/g, seed.bastion);
}

function generate() {
    const buffPlayer = document.getElementById("buff-player").value.trim();
    const debuffPlayer = document.getElementById("debuff-player").value.trim();
    const buffAll = document.getElementById("buff-all").checked;
    const debuffAll = document.getElementById("debuff-all").checked;
    const seedId = document.getElementById("seed-select").value;
    const seed = SEEDS.find(s => s.id === seedId) || null;

    // Checkbox supersedes player input. Empty input + no checkbox = skip that side.
    let buffSelector = null;
    if (buffAll) buffSelector = "@a";
    else if (buffPlayer) buffSelector = `@a[name=${buffPlayer}]`;

    let debuffSelector = null;
    if (debuffAll) debuffSelector = "@a";
    else if (debuffPlayer) debuffSelector = `@a[name=${debuffPlayer}]`;

    const allCommands = ["/gamerule sendCommandFeedback false"];
    let buffOffset = 0;
    let debuffOffset = 0;

    function processCard(t, selector, xOffset) {
        let yIdx = 0;
        t.commands.forEach(cmd => {
            if (!cmd) return;
            cmd = resolveSeedPlaceholders(cmd, seed);
            const needsCoords = cmd.includes("{COORDS}");
            if (needsCoords) {
                const coords = `~${xOffset} ${1 + yIdx} ~0`;
                yIdx++;
                allCommands.push(cmd.replace(/\{SELECTOR\}/g, selector).replace(/\{COORDS\}/g, coords));
            } else {
                allCommands.push(cmd.replace(/\{SELECTOR\}/g, selector));
            }
        });
    }

    if (buffSelector) BUFFS.forEach(t => {
        const checkbox = document.getElementById(`tmpl-${t.id}`);
        if (!checkbox || !checkbox.checked) return;
        if (t.commands.length === 0) return;

        const xOffset = buffOffset;
        processCard(t, buffSelector, xOffset);
        // Only advance the x offset if this card used at least one command block
        if (t.commands.some(cmd => cmd.includes("{COORDS}"))) {
            buffOffset++;
        }
    });

    if (debuffSelector) DEBUFFS.forEach(t => {
        const checkbox = document.getElementById(`tmpl-${t.id}`);
        if (!checkbox || !checkbox.checked) return;
        if (t.commands.length === 0) return;

        const xOffset = -(debuffOffset + 1);
        processCard(t, debuffSelector, xOffset);
        if (t.commands.some(cmd => cmd.includes("{COORDS}"))) {
            debuffOffset++;
        }
    });

    const output = allCommands.join(";");
    document.getElementById("output").value = output;
}

// =====================================================
// Clipboard
// =====================================================

function copyOutput() {
    const output = document.getElementById("output");
    output.select();
    document.execCommand("copy");
    const btn = document.querySelector(".btn-copy");
    btn.textContent = "Copiado!";
    setTimeout(() => btn.textContent = "Copiar", 2000);
}

// Initialize on load
renderSeeds();
renderSeedList();
renderTemplates();

document.getElementById("seed-select").addEventListener("change", updateSeedInfoSidebar);
