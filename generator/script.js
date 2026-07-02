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
// =====================================================
const SEEDS = [
    {
        id: 'seed1',
        name: '...',
        sh1: '0 60 0',
        sh2: '0 60 0',
        sh3: '0 60 0',
        fortress: '0 60 0',
        bastion: '0 60 0'
    }
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
        commands: [
            "",
            "",
            ""
        ]
    },
    {
        id: 'keep_inventory',
        name: 'Cafe Com Leite',
        commands: [
            "gamerule keepInventory true"
        ]
    },
    {
        id: 'ender_arrows',
        name: 'Ender Flechas',
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
            "replaceitem entity {SELECTOR} armor.chest minecraft:elytra{Enchantments:[{id:minecraft:mending,lvl:1}]} 1",
            "give {SELECTOR} minecraft:firework_rocket 128"
        ]
    },
    {
        id: 'notch_apple',
        name: 'Dieta Equilibrada',
        commands: [
            "give {SELECTOR} minecraft:enchanted_golden_apple 2"
        ]
    },
    {
        id: 'call_a_friend',
        name: 'Corrida dos Bobos',
        commands: [
            // Meta rule — no command needed
        ]
    },
    {
        id: 'disarmed_piglins',
        name: 'Piglins Amigos',
        commands: [
            ""
        ]
    },
    {
        id: 'double_health',
        name: '28% Gato',
        commands: [
            "",
            ""
        ]
    },
    {
        id: 'no_crystals',
        name: 'Sem Cristais',
        commands: [
            ""
        ]
    },
    {
        id: 'no_explosion',
        name: 'Imune a Explosoes',
        commands: [
            ""
        ]
    },
    {
        id: 'win_on_enter',
        name: 'Entrou, Ganhou',
        commands: [
            "speedrunigt start true ENTER_END"
        ]
    },
    {
        id: 'structure_compass',
        name: 'Bussolas',
        commands: [
            "give {SELECTOR} minecraft:compass{LodestoneDimension:\"minecraft:the_nether\",LodestonePos:{X:{BASTION_X},Y:{BASTION_Y},Z:{BASTION_Z}},display:{Name:'{\\\"text\\\":\\\"Bastion Compass\\\"}'}} 1",
            "give {SELECTOR} minecraft:compass{LodestoneDimension:\"minecraft:the_nether\",LodestonePos:{X:{FORTRESS_X},Y:{FORTRESS_Y},Z:{FORTRESS_Z}},display:{Name:'{\\\"text\\\":\\\"Fortress Compass\\\"}'}} 1"
        ]
    },
    {
        id: 'god_tool',
        name: 'Martelo Lendario',
        commands: [
            "give @p netherite_pickaxe{Enchantments:[{id:'minecraft:efficiency',lvl:10s},{id:'minecraft:unbreaking',lvl:10s},{id:'minecraft:fortune',lvl:10s},{id:'minecraft:sharpness',lvl:255s},{id:'minecraft:looting',lvl:3s}]} 1"
        ]
    },
    {
        id: 'aura',
        name: 'Aura',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as @a at @s run execute as @e[type=!minecraft:player,distance=..30] run attribute @s minecraft:generic.follow_range base set 1\"} replace"
        ]
    },
    {
        id: 'buffet',
        name: 'Comida Infinita',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"effect give {SELECTOR} minecraft:saturation 9 0 true\"} replace"
        ]
    },
    {
        id: 'portal_radar',
        name: 'Raio X de Stronghold',
        commands: [
            ""
        ]
    },
    {
        id: 'dejavu',
        name: 'Deja Vu',
        commands: [
            "gamerule respawnAtSplit true",
            "gamerule keepInventory true"
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
            "",
        ]
    },
    {
        id: 'less_slots',
        name: 'Jeans Feminina',
        commands: [
            "",
            "",
            "",
            "",
            ""
        ]
    },
    {
        id: 'no_armor_slots',
        name: 'Sem Armadura',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.head minecraft:barrier 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.chest minecraft:barrier 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.legs minecraft:barrier 1\"} replace",
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"replaceitem entity {SELECTOR} armor.feet minecraft:barrier 1\"} replace"
        ]
    },
    {
        id: 'no_loot',
        name: 'Loot RSG',
        commands: [
            "gamerule modifiedLootTables false"
        ]
    },
    {
        id: 'random_effects',
        name: 'Efeitos Aleatorios',
        commands: [
            // Needs a scoreboard randomizer system — placeholder
        ]
    },
    {
        id: 'extra_objective',
        name: 'Objetivo Extra',
        commands: [
            // Meta rule — no direct command
        ]
    },
    {
        id: 'thirst',
        name: 'Sede',
        commands: [
            ""
        ]
    },
    {
        id: 'fast_hunger',
        name: 'Fome Acelerada',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"effect give {SELECTOR} minecraft:hunger 5 1 true\"} replace"
        ]
    },
    {
        id: 'thorns_mobs',
        name: 'Espinhos nos Mobs',
        commands: [
            // Needs damage-on-hit detection via scoreboard — placeholder
        ]
    },
    {
        id: 'shuffle_inventory',
        name: 'Inventario Embaralhado',
        commands: [
            // Needs complex command block chain — placeholder
        ]
    },
    {
        id: 'angry_piglins',
        name: 'Piglins Raivosos',
        commands: [
            // Piglins attack without gold naturally; to force-aggro all piglins/piglin brutes use tag — placeholder
        ]
    },
    {
        id: 'crossed_eyes',
        name: 'Olho Vesgo',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"effect give {SELECTOR} minecraft:nausea 999999 0 true\"} replace"
        ]
    },
    {
        id: 'schizo',
        name: 'Esquizofrenia',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"playsound minecraft:entity.enderman.stare master {SELECTOR}\"} replace"
        ]
    },
    {
        id: 'butter_fingers',
        name: 'Mao de Alface',
        commands: [
            // Needs repeating random drop mechanic — placeholder
        ]
    },
    {
        id: 'knockback',
        name: 'Peso Pena (Knockback)',
        commands: [
            "attribute {SELECTOR} minecraft:generic.knockback_resistance base set -1"
        ]
    },
    {
        id: 'structureless',
        name: 'Structureless',
        commands: [
            // Teleport to empty area — needs seed analysis, meta rule
        ]
    },
    {
        id: 'no_pearl',
        name: 'Maratona',
        commands: [
            "setblock {COORDS} minecraft:repeating_command_block[facing=up]{auto:1b,Command:\"execute as {SELECTOR} run kill @e[type=minecraft:ender_pearl]\"} replace"
        ]
    },
    {
        id: 'no_overworld',
        name: 'Overworld Skip',
        commands: [
            "execute as {SELECTOR} at @s run tp {SELECTOR} {SH1}"
        ]
    }
];

// =====================================================
// UI Rendering
// =====================================================

function renderSeeds() {
    const select = document.getElementById("seed-select");
    SEEDS.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name;
        select.appendChild(opt);
    });
}

function renderTemplates() {
    const buffList = document.getElementById("buff-list");
    const debuffList = document.getElementById("debuff-list");

    BUFFS.forEach(t => {
        const div = document.createElement("div");
        div.className = "template-item";
        div.innerHTML = `
            <input type="checkbox" id="tmpl-${t.id}">
            <label for="tmpl-${t.id}">${t.name}</label>
        `;
        buffList.appendChild(div);
    });

    DEBUFFS.forEach(t => {
        const div = document.createElement("div");
        div.className = "template-item";
        div.innerHTML = `
            <input type="checkbox" id="tmpl-${t.id}">
            <label for="tmpl-${t.id}">${t.name}</label>
        `;
        debuffList.appendChild(div);
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
    const playerName = document.getElementById("debuff-player").value.trim();
    const seedId = document.getElementById("seed-select").value;
    const seed = SEEDS.find(s => s.id === seedId) || null;

    // If no player name is entered, default to @a for all players
    const buffSelector = playerName ? `@a[name=!${playerName}]` : "@a";
    const debuffSelector = playerName ? `@a[name=${playerName}]` : "@a";

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

    BUFFS.forEach(t => {
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

    DEBUFFS.forEach(t => {
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
renderTemplates();
