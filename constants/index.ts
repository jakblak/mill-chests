// export const rarityTiers = [
//   { name: 'Common', probability: 0.000500, itemCount: 200 },
//   { name: 'Uncommon', probability: 0.000250, itemCount: 180 },
//   { name: 'Rare', probability: 0.000125, itemCount: 160 },
//   { name: 'Very Rare', probability: 0.000062, itemCount: 140 },
//   { name: 'Epic', probability: 0.000031, itemCount: 100 },
//   { name: 'Legendary', probability: 0.000016, itemCount: 80 },
//   { name: 'Mythic', probability: 0.000008, itemCount: 60 },
//   { name: 'Divine', probability: 0.000004, itemCount: 40 },
//   { name: 'Cosmic', probability: 0.000003, itemCount: 30 },
//   { name: 'Transcendent', probability: 0.000001, itemCount: 10 }
// ]
export const rarityTiers = [
  { name: 'Common', probability: 0.0100, itemCount: 200 },
  { name: 'Uncommon', probability: 0.0150, itemCount: 180 },
  { name: 'Rare', probability: 0.0125, itemCount: 160 },
  { name: 'Epic', probability: 0.01000031, itemCount: 100 },
  { name: 'Legendary', probability: 0.01000016, itemCount: 80 },
  { name: 'Mythic', probability: 0.01000008, itemCount: 60 },
  { name: 'Divine', probability: 0.01000004, itemCount: 40 },
  { name: 'Cosmic', probability: 0.01000003, itemCount: 30 },
  { name: 'Transcendent', probability: 0.01000001, itemCount: 10 }
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function determineLoot(chestId: number): string | null {
  const random = seededRandom(chestId);
  
  let cumulativeProbability = 0;
  for (const tier of rarityTiers) {
    cumulativeProbability += tier.probability;
    if (random < cumulativeProbability) {
      return tier.name;
    }
  }
  return null;
}