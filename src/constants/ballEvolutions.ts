import type { Balls, StarterBalls } from '../types/balls.ts';
import { ballInformation } from './ballInformation.ts';

export const advancedEvolutions: [Balls, Balls, Balls][] = [
  ['inferno', 'storm', 'armageddon'],
  ['bomb', 'poison', 'nuclearBomb'],
  ['bomb', 'time', 'timeBomb'],
  ['incubus', 'succubus', 'satan'],
  ['dark', 'sun', 'blackHole'],
  ['sun', 'time', 'blackHole'],
  ['laserHorizontal', 'steel', 'laserCutter'],
  ['laserVertical', 'steel', 'laserCutter'],
  ['heartSwallower', 'soulSucker', 'reaper'],
  ['laserBeam', 'holyLaser', 'xRay'],
  ['wraith', 'phantom', 'banshee'],
  ['darkAssassin', 'shotgun', 'sniper'],
  ['mosquitoKing', 'mosquitoSwarm', 'mosquitoKingdom'],
  ['radiationBeam', 'flesh', 'tumor'],
];

export const multipleAdvancedEvolutions: [Balls, Balls, Balls, ...Balls[]][] = [
  ['vampireLord', 'mosquitoKing', 'spiderQueen', 'nosferatu'],
  ['burn', 'wind', 'freeze', 'earthquake', 'elemental'],
];

export const basicEvolutions: [StarterBalls, StarterBalls, Balls][] = [
  ['bleed', 'broodMother', 'leech'],
  ['bleed', 'charm', 'berserk'],
  ['bleed', 'dark', 'sacrifice'],
  ['bleed', 'ghost', 'heartSwallower'],
  ['bleed', 'iron', 'hemorrhage'],
  ['bleed', 'poison', 'virus'],
  ['bleed', 'vampire', 'vampireLord'],
  ['broodMother', 'cell', 'maggot'],
  ['broodMother', 'eggSac', 'spiderQueen'],
  ['broodMother', 'vampire', 'mosquitoKing'],
  ['broodMother', 'flesh', 'fleshMound'],
  ['burn', 'charm', 'berserk'],
  ['burn', 'earthquake', 'magma'],
  ['burn', 'dark', 'banishedFlame'],
  ['burn', 'eggSac', 'fireworks'],
  ['burn', 'freeze', 'frozenFlame'],
  ['burn', 'iron', 'bomb'],
  ['burn', 'light', 'sun'],
  ['burn', 'poison', 'brimstone'],
  ['burn', 'stone', 'brimstone'],
  ['burn', 'time', 'inferno'],
  ['burn', 'wind', 'inferno'],
  ['cell', 'earthquake', 'overgrowth'],
  ['cell', 'eggSac', 'voluptuousEggSac'],
  ['cell', 'laserHorizontal', 'radiationBeam'],
  ['cell', 'laserVertical', 'radiationBeam'],
  ['cell', 'poison', 'virus'],
  ['cell', 'flesh', 'offspring'],
  ['charm', 'dark', 'incubus'],
  ['charm', 'light', 'lovestruck'],
  ['charm', 'lightning', 'lovestruck'],
  ['charm', 'time', 'lovestruck'],
  ['charm', 'vampire', 'succubus'],
  ['dark', 'ghost', 'phantom'],
  ['dark', 'iron', 'darkAssassin'],
  ['dark', 'light', 'flicker'],
  ['dark', 'vampire', 'vampireLord'],
  ['dark', 'wind', 'noxious'],
  ['earthquake', 'freeze', 'glacier'],
  ['earthquake', 'poison', 'swamp'],
  ['earthquake', 'wind', 'sandstorm'],
  ['earthquake', 'iron', 'drill'],
  ['eggSac', 'iron', 'shotgun'],
  ['eggSac', 'vampire', 'mosquitoSwarm'],
  ['freeze', 'ghost', 'wraith'],
  ['freeze', 'laserHorizontal', 'freezeRay'],
  ['freeze', 'laserVertical', 'freezeRay'],
  ['freeze', 'lightning', 'blizzard'],
  ['freeze', 'poison', 'venom'],
  ['freeze', 'time', 'timestop'],
  ['freeze', 'wind', 'blizzard'],
  ['ghost', 'iron', 'darkAssassin'],
  ['ghost', 'poison', 'virus'],
  ['ghost', 'vampire', 'soulSucker'],
  ['iron', 'lightning', 'lightningRod'],
  ['laserHorizontal', 'laserVertical', 'holyLaser'],
  ['laserHorizontal', 'poison', 'radiationBeam'],
  ['laserHorizontal', 'light', 'laserBeam'],
  ['laserVertical', 'poison', 'radiationBeam'],
  ['laserVertical', 'light', 'laserBeam'],
  ['light', 'lightning', 'flash'],
  ['light', 'time', 'warp'],
  ['lightning', 'wind', 'storm'],
  ['lightning', 'broodMother', 'lightningBug'],
  ['poison', 'wind', 'noxious'],
  ['stone', 'earthquake', 'landslide'],
  ['stone', 'eggSac', 'catapult'],
  ['stone', 'freeze', 'glacier'],
  ['stone', 'iron', 'steel'],
  ['stone', 'wind', 'sandstorm'],
  ['stone', 'flesh', 'petrify'],
  ['vampire', 'flesh', 'zombie'],
  ['wind', 'time', 'erosion'],
];

export function getEvolutionRecipes(ball: Balls): string | null {
  const matches = [...basicEvolutions, ...advancedEvolutions, ...multipleAdvancedEvolutions]
    .filter((evolution) => evolution.at(-1) === ball)
    .map((evolution) =>
      evolution
        .slice(0, -1)
        .map((component) => ballInformation[component].name)
        .join(' x ')
    );

  if (matches.length === 0) return null;

  // Condense Laser (Horizontal) and Laser (Vertical) recipes into Laser (Either)
  const isLaser = (s: string) => /Laser\s*\((Horizontal|Vertical)\)/i.test(s);

  const normalizeLaser = (s: string) =>
    s.replace(/Laser\s*\((Horizontal|Vertical)\)/gi, 'Laser (Either)');

  const condensed: string[] = [];

  for (const match of matches) {
    const components = match.split(' x ');

    if (components.filter(isLaser).length > 1) {
      condensed.push(match);
      continue;
    }

    condensed.push(components.map(normalizeLaser).join(' x '));
  }

  return [...new Set(condensed)].join(' / ');
}

function buildEvolutionMap() {
  const evolutionMap: Partial<Record<Balls, Partial<Record<Balls, Record<'evolution', Balls>>>>> =
    {};

  const allEvolutions = [...basicEvolutions, ...advancedEvolutions];

  for (const [ball1, ball2, result] of allEvolutions) {
    if (!evolutionMap[ball1]) {
      evolutionMap[ball1] = {};
    }
    evolutionMap[ball1]![ball2] = { evolution: result };

    if (!evolutionMap[ball2]) {
      evolutionMap[ball2] = {};
    }
    evolutionMap[ball2]![ball1] = { evolution: result };
  }

  return evolutionMap;
}

export const evolutions = buildEvolutionMap() satisfies Partial<
  Record<Balls, Partial<Record<Balls, Record<'evolution', Balls>>>>
>;
