import type { HashiAlgorithm, Rule } from './HashiAlgorithm';

export const Need2Bridges: Rule = {
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
  name: 'Need2Bridges'
};

export const NeedMaxMultiplicity: Rule = {
  selectorSequence: [
    {
      kind: 'edge',
      excludeAncestor: false,
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'multiplicity' },
          operator: 'lt',
          rhs: {
            kind: 'custompropertyAccess',
            property: {
              name: 'maxMultiplicity',
              onVertex: false,
              initialValue: 2,
              color: 'blue'
            }
          }
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
            what: {
              kind: 'custompropertyAccess',
              property: {
                name: 'maxMultiplicity',
                onVertex: false,
                initialValue: 2,
                color: 'blue'
              }
            }
          }
        }
      ]
    }
  ],
  action: { kind: 'addEdge' },
  name: 'NeedMaxMultiplicity'
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
          operator: 'ge',
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

export const NeedAtLeastOneBridgeMaxMulti: Rule = {
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
          lhs: { kind: 'propertyAccess', property: 'targetDegree' },
          operator: 'gt',
          rhs: {
            kind: 'sum',
            over: { kind: 'edge', excludeAncestor: true, conditions: [] },
            what: {
              kind: 'custompropertyAccess',
              property: {
                name: 'maxMultiplicity',
                onVertex: false,
                initialValue: 2,
                color: 'blue'
              }
            }
          }
        }
      ]
    }
  ],
  action: { kind: 'addEdge' },
  name: 'NeedAtLeastOneBridgeMaxMulti'
};

export const SetMaxMultIfRemainingDegreeIs0: Rule = {
  selectorSequence: [
    {
      kind: 'vertex',
      excludeAncestor: false,
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'targetDegree' },
          operator: 'eq',
          rhs: { kind: 'propertyAccess', property: 'degree' }
        }
      ]
    },
    {
      kind: 'edge',
      excludeAncestor: false,
      conditions: [
        {
          lhs: {
            kind: 'custompropertyAccess',
            property: {
              name: 'maxMultiplicity',
              onVertex: false,
              initialValue: 2,
              color: 'blue'
            }
          },
          operator: 'gt',
          rhs: { kind: 'propertyAccess', property: 'multiplicity' }
        }
      ]
    }
  ],
  action: {
    kind: 'setProperty',
    property: 'maxMultiplicity',
    value: { kind: 'propertyAccess', property: 'multiplicity' }
  },
  name: 'SetMaxMultIfRemainingDegreeIs0'
};

export const SetMaxMultIfRemainingDegreeIs1: Rule = {
  selectorSequence: [
    {
      kind: 'vertex',
      excludeAncestor: false,
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'targetDegree' },
          operator: 'eq',
          rhs: {
            kind: 'plus',
            lhs: { kind: 'constant', value: 1 },
            rhs: {
              kind: 'sum',
              over: { kind: 'edge', conditions: [] },
              what: { kind: 'propertyAccess', property: 'multiplicity' }
            }
          }
        }
      ]
    },
    {
      kind: 'edge',
      excludeAncestor: false,
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'multiplicity' },
          operator: 'eq',
          rhs: { kind: 'constant', value: 0 }
        },
        {
          lhs: {
            kind: 'custompropertyAccess',
            property: { name: 'maxMultiplicity', onVertex: false, initialValue: 2, color: 'blue' }
          },
          operator: 'eq',
          rhs: { kind: 'constant', value: 2 }
        }
      ]
    }
  ],
  action: {
    kind: 'setProperty',
    property: 'maxMultiplicity',
    value: { kind: 'constant', value: 1 }
  },
  name: 'SetMaxMultIfRemainingDegreeIs1'
};

export const AllRulesAlgorithm: HashiAlgorithm = {
  rules: [
    Need2Bridges,
    NeedMaxMultiplicity,
    NeedAtLeastOneBridge,
    NeedAtLeastOneBridgeMaxMulti,
    SetMaxMultIfRemainingDegreeIs0,
    SetMaxMultIfRemainingDegreeIs1
  ]
};
