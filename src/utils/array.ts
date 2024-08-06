export function paddWith<T>(arr: T[], value: T, n: number): T[] {
  if (n === arr.length) return arr;
  if (n < arr.length) return arr;
  return arr
    .concat(new Array(n).fill(value))
    .slice(0, n);
}