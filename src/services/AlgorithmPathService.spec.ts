import { expect, test } from 'vitest';
import { AlgorithmPathService } from './AlgorithmPathService';
import type { AlgorithmPath, HashiAlgorithm } from '@/stores/HashiAlgorithm';

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
  const path: AlgorithmPath = {
    ruleIndex: 1
  };

  const service = new AlgorithmPathService();

  expect(service.getComponent(algorithm, path)).toEqual(algorithm.rules[1]);
});

test('toSelector', () => {
  const path: AlgorithmPath = {
    ruleIndex: 1,
    selectorIndex: 0
  };

  const service = new AlgorithmPathService();

  expect(service.getComponent(algorithm, path)).toEqual(algorithm.rules[1].selectorSequence[0]);
});

test('toSelectorCondition', () => {
  const path: AlgorithmPath = {
    ruleIndex: 1,
    selectorIndex: 1,
    conditionIndex: 0
  };

  const service = new AlgorithmPathService();

  expect(service.getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0]
  );
});

test('toSelectorCondition', () => {
  const path: AlgorithmPath = {
    ruleIndex: 1,
    selectorIndex: 1,
    conditionIndex: 0,
    termIndex: 0
  };

  const service = new AlgorithmPathService();

  expect(service.getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].lhs
  );

  path.termIndex = 1;
  expect(service.getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].rhs
  );
});
