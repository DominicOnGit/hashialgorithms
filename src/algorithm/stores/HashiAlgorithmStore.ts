import { defineStore } from 'pinia';
import type {
  HashiAlgorithm,
  Condition,
  Selector,
  AlgorithmPath,
  Term,
  Rule,
  SelectorKindAndExcludeAncestor,
  HashiAction
} from './HashiAlgorithm';
import {
  deleteComponent,
  getComponent,
  setComponent
} from '@/algorithm/services/AlgorithmPathService';

export const TestAlgorithm: HashiAlgorithm = {
  rules: [
    {
      name: 'set maxMultiplicity',
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
      action: {
        kind: 'setProperty',
        property: 'maxMultiplicity',
        value: { kind: 'constant', value: 1 }
      }
    },
    {
      name: 'add edge',
      selectorSequence: [],
      action: {
        kind: 'addEdge'
      }
    }
  ]
};

function buildEmptyRule(): Rule {
  return {
    selectorSequence: [],
    action: { kind: 'addEdge' }
  };
}
function buildEmptyCondition(): Condition {
  return {
    lhs: { kind: 'constant', value: 0 },
    operator: 'eq',
    rhs: { kind: 'constant', value: 0 }
  };
}

function buildEmptySelector(kind: Selector['kind']): Selector {
  return { kind: kind, excludeAncestor: false, conditions: [] };
}

export const useHashiAlgorithmStore = defineStore('hashiAlgorithm', {
  state: (): HashiAlgorithm => {
    return TestAlgorithm;
  },
  actions: {
    changeSelectorKind(
      pathToSelector: AlgorithmPath,
      kindAndExcludeAncestor: SelectorKindAndExcludeAncestor
    ): void {
      console.log('changeSelectorKind', kindAndExcludeAncestor, pathToSelector);
      const selector = getComponent(this, pathToSelector) as Selector;
      console.log(selector);
      selector.kind = kindAndExcludeAncestor.kind;
      selector.excludeAncestor = kindAndExcludeAncestor.excludeAncestor;
    },

    changeConditionOperator(pathToCondition: AlgorithmPath, operator: Condition['operator']): void {
      console.log('changeConditionOperator', operator, pathToCondition);
      const condition = getComponent(this, pathToCondition) as Condition;
      condition.operator = operator;
    },

    changeTerm(pathToTerm: AlgorithmPath, newTerm: Term): void {
      console.log('changeTerm', newTerm, pathToTerm);
      // if (pathToTerm.termIndex == null) throw new Error();

      setComponent(this, pathToTerm, newTerm);
    },

    newRule(): void {
      console.log('newRule');
      const rule = buildEmptyRule();
      this.rules.push(rule);
    },

    newSelector(pathToRule: AlgorithmPath): void {
      console.log('newSelector', pathToRule);
      const rule = getComponent(this, pathToRule) as Rule;
      let kind: Selector['kind'] = 'vertex';
      if (rule.selectorSequence.length > 0) {
        const lastSelector = rule.selectorSequence[rule.selectorSequence.length - 1];
        kind = lastSelector.kind === 'edge' ? 'vertex' : 'edge';
      }
      rule.selectorSequence.push(buildEmptySelector(kind));
    },

    deleteSelector(pathToSelector: AlgorithmPath): void {
      console.log('deleteSelector', pathToSelector);
      // if (pathToSelector.selectorIndex == null) throw new Error();
      deleteComponent(this, pathToSelector);
    },

    newCondition(pathToSelector: AlgorithmPath): void {
      console.log('newCondition', pathToSelector);
      const selector = getComponent(this, pathToSelector) as Selector;
      selector.conditions.push(buildEmptyCondition());
    },

    deleteCondition(pathToCondition: AlgorithmPath): void {
      console.log('deleteCondition', pathToCondition);
      deleteComponent(this, pathToCondition);
    },

    changeAction(pathToAction: AlgorithmPath, newAction: HashiAction): void {
      console.log('changeAction', pathToAction, newAction);
      setComponent(this, pathToAction, newAction);
    }
  }
});
