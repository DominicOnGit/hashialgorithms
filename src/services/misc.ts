import { toRaw } from 'vue';

export function removeProxy<T>(reactiveObject: T): T {
  return toRaw(reactiveObject);
}

export function assertNotNull<T>(
  value: T,
  message: string = 'Value should not be null or undefined'
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
