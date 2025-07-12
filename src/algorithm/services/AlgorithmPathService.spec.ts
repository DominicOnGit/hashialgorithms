import { expect, test, beforeEach } from 'vitest';
import {
  createPathToRule,
  deleteComponent,
  extendTermPath,
  getComponent,
  selectCondition,
  selectConditionPart,
  selectConditionPartTerm,
  selectSelector,
  setComponent
} from './AlgorithmPathService';
import type {
  Condition,
  HashiAlgorithm,
  PlusTerm,
  Rule,
  Selector,
  SumTerm,
  Term
} from '@/algorithm/stores/HashiAlgorithm';
import type { AlgorithmPath } from '../stores/AlgorithmPath';
import { buildEmptyRule } from '../stores/HashiAlgorithmStore';

const algorithmTemplate: HashiAlgorithm = {
  name: 'Test Algorithm',
  disabledRules: [],
  rules: [
    {
      name: 'Rule 1',
      selectorSequence: [
        {
          kind: 'edge',
          conditions: []
        }
      ],
      action: { kind: 'addEdge' }
    },
    {
      name: 'Rule 2',
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
      name: 'Rule 3',
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
  const path: AlgorithmPath = selectConditionPartTerm(
    selectConditionPart(selectCondition(selectSelector(createPathToRule(2), 0), 0), 0),
    0
  );
  expect(getComponent(algorithm, path)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].lhs as SumTerm).over
  );

  const newSelector: Selector = { kind: 'vertex', conditions: [] };
  setComponent(algorithm, path, newSelector);
  expect(getComponent(algorithm, path)).toEqual(newSelector);

  const path2: AlgorithmPath = selectConditionPartTerm(
    selectConditionPart(selectCondition(selectSelector(createPathToRule(2), 0), 0), 0),
    1
  );
  expect(getComponent(algorithm, path2)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].lhs as SumTerm).what
  );
  const newTerm: Term = { kind: 'constant', value: 1 };
  setComponent(algorithm, path2, newTerm);
  expect(getComponent(algorithm, path2)).toEqual(newTerm);
});

test('toPlusParts', () => {
  const path: AlgorithmPath = selectConditionPartTerm(
    selectConditionPart(selectCondition(selectSelector(createPathToRule(2), 0), 0), 1),
    0
  );
  expect(getComponent(algorithm, path)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].rhs as PlusTerm).lhs
  );
  const newTerm: Term = { kind: 'constant', value: 1 };
  setComponent(algorithm, path, newTerm);
  expect(getComponent(algorithm, path)).toEqual(newTerm);

  const path2: AlgorithmPath = selectConditionPartTerm(
    selectConditionPart(selectCondition(selectSelector(createPathToRule(2), 0), 0), 1),
    1
  );
  expect(getComponent(algorithm, path2)).toEqual(
    (algorithm.rules[2].selectorSequence[0].conditions[0].rhs as PlusTerm).rhs
  );
  setComponent(algorithm, path2, newTerm);
  expect(getComponent(algorithm, path2)).toEqual(newTerm);
});

test('toRule', () => {
  const path: AlgorithmPath = createPathToRule(1);
  expect(getComponent(algorithm, path)).toEqual(algorithm.rules[1]);

  const newRule: Rule = buildEmptyRule(99);
  setComponent(algorithm, path, newRule);
  expect(getComponent(algorithm, path)).toEqual(newRule);
});

test('deleteRule', () => {
  const path: AlgorithmPath = createPathToRule(1);
  algorithm.disabledRules = [0, 1, 2];

  const expected: HashiAlgorithm = {
    name: algorithm.name,
    rules: [algorithm.rules[0], algorithm.rules[2]],
    disabledRules: [0, 1]
  };

  deleteComponent(algorithm, path);
  expect(algorithm).toEqual(expected);
});

test('deleteRule 2', () => {
  const path: AlgorithmPath = createPathToRule(0);
  algorithm.disabledRules = [0];

  const expected: HashiAlgorithm = {
    name: algorithm.name,
    rules: [algorithm.rules[1], algorithm.rules[2]],
    disabledRules: []
  };

  deleteComponent(algorithm, path);
  expect(algorithm).toEqual(expected);
});

test('toSelector', () => {
  const path: AlgorithmPath = selectSelector(createPathToRule(1), 0);
  expect(getComponent(algorithm, path)).toEqual(algorithm.rules[1].selectorSequence[0]);

  const newSelector: Selector = { kind: 'vertex', conditions: [] };
  setComponent(algorithm, path, newSelector);
  expect(getComponent(algorithm, path)).toEqual(newSelector);
});

test('delete selector', () => {
  const path: AlgorithmPath = selectSelector(createPathToRule(1), 0);
  const expectedSequence = [algorithm.rules[1].selectorSequence[1]];
  deleteComponent(algorithm, path);
  expect(algorithm.rules[1].selectorSequence).toEqual(expectedSequence);
});

test('toSelectorCondition', () => {
  const path: AlgorithmPath = selectCondition(selectSelector(createPathToRule(1), 1), 0);
  expect(getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0]
  );

  const term: Term = { kind: 'constant', value: 1 };
  const newCondition: Condition = { lhs: term, rhs: term, operator: 'eq' };
  setComponent(algorithm, path, newCondition);
  expect(getComponent(algorithm, path)).toEqual(newCondition);
});

test('delete condition', () => {
  const path: AlgorithmPath = selectCondition(selectSelector(createPathToRule(1), 1), 0);
  deleteComponent(algorithm, path);
  expect(algorithm.rules[1].selectorSequence[1].conditions).toEqual([]);
});

test('toSelectorConditionPart', () => {
  const path: AlgorithmPath = selectConditionPart(
    selectCondition(selectSelector(createPathToRule(1), 1), 0),
    0
  );
  expect(getComponent(algorithm, path)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].lhs
  );
  const term: Term = { kind: 'constant', value: 1 };
  setComponent(algorithm, path, term);
  expect(getComponent(algorithm, path)).toEqual(term);

  const path2: AlgorithmPath = selectConditionPart(
    selectCondition(selectSelector(createPathToRule(1), 1), 0),
    1
  );
  expect(getComponent(algorithm, path2)).toEqual(
    algorithm.rules[1].selectorSequence[1].conditions[0].rhs
  );
  setComponent(algorithm, path2, term);
  expect(getComponent(algorithm, path2)).toEqual(term);
});

test('sum in plus', () => {
  const sum: Term = {
    kind: 'sum',
    over: { kind: 'edge', conditions: [] },
    what: { kind: 'constant', value: 3 }
  };
  const cond: Condition = {
    lhs: { kind: 'constant', value: 1 },
    operator: 'eq',
    rhs: { kind: 'plus', lhs: { kind: 'constant', value: 2 }, rhs: sum }
  };
  const algoOrig: HashiAlgorithm = {
    name: 'Test Algorithm',
    disabledRules: [],
    rules: [
      {
        name: 'Rule 1',
        selectorSequence: [
          {
            kind: 'vertex',
            conditions: [cond]
          }
        ],
        action: { kind: 'addEdge' }
      }
    ]
  };

  const algo = JSON.parse(JSON.stringify(algoOrig));

  const pathToCond = selectCondition(selectSelector(createPathToRule(0), 0), 0);
  expect(getComponent(algo, pathToCond)).toEqual(cond);

  const pathToPlus = selectConditionPart(pathToCond, 1);
  expect(getComponent(algo, pathToPlus)).toEqual(cond.rhs);

  const pathToSum = selectConditionPartTerm(pathToPlus, 1);
  expect(getComponent(algo, pathToSum)).toEqual(sum);

  const pathToOver = extendTermPath(pathToSum, 0);
  expect(getComponent(algo, pathToOver)).toEqual(sum.over);

  const pathToWhat = extendTermPath(pathToSum, 1);
  expect(getComponent(algo, pathToWhat)).toEqual(sum.what);

  const newTerm: Term = { kind: 'constant', value: 42 };
  setComponent(algo, pathToWhat, newTerm);

  ((algoOrig.rules[0].selectorSequence[0].conditions[0].rhs as PlusTerm).rhs as SumTerm).what =
    newTerm;
  expect(algo).toEqual(algoOrig);
});
