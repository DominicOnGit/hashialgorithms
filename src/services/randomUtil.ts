// The maximum is exclusive and the minimum is inclusive
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function pickRandom<T>(items: T[]): T {
  const index = getRandomInt(0, items.length);
  return items[index];
}
