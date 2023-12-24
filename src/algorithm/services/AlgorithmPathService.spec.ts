import { expect, test, beforeEach } from 'vitest';
import {
  createPathToRule,
  getComponent,
  pathAppend,
  pathSelectorAndAppend,
  setComponent
} from './AlgorithmPathService';
import type {
  AlgorithmPath,
  HashiAlgorithm,
  PlusTerm,
  Selector,
  SumTerm,
  Term
} from '@/algorithm/stores/HashiAlgorithm';

const algorithmTemplate: HashiAlgorithm = {
  rules: [
    {
      selectorSequence: [
        {
          kind: 'edge',
          conditions: []
        }
      ],
      action: { kind: 'addEdge' }
    },
    {
      selectorSequence: [
        {
          kind: 'vertex',
          conditions: [
            {
              lhs: { kind: 'propertyAccess', property: 'degree' },
              operator: 'lt',
              rhs: { kind: 'propertyAccess', property: 'targetDegree' }
            }
          ]
        },
        {
          kind: 'edge',
          conditions: [
            {
              lhs: { kind: 'propertyAccess', property: 'multiplicity' },
              operator: 'lt',
              rhs: { kind: 'constant', value: 2 }
            }
          ]
        }
      ],
      action: { kind: 'addEdge' }
    },
    {
      selectorSequence: [
        {
          kind: 'vertex',
          conditions: [
            {
              lhs: {
                kind: 'sum',
                over: { kind: 'edge', conditions: [] },
                what: { kind: 'constant', value: 1 }
              },
              operator: 'eq',
              rhs: {
                kind: 'plus',
                lhs: { kind: 'constant', value: 10 },
                rhs: { kind: 'constant', value: 11 }
              }
            }
          ]
        }
      ],
      action: { kind: 'addEdge' }
    }
  ]
};

let algorithm: HashiAlgorithm;
beforeEach(() => {
  algorithm = JSON.parse(JSON.stringify(algorithmTemplate));
});

test('toSumParts', () => {
  const path: AlgorithmPath = pathAppend(
    pathAppend(pathAppend(pathSelectorAndAppend(createPathToRule(2), 0), 0), 0),
    0
  );
  expect(getComponent(algorithm, path)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].lhs as SumTerm).over
  );

  const path2: AlgorithmPath = pathAppend(
    pathAppend(pathAppend(pathSelectorAndAppend(createPathToRule(2), 0), 0), 0),
    1
  );
  expect(getComponent(algorithm, path2)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].lhs as SumTerm).what
  );
});

test('toPlusParts', () => {
  const path: AlgorithmPath = pathAppend(
    pathAppend(pathAppend(pathSelectorAndAppend(createPathToRule(2), 0), 0), 1),
    0
  );
  expect(getComponent(algorithm, path)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].rhs as PlusTerm).lhs
  );

  const path2: AlgorithmPath = pathAppend(
    pathAppend(pathAppend(pathSelectorAndAppend(createPathToRule(2), 0), 0), 1),
    1
  );
  expect(getComponent(algorithm, path2)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].rhs as PlusTerm).rhs
  );
});

test('setPlusParts', () => {
  const newTerm: Term = { kind: 'constant', value: 42 };
  const path: AlgorithmPath = pathAppend(
    pathAppend(pathAppend(pathSelectorAndAppend(createPathToRule(2), 0), 0), 1),
    0
  );
  setComponent(algorithm, path, newTerm);

  expect((algorithm.rules[2].selectorSequence[0].conditions[0].rhs as PlusTerm).lhs).toBe(newTerm);
});

test('toRule', () => {
  const path: AlgorithmPath = createPathToRule(1);
  expect(getComponent(algorithm, path)).toEqual(algorithm.rules[1]);
});

test('toSelector', () => {
  const path: AlgorithmPath = pathSelectorAndAppend(createPathToRule(1), 0);
  expect(getComponent(algorithm, path)).toEqual(algorithm.rules[1].selectorSequence[0]);
});

test('toSelectorCondition', () => {
  const path: AlgorithmPath = pathAppend(pathSelectorAndAppend(createPathToRule(1), 1), 0);
  expect(getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0]
  );
});

test('toSelectorConditionTerm', () => {
  const path: AlgorithmPath = pathAppend(
    pathAppend(pathSelectorAndAppend(createPathToRule(1), 1), 0),
    0
  );
  expect(getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].lhs
  );

  const path2: AlgorithmPath = pathAppend(
    pathAppend(pathSelectorAndAppend(createPathToRule(1), 1), 0),
    1
  );
  expect(getComponent(algorithm, path2)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].rhs
  );
});

test('setSelector', () => {
  const path: AlgorithmPath = pathSelectorAndAppend(createPathToRule(1), 1);
  const newSelector: Selector = { kind: 'edge', conditions: [] };
  setComponent(algorithm, path, newSelector);

  expect(algorithm.rules[1].selectorSequence[1]).toBe(newSelector);
});

test('setConditionConditionTerm', () => {
  const path: AlgorithmPath = pathAppend(
    pathAppend(pathSelectorAndAppend(createPathToRule(1), 1), 0),
    0
  );

  const newTerm: Term = { kind: 'constant', value: 42 };
  setComponent(algorithm, path, newTerm);

  expect(algorithm.rules[1].selectorSequence[1].conditions[0].lhs).toBe(newTerm);
});
