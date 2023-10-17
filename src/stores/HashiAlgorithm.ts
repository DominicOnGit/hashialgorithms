import { AlgorithmPathService, getAncestorCondition } from '@/services/AlgorithmPathService';
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
            },
            {
              lhs: { kind: 'propertyAccess', property: 'multiplicity' },
              operator: 'le',
              rhs: { kind: 'constant', value: 2 }
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
  },
  actions: {
    changeSelectorKind(pathToSelector: AlgorithmPath, kind: Selector['kind']): void {
      console.log('changeSelectorKind', kind, pathToSelector);
      const pathService = new AlgorithmPathService();
      const selector = pathService.getComponent(this, pathToSelector) as Selector;
      selector.kind = kind;
    },

    changeConditionOperator(pathToCondition: AlgorithmPath, operator: Condition['operator']): void {
      console.log('changeConditionOperator', operator, pathToCondition);
      const pathService = new AlgorithmPathService();
      const condition = pathService.getComponent(this, pathToCondition) as Condition;
      condition.operator = operator;
    },

    changeTerm(pathToTerm: AlgorithmPath, newTerm: Term): void {
      console.log('changeTerm', newTerm, pathToTerm);
      if (pathToTerm.termIndex == null) throw new Error();

      const condition = getAncestorCondition(this, pathToTerm);
      if (pathToTerm.termIndex === 0) condition.lhs = newTerm;
      else condition.rhs = newTerm;
    }
  }
});

export interface AlgorithmPath {
  ruleIndex: number;
  selectorIndex?: number;
  conditionIndex?: number;
  termIndex?: number;
}
