import type {
  AlgorithmPath,
  AlgorithmPiece,
  Condition,
  HashiAction,
  HashiAlgorithm,
  Selector,
  Term
} from '@/algorithm/stores/HashiAlgorithm';
import { type Rule } from '../stores/HashiAlgorithm';

export function getComponent(algo: HashiAlgorithm, path: AlgorithmPath): AlgorithmPiece {
  const res = getComponent2(algo, path);
  console.debug('getComponent ', path, res);
  return res;
}

// path: [ruleIndex, selectorOrAction, ...]
export function getComponent2(algo: HashiAlgorithm, path: AlgorithmPath): AlgorithmPiece {
  if (path.length === 0) throw new Error();

  const rule = algo.rules[path[0]];
  if (rule == null) throw new Error();

  if (path.length > 1) {
    const res =
      path[1] === 0 ? getSelectorComponent(rule, path.slice(2)) : getActionComponent(rule, path);
    if (res == null) throw new Error();
    return res;
  }
  return rule;
}

// path: [ruleIndex, selectorOrAction, ...]
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

  if (path[1] === 0) {
    setSelectorComponent(rule, path.slice(2), newComponent);
  } else {
    setActionComponent(rule, path.slice(2), newComponent);
  }
}

// path:  [selectorIndex, conditionIndex, termIndex, termPart]
function getSelectorComponent(rule: Rule, path: AlgorithmPath): AlgorithmPiece {
  if (path.length === 0) throw new Error();

  const selector = rule.selectorSequence[path[0]];
  if (path.length > 1) {
    const condition = selector.conditions[path[1]];
    if (path.length > 2) {
      const term = path[2] === 0 ? condition.lhs : condition.rhs;
      if (path.length > 3) {
        return getTermPart(term, path.slice(3));
      }
      return term;
    }
    return condition;
  }
  return selector;
}

// path:  [selectorIndex, conditionIndex, termIndex, termPart]
function setSelectorComponent(rule: Rule, path: AlgorithmPath, newComponent: AlgorithmPiece): void {
  if (path.length === 0) throw new Error();

  if (path.length === 1) {
    rule.selectorSequence[path[0]] = newComponent as Selector;
    return;
  }
  const selector = rule.selectorSequence[path[0]];

  if (path.length === 2) {
    selector.conditions[path[1]] = newComponent as Condition;
    return;
  }
  const condition = selector.conditions[path[1]];

  if (path.length === 3) {
    if (path[2] === 0) condition.lhs = newComponent as Term;
    else condition.rhs = newComponent as Term;
    return;
  }
  const term = path[2] === 0 ? condition.lhs : condition.rhs;

  setTermPart(term, path.slice(3), newComponent);
}

// path:  [actionIndex, termIndex, termPart]
function getActionComponent(rule: Rule, path: AlgorithmPath): AlgorithmPiece {
  if (path.length === 0) throw new Error();
  if (path[0] !== 0) throw new Error('multiple actions not supported');

  const action = rule.action;
  if (path.length > 1) {
    if (path[1] !== 0 || action.kind !== 'setProperty') throw new Error('not supported');
    const term = action.value;
    if (path.length > 2) {
      const part = getTermPart(term, path.slice(2));
      if (part == null) console.warn('part null', term, path.slice(2));
      return part;
    }
    return term;
  }
  return action;
}

// path:  [actionIndex, termIndex, termPart]
function setActionComponent(rule: Rule, path: AlgorithmPath, newComponent: AlgorithmPiece): void {
  if (path.length === 0) throw new Error();
  if (path[0] !== 0) throw new Error('multiple actions not supported');

  if (path.length === 1) {
    rule.action = newComponent as HashiAction;
    return;
  }
  const action = rule.action;
  if (path[1] !== 0 || action.kind !== 'setProperty') throw new Error('not supported');

  if (path.length === 2) {
    action.value = newComponent as Term;
    return;
  }
  const term = action.value;
  setTermPart(term, path.slice(2), newComponent);
}

function isTerm(obj: Selector | Term): obj is Term {
  return (
    obj.kind === 'constant' ||
    obj.kind === 'custompropertyAccess' ||
    obj.kind === 'propertyAccess' ||
    obj.kind === 'sum' ||
    obj.kind === 'plus'
  );
}

function getTermPart(term: Term, termPath: AlgorithmPath): Selector | Term {
  // console.log('getTermPart', term, termPath);
  if (termPath.length === 0) throw new Error();

  const path0Term = getTermFor(term, termPath[0]);
  if (termPath.length > 1) {
    if (!isTerm(path0Term)) throw new Error('path to selector cannot continue');
    return getTermPart(path0Term, termPath.slice(1));
  }
  return path0Term;
}

function getTermFor(term: Term, index: number): Selector | Term {
  if (term.kind === 'plus') {
    return index === 0 ? term.lhs : term.rhs;
  } else if (term.kind === 'sum') {
    const part = index === 0 ? term.over : term.what;
    return part;
  } else throw new Error();
}

function setTermPart(term: Term, termPath: AlgorithmPath, newComponent: AlgorithmPiece): void {
  console.log('setTermPart', term, termPath);
  if (termPath.length === 0) throw new Error();

  if (termPath.length === 1) {
    if (term.kind === 'plus') {
      if (termPath[0] === 0) term.lhs = newComponent as Term;
      else term.rhs = newComponent as Term;
    } else if (term.kind === 'sum') {
      if (termPath[0] === 0) term.over = newComponent as Selector;
      else term.what = newComponent as Term;
    } else throw new Error();
  } else {
    const path0Term = getTermFor(term, termPath[0]);
    if (!isTerm(path0Term)) throw new Error('path to selector cannot continue');
    setTermPart(path0Term, termPath.slice(1), newComponent);
  }
}

// path: [ruleIndex, selectorOrAction, ...]
export function deleteComponent(algo: HashiAlgorithm, path: AlgorithmPath): void {
  if (path.length === 0) throw new Error();

  if (path.length === 1) {
    algo.rules.splice(path[0], 1);
    return;
  }
  const rule = algo.rules[path[0]];

  if (path[1] === 0) {
    deleteSelectorComponent(rule, path.slice(2));
  } else {
    throw new Error('not supported');
  }
}

// path:  [selectorIndex, conditionIndex, termIndex, termPart]
function deleteSelectorComponent(rule: Rule, path: AlgorithmPath): void {
  if (path.length === 0) throw new Error();

  if (path.length === 1) {
    rule.selectorSequence.splice(path[0], 1);
    return;
  }
  const selector = rule.selectorSequence[path[0]];

  if (path.length === 2) {
    selector.conditions.splice(path[1], 1);
    return;
  }

  throw new Error();
}

export function createPathToRule(ruleIndex: number): AlgorithmPath {
  return [ruleIndex];
}

export function pathSelectorAndAppend(path: AlgorithmPath, selectorIndex: number): AlgorithmPath {
  if (path.length !== 1) throw new Error();
  return [...path, 0, selectorIndex];
}

export function pathActionAndAppend(path: AlgorithmPath, selectorIndex: number): AlgorithmPath {
  if (path.length !== 1) throw new Error();
  return [...path, 1, selectorIndex];
}

export function pathAppend(path: AlgorithmPath, nextStep: number): AlgorithmPath {
  if (path.length < 2) throw Error();
  return [...path, nextStep];
}

export function getSelectorIndex(path: AlgorithmPath): number {
  if (path.length < 3 || path[1] !== 0) throw new Error();
  return path[2];
}

export function getAncestorSelector(algo: HashiAlgorithm, path: AlgorithmPath): Selector {
  if (path.length < 3) throw new Error();
  return getComponent(algo, path.slice(0, 3)) as Selector;
}
