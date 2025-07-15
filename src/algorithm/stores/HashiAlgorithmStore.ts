import { defineStore } from 'pinia';
import type {
  HashiAlgorithm,
  Condition,
  Selector,
  Term,
  Rule,
  SelectorKindAndExcludeAncestor,
  HashiAction
} from './HashiAlgorithm';
import {
  createPathToRule,
  deleteComponent,
  getComponent,
  setComponent
} from '@/algorithm/services/AlgorithmPathService';
import type { AlgorithmPath } from './AlgorithmPath';
import { UiActionLogger } from '@/services/logging';

const EmptyAlgorithm: HashiAlgorithm = {
  name: 'New Algorithm',
  disabledRules: [],
  rules: []
};

export function buildEmptyRule(index: number): Rule {
  return {
    name: `Rule ${index + 1}`,
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

export function isRuleEnabled(algo: HashiAlgorithm, ruleIndex: number): boolean {
  const isDisabled = algo.disabledRules != null && algo.disabledRules.includes(ruleIndex);
  return !isDisabled;
}

export const useHashiAlgorithmStore = defineStore('hashiAlgorithm', {
  state: (): HashiAlgorithm => {
    return EmptyAlgorithm;
  },
  actions: {
    changeSelectorKind(
      pathToSelector: AlgorithmPath,
      kindAndExcludeAncestor: SelectorKindAndExcludeAncestor
    ): void {
      UiActionLogger.info('changeSelectorKind', kindAndExcludeAncestor, pathToSelector);
      const selector = getComponent(this, pathToSelector) as Selector;
      selector.kind = kindAndExcludeAncestor.kind;
      selector.excludeAncestor = kindAndExcludeAncestor.excludeAncestor;
    },

    changeConditionOperator(pathToCondition: AlgorithmPath, operator: Condition['operator']): void {
      UiActionLogger.info('changeConditionOperator', operator, pathToCondition);
      const condition = getComponent(this, pathToCondition) as Condition;
      condition.operator = operator;
    },

    changeTerm(pathToTerm: AlgorithmPath, newTerm: Term): void {
      UiActionLogger.info('changeTerm', newTerm, pathToTerm);
      // if (pathToTerm.termIndex == null) throw new Error();

      setComponent(this, pathToTerm, newTerm);
    },

    newRule(): void {
      UiActionLogger.info('newRule');
      const rule = buildEmptyRule(this.rules.length);
      this.rules.push(rule);
      const pathToRule = createPathToRule(this.rules.length - 1);
      this.newSelector(pathToRule);
    },

    newSelector(pathToRule: AlgorithmPath): void {
      UiActionLogger.info('newSelector', pathToRule);
      const rule = getComponent(this, pathToRule) as Rule;
      let kind: Selector['kind'] = 'vertex';
      if (rule.selectorSequence.length > 0) {
        const lastSelector = rule.selectorSequence[rule.selectorSequence.length - 1];
        kind = lastSelector.kind === 'edge' ? 'vertex' : 'edge';
      }
      rule.selectorSequence.push(buildEmptySelector(kind));
    },

    deleteSelector(pathToSelector: AlgorithmPath): void {
      UiActionLogger.info('deleteSelector', pathToSelector);
      // if (pathToSelector.selectorIndex == null) throw new Error();
      deleteComponent(this, pathToSelector);
    },

    newCondition(pathToSelector: AlgorithmPath): void {
      UiActionLogger.info('newCondition', pathToSelector);
      const selector = getComponent(this, pathToSelector) as Selector;
      selector.conditions.push(buildEmptyCondition());
    },

    deleteCondition(pathToCondition: AlgorithmPath): void {
      UiActionLogger.info('deleteCondition', pathToCondition);
      deleteComponent(this, pathToCondition);
    },

    changeAction(pathToAction: AlgorithmPath, newAction: HashiAction): void {
      UiActionLogger.info('changeAction', pathToAction, newAction);
      setComponent(this, pathToAction, newAction);
    },

    deleteRule(pathToRule: AlgorithmPath): void {
      UiActionLogger.info('deleteRule', pathToRule);
      deleteComponent(this, pathToRule);
    },

    enableRule(ruleIndex: number): void {
      this.disabledRules = this.disabledRules.filter((x) => x !== ruleIndex);
    },
    disableRule(ruleIndex: number): void {
      if (!this.disabledRules.includes(ruleIndex)) {
        this.disabledRules.push(ruleIndex);
      }
    }
  }
});
