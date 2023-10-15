import { defineStore } from 'pinia';

export interface HashiAlgorithm {
  rules: Rule[];
}

export interface Rule {
  selectorSequence: Selector[];
  action: HashiAction;
}

export interface VertexSelector {
  kind: 'vertex';
  conditions: Condition[];
}

export interface EdgeSelector {
  kind: 'edge';
  conditions: Condition[];
}

export type Selector = VertexSelector | EdgeSelector;

export interface AddEdgeAction {
  kind: 'addEdge';
}

export type HashiAction = AddEdgeAction;

export interface Condition {
  lhs: Term;
  operator: 'lt' | 'le' | 'eq';
  rhs: Term;
}

export interface ProperyAccessTerm {
  kind: 'propertyAccess';
  property: 'multiplicity' | 'targetDegree' | 'degree';
}

export interface ConstantTerm {
  kind: 'constant';
  value: number;
}

export interface SumTerm {
  kind: 'sum';
  over: Selector;
  what: Term;
}

export type Term = ProperyAccessTerm | ConstantTerm | SumTerm;

export const TestAlgorithm: HashiAlgorithm = {
  rules: [
    {
      selectorSequence: [
        {
          kind: 'edge',
          conditions: [
            {
              lhs: { kind: 'propertyAccess', property: 'multiplicity' },
              operator: 'le',
              rhs: { kind: 'constant', value: 1 }
            }
          ]
        }
      ],
      action: { kind: 'addEdge' }
    }
  ]
};

export const useHashiAlgorithmStore = defineStore('hashiAlgorithm', {
  state: (): HashiAlgorithm => {
    return TestAlgorithm;
  }
});
