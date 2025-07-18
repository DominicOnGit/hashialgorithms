import { useHashiStore, type Hashi } from '@/hashi/stores/hashi';
import type { HashiAlgorithm } from './../algorithm/stores/HashiAlgorithm';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { UiActionLogger } from './logging';
import type { Progress } from '@/stores/ProgressStore';

const HashiKey = 'hashi';
const AlgorithmKey = 'algorithm';
const ProgressKey = 'progress';

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

export function LoadProgress(): Progress | null {
  return LoadObject(ProgressKey) as Progress;
}

export function SaveProgress(progress: Progress): void {
  SaveObject(progress, ProgressKey);
}

export function SaveAll(): void {
  UiActionLogger.info('SaveAll');
  const hashiAlgorithmStore = useHashiAlgorithmStore();
  const hashiStore = useHashiStore();

  const algorithm = extractAlgorithm(hashiAlgorithmStore);
  SaveObject(algorithm, AlgorithmKey);

  const hashi = extractHashi(hashiStore);
  SaveObject(hashi, HashiKey);
}

export function LoadAll(): void {
  UiActionLogger.info('LoadAll');
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
    UiActionLogger.error('hashi not found');
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
