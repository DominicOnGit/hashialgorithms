import { toRaw } from 'vue';

export function removeProxy<T>(reactiveObject: T): T {
  return toRaw(reactiveObject);
}
