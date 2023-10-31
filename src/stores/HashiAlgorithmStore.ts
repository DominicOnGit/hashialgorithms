import { AlgorithmPathService, getAncestorRule } from '@/services/AlgorithmPathService';
import { defineStore } from 'pinia';
import type { HashiAlgorithm, Condition, Selector, AlgorithmPath, Term } from './HashiAlgorithm';

export const TestAlgorithm: HashiAlgorithm = {
  rules: [
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
              lhs: {
                kind: 'sum',
                over: { kind: 'vertex', conditions: [] },
                what: { kind: 'propertyAccess', property: 'targetDegree' }
              },
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

function buildEmptyCondition(): Condition {
  return {
    lhs: { kind: 'constant', value: 0 },
    operator: 'eq',
    rhs: { kind: 'constant', value: 0 }
  };
}

function buildEmptySelector(kind: Selector['kind']): Selector {
  return { kind: kind, conditions: [] };
}

export const useHashiAlgorithmStore = defineStore('hashiAlgorithm', {
  state: (): HashiAlgorithm => {
    return TestAlgorithm;
  },
  actions: {
    changeSelectorKind(pathToSelector: AlgorithmPath, kind: Selector['kind']): void {
      console.log('changeSelectorKind', kind, pathToSelector);
      const pathService = new AlgorithmPathService();
      const selector = pathService.getComponent(this, pathToSelector) as Selector;
      console.log(selector);
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

      const pathService = new AlgorithmPathService();
      pathService.setComponent(this, pathToTerm, newTerm);
    },

    newSelector(pathToRule: AlgorithmPath): void {
      console.log('newSelector', pathToRule);
      const rule = getAncestorRule(this, pathToRule);
      let kind: Selector['kind'] = 'vertex';
      if (rule.selectorSequence.length > 0) {
        const lastSelector = rule.selectorSequence[rule.selectorSequence.length - 1];
        kind = lastSelector.kind === 'edge' ? 'vertex' : 'edge';
      }
      rule.selectorSequence.push(buildEmptySelector(kind));
    },

    deleteSelector(pathToSelector: AlgorithmPath): void {
      console.log('deleteSelector', pathToSelector);
      if (pathToSelector.selectorIndex == null) throw new Error();
      const rule = getAncestorRule(this, pathToSelector);
      rule.selectorSequence.splice(pathToSelector.selectorIndex, 1);
    },

    newCondition(pathToSelector: AlgorithmPath): void {
      console.log('newCondition', pathToSelector);
      const selector = new AlgorithmPathService().getComponent(this, pathToSelector) as Selector;
      selector.conditions.push(buildEmptyCondition());
    },

    deleteCondition(pathToSelector: AlgorithmPath, conditionIndex: number): void {
      console.log('deleteCondition', pathToSelector, conditionIndex);
      const selector = new AlgorithmPathService().getComponent(this, pathToSelector) as Selector;
      selector.conditions.splice(conditionIndex, 1);
    }
  }
});
