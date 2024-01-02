import { useAlgorithmRunnerStore, type RunState } from './../stores/AlgorithmRunnerStore';
import { expect, test } from 'vitest';
import { AlgorithmRunner } from './AlgorithmRunner';
import { useHashiStore, type Edge, type Hashi } from '@/hashi/stores/hashi';
import { type HashiAlgorithm } from '@/algorithm/stores/HashiAlgorithm';
import { createPinia, setActivePinia } from 'pinia';

test('runs rule', () => {
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  const runState: RunState = useAlgorithmRunnerStore();
  const algorithm: HashiAlgorithm = {
    disabledRules: [],
    rules: [
      {
        selectorSequence: [
          {
            kind: 'edge',
            conditions: []
          }
        ],
        action: { kind: 'addEdge' }
      }
    ]
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  };
  hashiStore.setHashi(hashi);

  const runner = new AlgorithmRunner(algorithm, hashi);
  const ok = runner.runStep();
  expect(ok).toBe(true);
  const expectedEdge: Edge = {
    v1: 0,
    v2: 1,
    multiplicity: 1
  };
  expect(hashiStore.edges).toStrictEqual([expectedEdge]);

  expect(runState.activeRule).toBe(0);
});

test('runStep retuns false if nothing executed', () => {
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  const algorithm: HashiAlgorithm = {
    disabledRules: [],
    rules: [
      {
        selectorSequence: [
          {
            kind: 'edge',
            conditions: [
              {
                lhs: { kind: 'propertyAccess', property: 'multiplicity' },
                operator: 'eq',
                rhs: { kind: 'constant', value: 3 }
              }
            ]
          }
        ],
        action: { kind: 'addEdge' }
      }
    ]
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  };
  hashiStore.setHashi(hashi);

  const runner = new AlgorithmRunner(algorithm, hashi);
  const ok = runner.runStep();
  expect(ok).toBe(false);
  expect(hashiStore.edges).toStrictEqual([]);
});

test('runStep switches to next rule if nothing executed', () => {
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  const runState: RunState = useAlgorithmRunnerStore();
  const algorithm: HashiAlgorithm = {
    disabledRules: [],
    rules: [
      {
        selectorSequence: [
          {
            kind: 'edge',
            conditions: [
              {
                lhs: { kind: 'propertyAccess', property: 'multiplicity' },
                operator: 'eq',
                rhs: { kind: 'constant', value: 3 }
              }
            ]
          }
        ],
        action: { kind: 'addEdge' }
      },
      {
        selectorSequence: [
          {
            kind: 'edge',
            conditions: []
          }
        ],
        action: { kind: 'addEdge' }
      }
    ]
  };
  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  };
  hashiStore.setHashi(hashi);

  const runner = new AlgorithmRunner(algorithm, hashi);
  const ok = runner.runStep();
  expect(ok).toBe(true);
  const expectedEdge: Edge = {
    v1: 0,
    v2: 1,
    multiplicity: 1
  };
  expect(hashiStore.edges).toStrictEqual([expectedEdge]);

  expect(runState.activeRule).toBe(1);
});
