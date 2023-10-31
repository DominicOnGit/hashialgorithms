import type {
  AlgorithmPath,
  AlgorithmPiece,
  Condition,
  HashiAlgorithm,
  Selector,
  SumTerm,
  Term
} from '@/stores/HashiAlgorithm';
import { type Rule } from '../stores/HashiAlgorithm';

export class AlgorithmPathService {
  public getComponent(algo: HashiAlgorithm, path: AlgorithmPath): AlgorithmPiece {
    const rule = this.getRule(algo, path);

    if (path.selectorIndex != null) {
      const selector = rule.selectorSequence[path.selectorIndex];

      if (path.conditionIndex != null) {
        const condition = selector.conditions[path.conditionIndex];

        if (path.termIndex != null) {
          const term = path.termIndex === 0 ? condition.lhs : condition.rhs;

          if (path.termPath != null) {
            return this.getTermPart(term, path.termPath);
          }
          return term;
        }

        return condition;
      }

      return selector;
    }

    return rule;
  }

  public setComponent(algo: HashiAlgorithm, path: AlgorithmPath, newComponent: AlgorithmPiece): void {
    const parentPath = pathToParent(path);
    const parent = this.getComponent(algo, parentPath);

    if (path.termPath != null) {
      const parentTerm = parent as SumTerm;
      if (path.termPath.ruleIndex === 0) {
        parentTerm.over = newComponent as Selector;
      } else {
        parentTerm.what = newComponent as Term;
      }
    } else if (path.termIndex != null) {
      const parentCondition = parent as Condition;
      if (path.termIndex === 0) parentCondition.lhs = newComponent as Term;
      else parentCondition.rhs = newComponent as Term;
    } else if (path.conditionIndex != null) {
      throw new Error('not implemented');
    } else if (path.selectorIndex != null) {
      throw new Error('not implemented');
    } else {
      throw new Error();
    }
  }

  private getRule(algo: HashiAlgorithm, path: AlgorithmPath): Rule {
    return algo.rules[path.ruleIndex];
  }

  private getTermPart(term: Term, termPath: AlgorithmPath): Selector | Term {
    if (term.kind === 'sum') {
      const part = termPath.ruleIndex === 0 ? term.over : term.what;
      return part;
    } else throw new Error();
  }
}

export function pathToParent(path: AlgorithmPath): AlgorithmPath {
  if (path.termPath != null)
    return {
      ...path,
      termPath: undefined
    };
  if (path.termIndex != null) {
    return { ...path, termIndex: undefined };
  }
  throw new Error('not implemented');
}

export function getAncestorRule(algo: HashiAlgorithm, path: AlgorithmPath): Rule {
  return algo.rules[path.ruleIndex];
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

export function pathAppendSumPart(path: AlgorithmPath, sumPart: number): AlgorithmPath {
  return {
    ...path,
    termPath: { ruleIndex: sumPart }
  };
}
