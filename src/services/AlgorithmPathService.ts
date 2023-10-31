import type {
  AlgorithmPath,
  AlgorithmPiece,
  Condition,
  HashiAlgorithm,
  Selector,
  Term
} from '@/stores/HashiAlgorithm';
import { type Rule } from '../stores/HashiAlgorithm';

// path: [ruleIndex, selectorIndex, conditionIndex, termIndex, termPart]
export function getComponent(algo: HashiAlgorithm, path: AlgorithmPath): AlgorithmPiece {
  if (path.length === 0) throw new Error();

  const rule = algo.rules[path[0]];
  if (path.length > 1) {
    const selector = rule.selectorSequence[path[1]];
    if (path.length > 2) {
      const condition = selector.conditions[path[2]];
      if (path.length > 3) {
        const term = path[3] === 0 ? condition.lhs : condition.rhs;
        if (path.length > 4) {
          return getTermPart(term, path.slice(4));
        }
        return term;
      }
      return condition;
    }
    return selector;
  }
  return rule;
}

export function setComponent(
  algo: HashiAlgorithm,
  path: AlgorithmPath,
  newComponent: AlgorithmPiece
): void {
  if (path.length === 0) throw new Error();

  if (path.length === 1) {
    algo.rules[path[0]] = newComponent as Rule;
    return;
  }
  const rule = algo.rules[path[0]];

  if (path.length === 2) {
    rule.selectorSequence[path[1]] = newComponent as Selector;
    return;
  }
  const selector = rule.selectorSequence[path[1]];

  if (path.length === 3) {
    selector.conditions[path[2]] = newComponent as Condition;
    return;
  }
  const condition = selector.conditions[path[2]];

  if (path.length === 4) {
    if (path[3] === 0) condition.lhs = newComponent as Term;
    else condition.rhs = newComponent as Term;
    return;
  }
  const term = path[3] === 0 ? condition.lhs : condition.rhs;

  setTermPart(term, path.slice(4), newComponent);
}

export function deleteComponent(algo: HashiAlgorithm, path: AlgorithmPath): void {
  if (path.length === 0) throw new Error();

  if (path.length === 1) {
    algo.rules.splice(path[0], 1);
    return;
  }
  const rule = algo.rules[path[0]];

  if (path.length === 2) {
    rule.selectorSequence.splice(path[1], 1);
    return;
  }
  const selector = rule.selectorSequence[path[1]];

  if (path.length === 3) {
    selector.conditions.splice(path[2], 1);
    return;
  }

  throw new Error();
}

function getTermPart(term: Term, termPath: AlgorithmPath): Selector | Term {
  if (term.kind === 'sum') {
    const part = termPath[0] === 0 ? term.over : term.what;
    return part;
  } else throw new Error();
}

function setTermPart(term: Term, termPath: AlgorithmPath, newComponent: AlgorithmPiece): void {
  if (term.kind === 'sum') {
    if (termPath[0] === 0) term.over = newComponent as Selector;
    else term.what = newComponent as Term;
  } else throw new Error();
}

export function pathToParent(path: AlgorithmPath): AlgorithmPath {
  if (path.length < 2) throw new Error();
  return path.slice(0, path.length - 1);
}

export function createPathToRule(ruleIndex: number): AlgorithmPath {
  return [ruleIndex];
}

export function pathAppend(path: AlgorithmPath, nextStep: number): AlgorithmPath {
  return [...path, nextStep];
}

export function getSelectorIndex(path: AlgorithmPath): number {
  if (path.length < 2) throw new Error();
  return path[1];
}

export function getAncestorSelector(algo: HashiAlgorithm, path: AlgorithmPath): Selector {
  if (path.length < 2) throw new Error();
  return getComponent(algo, path.slice(0, 2)) as Selector;
}
