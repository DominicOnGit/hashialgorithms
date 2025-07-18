import { empty } from '@/hashi/services/HashiSamples';
import { UiActionLogger } from '@/services/logging';
import { defineStore } from 'pinia';

export interface Vertex {
  posX: number; // start at 1
  posY: number; // start at 1

  targetDegree: number;
}

export interface Edge {
  v1: number;

  // v1 < v2
  v2: number;

  multiplicity: number;

  customPropertyValues?: Record<string, number>;
}

export interface Hashi {
  // i < j =>  (vi.posY == vj.posY => vi.posX < vj.posX)  && (vi.posX == vj.posX => vi.posY < vj.posY)
  vertices: Vertex[];

  // v1.posX == v2.posX => v1.posY < v2.posY
  // v1.posY == v2.posY => v1.posX < v2.posX
  edges: Edge[];
}

export const useHashiStore = defineStore('hashi', {
  state: (): Hashi => {
    return empty();
  },
  actions: {
    setHashi(hashi: Hashi): void {
      UiActionLogger.info(`setHashi()`, hashi);
      this.$patch(hashi);
    }
  }
});

export function validateHashi(hashi: Hashi): void {
  for (let i = 0; i < hashi.vertices.length - 1; i++) {
    const vi = hashi.vertices[i];
    const vj = hashi.vertices[i + 1];
    if (
      (vi.posY === vj.posY && vi.posX >= vj.posX) ||
      (vi.posX === vj.posX && vi.posY >= vj.posY)
    ) {
      throw new Error('Unsorted vertices');
    }
  }

  hashi.edges.forEach((e) => {
    if (e.v1 < 0 || e.v2 < 0 || e.v1 >= hashi.vertices.length || e.v2 >= hashi.vertices.length) {
      throw new Error('Vertex index out of bounds');
    }
    if (e.v1 === e.v2) {
      throw new Error('self edge');
    }
    if (e.v1 > e.v2) {
      throw new Error('unordered edge');
    }

    if (
      hashi.vertices[e.v1].posX !== hashi.vertices[e.v2].posX &&
      hashi.vertices[e.v1].posY !== hashi.vertices[e.v2].posY
    )
      throw new Error('not rectangular');
  });
}
