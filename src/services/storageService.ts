import { useHashiStore, type Hashi } from '@/hashi/stores/hashi';
import type { HashiAlgorithm } from './../algorithm/stores/HashiAlgorithm';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';

const HashiKey = 'hashi';
const AlgorithmKey = 'algorithm';

export function SaveObject(object: unknown, name: string): void {
  const value = JSON.stringify(object);
  localStorage.setItem(name, value);
}

export function LoadObject(name: string): unknown | null {
  const value = localStorage.getItem(name);
  if (value == null) return null;
  const object = JSON.parse(value);
  return object;
}

export function LoadAlgorithm(): HashiAlgorithm | null {
  const algorithm = LoadObject(AlgorithmKey) as HashiAlgorithm;
  return algorithm;
}

export function SaveAlgorithm(algorithm: HashiAlgorithm): void {
  SaveObject(algorithm, AlgorithmKey);
}

export function SaveAll(): void {
  console.log('SaveAll');
  const hashiAlgorithmStore = useHashiAlgorithmStore();
  const hashiStore = useHashiStore();

  const algorithm = extractAlgorithm(hashiAlgorithmStore);
  SaveObject(algorithm, AlgorithmKey);

  const hashi = extractHashi(hashiStore);
  SaveObject(hashi, HashiKey);
}

export function LoadAll(): void {
  console.log('LoadAll');
  const hashiAlgorithmStore = useHashiAlgorithmStore();
  const hashiStore = useHashiStore();

  const algorithm = LoadAlgorithm();
  if (algorithm == null) {
    alert('algorithm not found');
  } else {
    hashiAlgorithmStore.$patch(algorithm);
  }

  const hashi = LoadObject(HashiKey) as Hashi;
  if (hashi != null) {
    hashiStore.$patch(hashi);
  } else {
    console.log('hashi not found');
    if (algorithm != null) {
      alert('hashi not found');
    }
  }
}

export function CanLoad(): boolean {
  return localStorage.getItem(AlgorithmKey) != null && localStorage.getItem(HashiKey) != null;
}

const extractAlgorithm = extract<HashiAlgorithm>({
  name: true,
  rules: true,
  disabledRules: true
});

export const extractHashi = extract<Hashi>({
  edges: true,
  vertices: true
});

function extract<T>(properties: Record<keyof T, true>) {
  return function <TActual extends T>(value: TActual) {
    const result = {} as T;
    for (const property of Object.keys(properties) as Array<keyof T>) {
      result[property] = value[property];
    }
    return result;
  };
}
