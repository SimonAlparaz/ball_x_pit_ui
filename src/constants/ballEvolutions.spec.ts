import { describe, expect, it } from 'vitest';
import {
  advancedEvolutions,
  evolutions,
  getEvolutionRecipes,
  multipleAdvancedEvolutions,
} from './ballEvolutions.ts';

describe('Naturalist ball evolutions', () => {
  it.each([
    ['earthquake', 'iron', 'drill'],
    ['broodMother', 'flesh', 'fleshMound'],
    ['lightning', 'broodMother', 'lightningBug'],
    ['cell', 'flesh', 'offspring'],
    ['stone', 'flesh', 'petrify'],
    ['vampire', 'flesh', 'zombie'],
  ] as const)('evolves %s and %s into %s in the basic grid', (first, second, result) => {
    expect(evolutions[first]?.[second]?.evolution).toBe(result);
    expect(evolutions[second]?.[first]?.evolution).toBe(result);
  });

  it('includes the new advanced evolutions', () => {
    expect(advancedEvolutions).toContainEqual(['inferno', 'storm', 'armageddon']);
    expect(advancedEvolutions).toContainEqual(['mosquitoKing', 'mosquitoSwarm', 'mosquitoKingdom']);
    expect(advancedEvolutions).toContainEqual(['radiationBeam', 'flesh', 'tumor']);
  });

  it('supports and reports Elemental as a four-component evolution', () => {
    expect(multipleAdvancedEvolutions).toContainEqual([
      'burn',
      'wind',
      'freeze',
      'earthquake',
      'elemental',
    ]);
    expect(getEvolutionRecipes('elemental')).toBe('Burn x Wind x Freeze x Earthquake');
  });
});
