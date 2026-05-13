export function getFakeInterest(id: number) {
  const min = 10;
  const max = 100;

  // deterministic random based on id
  const seed = id * 9301 + 49297;
  const random = (seed % 233280) / 233280;

  return Math.floor(min + random * (max - min));
}