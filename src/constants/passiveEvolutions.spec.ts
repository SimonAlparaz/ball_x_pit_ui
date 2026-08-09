import { describe, expect, it } from 'vitest';
import assetMap from '../lib/assetMap.ts';
import { passiveInformation } from './passiveInformation.ts';
import { passiveEvolutions } from './passiveEvolutions.ts';

const naturalistPassiveEvolutions = [
  ['rubberHeadband', 'wagonWheel', 'ardentTire'],
  ['platinumDumbbell', 'upturnedHatchet', 'ingloriousHammer'],
  ['magnet', 'pressureValve', 'remoteDetonator'],
  ['bottledTornado', 'slingshot', 'windweaver'],
] as const;

describe('Naturalist passive evolutions', () => {
  it.each(naturalistPassiveEvolutions)('evolves %s and %s into %s', (first, second, result) => {
    expect(passiveEvolutions).toContainEqual([first, second, result]);
  });

  it('provides information and icons for every component and result', () => {
    for (const passive of new Set(naturalistPassiveEvolutions.flat())) {
      expect(passiveInformation[passive].name).toBeTruthy();
      expect(assetMap.passiveIcons[passive]).toMatch(/^\/assets\/.+\.png$/);
    }
  });
});
