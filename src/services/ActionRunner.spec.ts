import { expect, test } from 'vitest';
import { useHashiStore, type Hashi } from '@/stores/hashi';
import { type HashiAction } from '@/stores/HashiAlgorithm';
import { HashiUtil } from './HashiUtil';
import { setActivePinia, createPinia } from 'pinia';
import { ActionRunner } from './ActionRunner';

test('addEdge on on selected edge', () => {
  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 2 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 1, posY: 3, targetDegree: 1 }
    ],
    edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
  };
  const hashiUtil = new HashiUtil(hashi);
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  const action: HashiAction = { kind: 'addEdge' };

  const actionRunner = new ActionRunner(action, hashiUtil);

  actionRunner.run([hashiUtil.getEdge(1, 2)]);
  expect(hashiStore.edges).toStrictEqual([
    { v1: 0, v2: 1, multiplicity: 2 },
    { v1: 1, v2: 2, multiplicity: 1 }
  ]);
});

test('addEdge on on selected ancestor', () => {
  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 2 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 1, posY: 3, targetDegree: 1 }
    ],
    edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
  };
  const hashiUtil = new HashiUtil(hashi);
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  const action: HashiAction = { kind: 'addEdge' };

  const actionRunner = new ActionRunner(action, hashiUtil);

  actionRunner.run([hashiUtil.getEdge(1, 2), hashiUtil.vertices[2]]);
  expect(hashiStore.edges).toStrictEqual([
    { v1: 0, v2: 1, multiplicity: 2 },
    { v1: 1, v2: 2, multiplicity: 1 }
  ]);
});
