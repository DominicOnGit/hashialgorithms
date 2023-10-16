import type { AlgorithmPath, HashiAlgorithm } from '@/stores/HashiAlgorithm';
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

export function pathAppendSelector(path: AlgorithmPath, selectorIndex: number): AlgorithmPath {
  return {
    ...path,
    selectorIndex: selectorIndex
  };
}
