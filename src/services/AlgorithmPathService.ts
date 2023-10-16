import type { AlgorithmPath, Condition, HashiAlgorithm, Selector } from '@/stores/HashiAlgorithm';
import { type Rule } from '../stores/HashiAlgorithm';

export class AlgorithmPathService {
  public getComponent(algo: HashiAlgorithm, path: AlgorithmPath): unknown {
    const rule = this.getRule(algo, path);

    if (path.selectorIndex != null) {
      const selector = rule.selectorSequence[path.selectorIndex];

      if (path.conditionIndex != null) {
        const condition = selector.conditions[path.conditionIndex];

        if (path.termIndex != null) {
          const term = path.termIndex === 0 ? condition.lhs : condition.rhs;

          return term;
        }

        return condition;
      }

      return selector;
    }

    return rule;
  }

  private getRule(algo: HashiAlgorithm, path: AlgorithmPath): Rule {
    return algo.rules[path.ruleIndex];
  }
}

export function getAncestorCondition(algo: HashiAlgorithm, path: AlgorithmPath): Condition {
  if (path.selectorIndex == null || path.conditionIndex == null) throw new Error();
  const selector = algo.rules[path.ruleIndex].selectorSequence[path.selectorIndex];
  return selector.conditions[path.conditionIndex];
}

export function getAncestorSelector(algo: HashiAlgorithm, path: AlgorithmPath): Selector {
  if (path.selectorIndex == null) throw new Error();
  return algo.rules[path.ruleIndex].selectorSequence[path.selectorIndex];
}

export function pathAppendSelector(path: AlgorithmPath, selectorIndex: number): AlgorithmPath {
  return {
    ...path,
    selectorIndex: selectorIndex
  };
}

export function pathAppendCondition(path: AlgorithmPath, conditionIndex: number): AlgorithmPath {
  return {
    ...path,
    conditionIndex: conditionIndex
  };
}

export function pathAppendTerm(path: AlgorithmPath, termIndex: number): AlgorithmPath {
  return {
    ...path,
    termIndex: termIndex
  };
}
