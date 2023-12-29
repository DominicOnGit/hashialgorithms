export function removeProxy<T>(reactiveObject: T): T {
  const clone = JSON.parse(JSON.stringify(reactiveObject));
  return clone;
}
