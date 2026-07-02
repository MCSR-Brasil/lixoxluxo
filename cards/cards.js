// ── Card definitions ──────────────────────────────────────────────────────────
// icon: emoji fallback shown if no img is set
// img:  optional path to a PNG (e.g. 'imgs/fire_res.png') — 128x128 recommended

const BUFFS = [
  { id: 'golden_armor',     name: 'Armadura de Ouro',    desc: 'Comeca com um set completo de armadura de ouro.',         icon: '🛡️', img: 'icons/gold_armour.png',          type: 'buff', accent: '#f1c40f' },
  { id: 'fire_res',         name: 'Imune ao Fogo',        desc: 'Fire Resistance infinita. Nem a lava te para.',           icon: '🔥', img: 'icons/fire_resistance.png',      type: 'buff', accent: '#e67e22' },
  { id: 'no_fall',          name: 'Peso pena',            desc: 'Nao recebe dano de queda.',                             icon: '🪂', img: 'icons/no_fall_damage.png',       type: 'buff', accent: '#5dade2' },
  { id: 'bonus_chest',      name: 'Bonus Chest OP',       desc: 'Loot table de End City direto no spawn.',                 icon: '📦', img: 'icons/op_bonus_chest.png',       type: 'buff', accent: '#a569bd' },
  { id: 'keep_inventory',   name: 'Cafe Com Leite',       desc: 'Nao perde itens ao morrer. Nenhum.',                      icon: '🎒', img: 'icons/keep_inventory.png',       type: 'buff', accent: '#58d68d' },
  { id: 'ender_arrows',     name: 'Ender Flechas',         desc: 'Flechas que te teleportam para onde acertam.',            icon: '🏹', img: 'icons/ender_arrows.png',         type: 'buff', accent: '#1abc9c' },
  { id: 'icarus',           name: 'Icarus',                desc: 'Elytra com Mending e 64 foguetes. Voe alto.',             icon: '🪽', img: 'icons/icarus.png',               type: 'buff', accent: '#85c1e9' },
  { id: 'notch_apple',      name: 'Dieta Equilibrada',          desc: 'Comeca com Enchanted Golden Apples. Acumula a cada vez.', icon: '🍏', img: 'icons/goldern_apple.png',        type: 'buff', accent: '#f9e79f' },
  { id: 'call_a_friend',    name: 'Corrida dos Bobos',    desc: 'Pode ligar para alguem bom e pedir ajuda agora.',         icon: '📞', img: 'icons/corrida_dos_bobos.png',    type: 'buff', accent: '#2ecc71', once: true },
  { id: 'disarmed_piglins', name: 'Piglins Amigos',   desc: 'Piglins perdem a arma e ganham uma flor. Inofensivos.',   icon: '🌸', img: 'icons/peaceful_piglins.png',     type: 'buff', accent: '#f1948a' },
  { id: 'double_health',    name: '28% Gato',        desc: 'Você tem o dobro de vida',                                  icon: '❤️', img: 'icons/double_health.png',        type: 'buff', accent: '#e74c3c' },
  { id: 'no_crystals',      name: 'Sem Cristais',           desc: 'O dragao spawna sem End Crystals.',           icon: '💎', img: 'icons/no_crystals.png',          type: 'buff', accent: '#76d7c4' },
  { id: 'no_explosion',     name: 'Imune a Explosões',    desc: 'Nao recebe dano de explosao',    icon: '💥', img: 'icons/no_explosion_damage.png',  type: 'buff', accent: '#f39c12' },
  { id: 'win_on_enter',     name: 'Entrou, Ganhou',       desc: 'Ganha ao entrar no End. Sem precisar matar o dragao.',    icon: '🚪', img: 'icons/end_enter_only.png',       type: 'buff', accent: '#8e44ad' },
  { id: 'structure_compass',name: 'Bussolas',       desc: 'Ganha Bussolas que apontam para o Bastion e Fortress',    icon: '🧭', img: 'icons/structure_compass.png',       type: 'buff', accent: '#bf7cdb' },
  { id: 'god_tool',         name: 'Martelo Lendario',       desc: 'Ganha uma Ferramenta Absurda',                              icon: '🔨', img: 'icons/god_tool.png',       type: 'buff', accent: '#bf7cdb' },
  { id: 'aura',             name: 'Aura',                       desc: 'Todos os mobs ficam mais fracos em sua presenca',              icon: '✨', img: 'icons/aura.png',       type: 'buff', accent: '#eeffa5' },
  { id: 'buffet',           name: 'Comida Infinita',           desc: 'Voce nunca fica com fome',              icon: '✨', img: 'icons/buffet.png',       type: 'buff', accent: '#ff9354' },
  { id: 'portal_radar',     name: 'Raio X de Stronghold',    desc: 'Voce enxerga onde a portal room fica',              icon: '✨', img: 'icons/xray.png',       type: 'buff', accent: '#f9fc5d' },
  { id: 'dejavu',           name: 'Deja Vu',                  desc: 'Voce respawna no split atual, Bastion Fortress...',              icon: '✨', img: 'icons/dejavu.png',       type: 'buff', accent: '#65c1ff' },



];

const DEBUFFS = [
  { id: 'no_regen',          name: 'Sem Regeneracao',        desc: 'Sem regeneracao natural de vida durante toda a run.',            icon: '🚫', img: 'icons/no_regeneration.png', type: 'debuff', accent: '#e74c3c' },
  { id: 'half_hearts',       name: 'Metade da Vida',         desc: 'Sua barra de vida e cortada pela metade. Acumula.',              icon: '💔', img: 'icons/half_life.png',        type: 'debuff', accent: '#c0392b' },
  { id: 'less_slots',        name: 'Jeans Feminina',         desc: 'Perde slots de inventario. Acumula a cada vez que cair.',        icon: '🗑️', img: 'icons/less_inventory.png',   type: 'debuff', accent: '#d35400' },
  { id: 'no_armor_slots',    name: 'Sem Armadura',           desc: 'Nao pode equipar nenhuma peca de armadura.',                     icon: '🩲', img: 'icons/no_armor_slots.png',   type: 'debuff', accent: '#e59866' },
  { id: 'no_loot',           name: 'Loot RSG',               desc: 'Mobs nao dropam loot da Ranked. RNG puro.',                icon: '📭', img: 'icons/no_loot.png',          type: 'debuff', accent: '#7f8c8d' },
  { id: 'random_effects',    name: 'Efeitos Aleatorios',     desc: 'A cada 15 segundos um efeito aleatorio e aplicado em voce.',     icon: '🎲', img: 'icons/random_effects.png',   type: 'debuff', accent: '#8e44ad' },
  { id: 'extra_objective',   name: 'Objetivo Extra',         desc: 'Precisa completar uma tarefa extra alem de zerar o jogo.',       icon: '📋', img: 'icons/extra_objective.png',  type: 'debuff', accent: '#2c3e50' },
  { id: 'thirst',            name: 'Sede',                   desc: 'Barra de sede ativa. Precisa beber regularmente.',               icon: '🫗', img: 'icons/thirst.png',           type: 'debuff', accent: '#5dade2' },
  { id: 'fast_hunger',       name: 'Fome Acelerada',         desc: 'Efeito de Hunger constante. A fome drena muito mais rapido.',    icon: '🍽️', img: 'icons/fast_hunger.png',       type: 'debuff', accent: '#a04000' },
  { id: 'thorns_mobs',       name: 'Espinhos nos Mobs',      desc: 'Todos os mobs tem Thorns. Cada ataque te machuca tambem.',       icon: '🌵', img: 'icons/throns_mobs.png',       type: 'debuff', accent: '#1e8449' },
  { id: 'shuffle_inventory', name: 'Inventario Embaralhado', desc: 'Itens do inventario sao embaralhados aleatoriamente.',           icon: '🔀', img: 'icons/inventory_shuffle.png', type: 'debuff', accent: '#f39c12' },
  { id: 'angry_piglins',     name: 'Piglins Raivosos',      desc: 'Todos os Piglins e Pigmen te atacam sem parar.',                 icon: '👺', img: 'icons/angry_piglin.png',      type: 'debuff', accent: '#e74c3c' },
  { id: 'crossed_eyes',      name: 'Olho Vesgo',             desc: 'Nao consegue medir angulos precisamente.',         icon: '👁️', img: 'icons/crossed_eye.png',       type: 'debuff', accent: '#2c3e50' },
  { id: 'schizo',            name: 'Esquizofrenia',          desc: 'Coisas estranhas e aleatorias comecam a acontecer. Boa sorte.',        icon: '🔊', img: 'icons/schizo.png',            type: 'debuff', accent: '#6c3483' },
  { id: 'butter_fingers',    name: 'Mao de Alface',          desc: 'Aleatoriamente dropa o item que esta segurando.',                icon: '🥬', img: 'icons/butter_fingers.png',    type: 'debuff', accent: '#58d68d' },
  { id: 'knockback',         name: 'Peso Pena',                 desc: 'Todos os mobs dao knockback extremo em voce.',                   icon: '🥊', img: 'icons/knockback.png',         type: 'debuff', accent: '#e67e22' },
  { id: 'structureless',     name: 'Structureless',          desc: 'Voce e teleportado para uma area sem estruturas na seed.',       icon: '🗺️', img: 'icons/structureless.png',     type: 'debuff', accent: '#7f8c8d', once: true },
  { id: 'no_pearl',          name: 'Maratona',        desc: 'Voce nao pode usar ender pearls.',                               icon: '🗺️', img: 'icons/no__ender_pearl.png',     type: 'debuff', accent: '#c560ce', once: true },
  { id: 'no_overworld',      name: 'Overworld Skip',         desc: 'Voce pula o overworld, e spawna direto no nether',               icon: '🗺️', img: 'icons/no_overworld.png',     type: 'debuff', accent: '#e2483d', once: true },


];

const CARD_DECK = [...BUFFS, ...DEBUFFS];

const _OLD_DECK = [
  // ── BUFFS ──────────────────────────────────────────────────────────────────
  {
    id: 'golden_apples',
    name: 'Golden Apples',
    desc: 'Receive 2 Golden Apples. Heal and get Absorption on your next fight.',
    icon: '🍎',
    type: 'buff',
    accent: '#f1c40f',
    power: 'HEAL',
  },
  {
    id: 'enchanted_sword',
    name: 'Enchanted Sword',
    desc: 'Your sword gets Sharpness V for the next round.',
    icon: '⚔️',
    type: 'buff',
    accent: '#5dade2',
    power: 'SHARP V',
  },
  {
    id: 'full_iron',
    name: 'Iron Armor',
    desc: 'Spawn with a full set of Iron Armor this round.',
    icon: '🛡️',
    type: 'buff',
    accent: '#aab7b8',
    power: 'ARMOR',
  },
  {
    id: 'speed_potion',
    name: 'Speed Potion',
    desc: 'You get Speed II for the entire next round.',
    icon: '�',
    type: 'buff',
    accent: '#58d68d',
    power: 'SPD II',
  },
  {
    id: 'bow_infinity',
    name: 'Infinity Bow',
    desc: 'Receive a bow with Infinity. Unlimited arrows.',
    icon: '🏹',
    type: 'buff',
    accent: '#a569bd',
    power: 'INF',
  },
  {
    id: 'extra_life',
    name: 'Totem of Life',
    desc: 'If you die this round, you come back once automatically.',
    icon: '🪬',
    type: 'buff',
    accent: '#e67e22',
    power: 'REVIVE',
  },
  {
    id: 'strength_brew',
    name: 'Strength Brew',
    desc: 'Drink a Strength II potion before the round starts.',
    icon: '�',
    type: 'buff',
    accent: '#c0392b',
    power: 'STR II',
  },
  {
    id: 'ender_pearl',
    name: 'Ender Pearl',
    desc: 'Start with 4 Ender Pearls. Teleport at will.',
    icon: '🟢',
    type: 'buff',
    accent: '#1abc9c',
    power: 'TELE',
  },

  // ── DEBUFFS ────────────────────────────────────────────────────────────────
  {
    id: 'mob_damage',
    name: 'Mob Frenzy',
    desc: 'All mobs deal double damage to you this round.',
    icon: '🧟',
    type: 'debuff',
    accent: '#e74c3c',
    power: '×2 DMG',
  },
  {
    id: 'no_armor',
    name: 'Naked & Afraid',
    desc: 'You cannot wear any armor this round.',
    icon: '🩲',
    type: 'debuff',
    accent: '#e59866',
    power: 'NO ARMOR',
  },
  {
    id: 'creeper_spawn',
    name: 'Creeper Magnet',
    desc: 'A Creeper spawns next to you at the start of each fight.',
    icon: '�',
    type: 'debuff',
    accent: '#27ae60',
    power: 'BOOM',
  },
  {
    id: 'blindness',
    name: 'Blindness',
    desc: 'You play with Blindness effect for the entire round.',
    icon: '🙈',
    type: 'debuff',
    accent: '#2c3e50',
    power: 'BLIND',
  },
  {
    id: 'slowness',
    name: 'Lead Boots',
    desc: 'Slowness III applied to you for the whole round.',
    icon: '🐌',
    type: 'debuff',
    accent: '#7f8c8d',
    power: 'SLOW III',
  },
  {
    id: 'wood_sword',
    name: 'Downgrade',
    desc: 'You can only use a Wooden Sword this round.',
    icon: '🪵',
    type: 'debuff',
    accent: '#a04000',
    power: 'WOOD',
  },
  {
    id: 'hunger',
    name: 'Starving',
    desc: 'Your hunger bar drains instantly. No natural regen.',
    icon: '�',
    type: 'debuff',
    accent: '#d35400',
    power: 'NO REGEN',
  },
];

function shuffleDeck(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
