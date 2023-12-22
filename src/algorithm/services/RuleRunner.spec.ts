import { expect, test } from 'vitest';
import { useHashiStore, type Edge, type Hashi } from '@/hashi/stores/hashi';
import { type Rule } from '@/algorithm/stores/HashiAlgorithm';
import { RuleRunner } from './RuleRunner';
import { HashiUtil } from '../../hashi/services/HashiUtil';
import { setActivePinia, createPinia } from 'pinia';

test('runs rule', () => {
  const rule: Rule = {
    selectorSequence: [
      {
        kind: 'edge',
        conditions: []
      }
    ],
    action: { kind: 'addEdge' }
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  };
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  const runner = new RuleRunner(rule, new HashiUtil(hashi));
  const ok = runner.runRuleStep();
  expect(ok).toBe(true);
  const expectedEdge: Edge = {
    v1: 0,
    v2: 1,
    multiplicity: 1
  };
  expect(hashiStore.edges).toStrictEqual([expectedEdge]);
});

test('runStep retuns false if nothing selected', () => {
  const rule: Rule = {
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
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  };
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  const runner = new RuleRunner(rule, new HashiUtil(hashi));
  const ok = runner.runRuleStep();
  expect(ok).toBe(false);
  expect(hashiStore.edges).toStrictEqual([]);
});

test('runStep retuns false if nothing selected', () => {
  const rule: Rule = {
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
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  };
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  const runner = new RuleRunner(rule, new HashiUtil(hashi));
  const ok = runner.runRuleStep();
  expect(ok).toBe(false);
  expect(hashiStore.edges).toStrictEqual([]);
});

test('runs action on selected ancestor', () => {
  const rule: Rule = {
    selectorSequence: [
      {
        kind: 'edge',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'multiplicity' },
            operator: 'lt',
            rhs: { kind: 'constant', value: 2 }
          }
        ]
      },
      {
        kind: 'vertex',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'degree' },
            operator: 'lt',
            rhs: { kind: 'propertyAccess', property: 'targetDegree' }
          },
          {
            lhs: {
              kind: 'sum',
              over: { kind: 'edge', excludeAncestor: true, conditions: [] },
              what: { kind: 'constant', value: 2 }
            },
            operator: 'lt',
            rhs: { kind: 'propertyAccess', property: 'targetDegree' }
          }
        ]
      }
    ],
    action: { kind: 'addEdge' }
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 2 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 1, posY: 3, targetDegree: 1 }
    ],
    edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
  };
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  const runner = new RuleRunner(rule, new HashiUtil(hashi));
  const ok = runner.runRuleStep();
  expect(ok).toBe(true);
  expect(hashiStore.edges).toStrictEqual([
    { v1: 0, v2: 1, multiplicity: 2 },
    { v1: 1, v2: 2, multiplicity: 1 }
  ]);
});

test('getRuleState', () => {
  const rule: Rule = {
    selectorSequence: [
      {
        kind: 'vertex',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'targetDegree' },
            operator: 'eq',
            rhs: { kind: 'constant', value: 2 }
          }
        ]
      }
    ],
    action: { kind: 'addEdge' }
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 2 }
    ],
    edges: []
  };

  const runner = new RuleRunner(rule, new HashiUtil(hashi));
  const actual = runner.getRuleState();
  expect(actual).toBe('matching');

  hashi.vertices[1].targetDegree = 1;
  const runner2 = new RuleRunner(rule, new HashiUtil(hashi));
  const actual2 = runner2.getRuleState();
  expect(actual2).toBe('noMatch');
});

test('getRuleState on empty rule', () => {
  const rule: Rule = {
    selectorSequence: [],
    action: { kind: 'addEdge' }
  };

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 2 }
    ],
    edges: []
  };

  const runner = new RuleRunner(rule, new HashiUtil(hashi));
  const actual = runner.getRuleState();
  expect(actual).toBe('noMatch');
});
