export function paddWith<T>(arr: T[], value: T, n: number): T[] {
  return arr
    .concat(new Array(n).fill(value))
    .slice(0, n);
}