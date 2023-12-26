import type { Rule } from './HashiAlgorithm';

export const NeedAllBridges: Rule = {
  selectorSequence: [
    {
      kind: 'edge',
      excludeAncestor: false,
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
      excludeAncestor: false,
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'targetDegree' },
          operator: 'eq',
          rhs: {
            kind: 'sum',
            over: { kind: 'edge', conditions: [] },
            what: { kind: 'constant', value: 2 }
          }
        }
      ]
    }
  ],
  action: { kind: 'addEdge' },
  name: 'NeedAllBridges'
};

export const NeedAtLeastOneBridge: Rule = {
  selectorSequence: [
    {
      kind: 'edge',
      excludeAncestor: false,
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'multiplicity' },
          operator: 'eq',
          rhs: { kind: 'constant', value: 0 }
        }
      ]
    },
    {
      kind: 'vertex',
      excludeAncestor: false,
      conditions: [
        {
          lhs: {
            kind: 'plus',
            lhs: { kind: 'propertyAccess', property: 'targetDegree' },
            rhs: { kind: 'constant', value: 1 }
          },
          operator: 'eq',
          rhs: {
            kind: 'sum',
            over: { kind: 'edge', conditions: [] },
            what: { kind: 'constant', value: 2 }
          }
        }
      ]
    }
  ],
  action: { kind: 'addEdge' },
  name: 'NeedAtLeastOneBridge'
};
