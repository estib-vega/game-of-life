export function isStr(something: unknown): something is string {
  return typeof something === "string";
}