import { expect, test } from 'vitest';
import { createPathToRule, getComponent, pathAppend } from './AlgorithmPathService';
import type { AlgorithmPath, HashiAlgorithm } from '@/algorithm/stores/HashiAlgorithm';

const algorithm: HashiAlgorithm = {
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
              rhs: { kind: 'constant', value: 1 }
            }
          ]
        }
      ],
      action: { kind: 'addEdge' }
    }
  ]
};

test('toRule', () => {
  const path: AlgorithmPath = createPathToRule(1);
  expect(getComponent(algorithm, path)).toEqual(algorithm.rules[1]);
});

test('toSelector', () => {
  const path: AlgorithmPath = pathAppend(createPathToRule(1), 0);
  expect(getComponent(algorithm, path)).toEqual(algorithm.rules[1].selectorSequence[0]);
});

test('toSelectorCondition', () => {
  const path: AlgorithmPath = pathAppend(pathAppend(createPathToRule(1), 1), 0);
  expect(getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0]
  );
});

test('toSelectorCondition', () => {
  const path: AlgorithmPath = pathAppend(pathAppend(pathAppend(createPathToRule(1), 1), 0), 0);
  expect(getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].lhs
  );

  const path2: AlgorithmPath = pathAppend(pathAppend(pathAppend(createPathToRule(1), 1), 0), 1);
  expect(getComponent(algorithm, path2)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].rhs
  );
});
