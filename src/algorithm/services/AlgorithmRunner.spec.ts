import { useAlgorithmRunnerStore, type RunState } from './../stores/AlgorithmRunnerStore';
import { describe, expect, test } from 'vitest';
import { AlgorithmRunner } from './AlgorithmRunner';
import { type Edge, type Hashi } from '@/hashi/stores/hashi';
import { type HashiAlgorithm } from '@/algorithm/stores/HashiAlgorithm';
import { createPinia, setActivePinia } from 'pinia';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import {
  Need2Bridges,
  NeedAtLeastOneBridge,
  NeedAtLeastOneBridgeMaxMulti,
  NeedMaxMultiplicity,
  NoPairIslandDouble,
  NoPairIslandSingle,
  SetMaxMultIfRemainingDegreeIs0,
  SetMaxMultIfRemainingDegreeIs1
} from '../stores/rules';
import { Levels } from '@/Title-Screen/services/levels';
import { runTillEnd } from './Rules.spec';

test('runs rule', () => {
  setActivePinia(createPinia());
  const runState: RunState = useAlgorithmRunnerStore();
  const algorithm: HashiAlgorithm = {
    name: '',
    disabledRules: [],
    rules: [
      {
        name: '',
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

  const runner = new AlgorithmRunner(algorithm, new HashiUtil(hashi));
  const ok = runner.runStep();
  expect(ok).toBe(true);
  const expectedEdge: Edge = {
    v1: 0,
    v2: 1,
    multiplicity: 1
  };
  expect(hashi.edges).toStrictEqual([expectedEdge]);

  expect(runState.activeRule).toBe(0);
});

test('runStep retuns false if nothing executed', () => {
  setActivePinia(createPinia());
  const algorithm: HashiAlgorithm = {
    name: 'algo',
    disabledRules: [],
    rules: [
      {
        name: 'rule 1',
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

  const runner = new AlgorithmRunner(algorithm, new HashiUtil(hashi));
  const ok = runner.runStep();
  expect(ok).toBe(false);
  hashi.edges.forEach((edge) => expect(edge.multiplicity).toBe(0));
});

test('runStep switches to next rule if nothing executed', () => {
  setActivePinia(createPinia());
  const runState: RunState = useAlgorithmRunnerStore();
  const algorithm: HashiAlgorithm = {
    name: 'algo',
    disabledRules: [],
    rules: [
      {
        name: 'rule 1',
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
        name: 'rule 2',
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

  const runner = new AlgorithmRunner(algorithm, new HashiUtil(hashi));
  const ok = runner.runStep();
  expect(ok).toBe(true);
  const expectedEdge: Edge = {
    v1: 0,
    v2: 1,
    multiplicity: 1
  };
  expect(hashi.edges).toStrictEqual([expectedEdge]);

  expect(runState.activeRule).toBe(1);
});

function canSolve(algo: HashiAlgorithm, hashi: HashiUtil): boolean {
  const finalHashi = runTillEnd(hashi.wrappedItem, algo);

  const solved = new HashiUtil(finalHashi).IsSolved();
  return solved;
}

function testAlgo(algo: HashiAlgorithm, expectedToSolve: number[]): void {
  for (const lv of Levels) {
    const lvHashi = lv.load();
    const expected = expectedToSolve.includes(lv.number);

    test((expected ? 'can' : 'cannot') + ' solve ' + lv.title, () => {
      const solved = canSolve(algo, lvHashi);
      expect(solved).toEqual(expected);
    });
  }
}

describe('needsBridgesAlgo', () => {
  const needsBridgesAlgo: HashiAlgorithm = {
    name: 'needsBridgesAlgo',
    rules: [NeedAtLeastOneBridge, Need2Bridges],
    disabledRules: []
  };
  const expectedToSolve: number[] = [1, 2];

  testAlgo(needsBridgesAlgo, expectedToSolve);
});

describe('maxMultiplicityAlgo', () => {
  const maxMultiplicityAlgo: HashiAlgorithm = {
    name: 'maxMultiplicityAlgo',
    rules: [
      NeedMaxMultiplicity,
      NeedAtLeastOneBridgeMaxMulti,
      SetMaxMultIfRemainingDegreeIs0,
      SetMaxMultIfRemainingDegreeIs1
    ],
    disabledRules: []
  };
  const expectedToSolve: number[] = [1, 2, 3, 4, 5];

  testAlgo(maxMultiplicityAlgo, expectedToSolve);
});

describe('maxMultiplicityWithoutPairIslandAlgo', () => {
  const maxMultiplicityAlgo: HashiAlgorithm = {
    name: 'maxMultiplicityWithoutPairIslandAlgo',
    rules: [
      NeedMaxMultiplicity,
      NeedAtLeastOneBridgeMaxMulti,
      SetMaxMultIfRemainingDegreeIs0,
      SetMaxMultIfRemainingDegreeIs1,
      NoPairIslandSingle,
      NoPairIslandDouble
    ],
    disabledRules: []
  };
  const expectedToSolve: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  testAlgo(maxMultiplicityAlgo, expectedToSolve);
});
