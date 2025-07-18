import type {
  Condition,
  HashiAction,
  HashiAlgorithm,
  Selector,
  Term
} from '@/algorithm/stores/HashiAlgorithm';
import { type Rule } from '../stores/HashiAlgorithm';
import {
  isActionPath,
  isActionTermPath,
  isConditionPartPath,
  isConditionPath,
  isConditionTermPath,
  isSelectorPath,
  type ActionPath,
  type ActionPartPath,
  type AlgorithmPath,
  type AlgorithmPiece,
  type AlgorithmTermPath,
  type ConditionPartPath,
  type ConditionPath,
  type RulePath,
  type SelectorPath,
  isActionPartPath,
  isAlgorithmTermPath
} from '../stores/AlgorithmPath';
import { assertNotNull } from '@/services/misc';
import { AlgorithmPathLogger } from '@/services/logging';

const logger = AlgorithmPathLogger;

export function getComponent(algo: HashiAlgorithm, path: AlgorithmPath): AlgorithmPiece {
  logger.info('getComponent', path);
  const res = getRuleComponent(algo, path);
  return res;
}

// path: [ruleIndex, selectorOrAction, ...]
export function setComponent(
  algo: HashiAlgorithm,
  path: AlgorithmPath,
  newComponent: AlgorithmPiece | null
): void {
  logger.info('setComponent ', path, newComponent);
  setRuleComponent(algo, path, newComponent);
}

// path: [ruleIndex, selectorOrAction, ...]
function getRuleComponent(algo: HashiAlgorithm, path: RulePath): AlgorithmPiece {
  const rule = algo.rules[path.ruleIndex];
  if (rule == null) throw new Error();

  if (isSelectorPath(path)) {
    return getSelectorComponent(rule, path);
  } else if (isActionPath(path)) {
    return getActionComponent(rule, path);
  } else {
    logger.debug('returning rule', rule);
    return rule;
  }
}

function setRuleComponent(
  algo: HashiAlgorithm,
  path: RulePath,
  newComponent: AlgorithmPiece | null
): void {
  if (!isSelectorPath(path) && !isActionPath(path)) {
    if (newComponent == null) {
      logger.debug('deleting rule', path.ruleIndex);
      algo.rules.splice(path.ruleIndex, 1);
      algo.disabledRules = algo.disabledRules.reduce<number[]>((acc, oldDisabledIndex) => {
        if (oldDisabledIndex < path.ruleIndex) acc.push(oldDisabledIndex);
        if (oldDisabledIndex > path.ruleIndex) acc.push(oldDisabledIndex - 1);
        return acc;
      }, []);
    } else {
      logger.debug('setting rule', path.ruleIndex);
      algo.rules[path.ruleIndex] = newComponent as Rule;
    }
    return;
  }

  const rule = algo.rules[path.ruleIndex];

  if (isSelectorPath(path)) {
    setSelectorComponent(rule, path, newComponent);
  } else {
    assertNotNull(newComponent, 'newComponent must not be null for action path'); // todo: should not be necessary
    setActionComponent(rule, path, newComponent);
  }
}

// path:  [selectorIndex, conditionIndex, termIndex, termPart]
function getSelectorComponent(rule: Rule, path: SelectorPath): AlgorithmPiece {
  const selector = rule.selectorSequence[path.selectorIndex];
  logger.debug('getSelectorComponent', selector);

  if (isConditionPath(path)) {
    return getConditionComponent(selector, path);
  }
  logger.debug('returning selector', selector);
  return selector;
}

function setSelectorComponent(
  rule: Rule,
  path: SelectorPath,
  newComponent: AlgorithmPiece | null
): void {
  logger.debug('setSelectorComponent ' + path.selectorIndex);
  if (!isConditionPath(path)) {
    if (newComponent == null) {
      logger.debug('deleting selector', path.selectorIndex);
      rule.selectorSequence.splice(path.selectorIndex, 1);
    } else {
      logger.debug('setting selector', path.selectorIndex);
      rule.selectorSequence[path.selectorIndex] = newComponent as Selector;
    }
    return;
  }
  const selector = rule.selectorSequence[path.selectorIndex];
  setConditionComponent(selector, path, newComponent);
}

function getConditionComponent(selector: Selector, path: ConditionPath): AlgorithmPiece {
  const condition = selector.conditions[path.conditionIndex];
  if (isConditionPartPath(path)) {
    return getConditionPartComponent(condition, path);
  }
  return condition;
}

function setConditionComponent(
  selector: Selector,
  path: ConditionPath,
  newComponent: AlgorithmPiece | null
): void {
  logger.debug('setConditionComponent ' + path.conditionIndex);
  if (!isConditionPartPath(path)) {
    if (newComponent == null) {
      selector.conditions.splice(path.conditionIndex, 1);
    } else {
      selector.conditions[path.conditionIndex] = newComponent as Condition;
    }
    return;
  }
  const condition = selector.conditions[path.conditionIndex];

  assertNotNull(newComponent, 'newComponent must not be null for condition part path');
  setConditionPartComponent(condition, path, newComponent);
}

function getConditionPartComponent(condition: Condition, path: ConditionPartPath): Selector | Term {
  logger.debug('getConditionPartComponent ' + path.conditionPart);
  const term = path.conditionPart === 0 ? condition.lhs : condition.rhs;

  if (isConditionTermPath(path) && path.termPath.sequence.length > 0) {
    return getTermPart(term, path.termPath.sequence);
  }
  return term;
}

function setConditionPartComponent(
  condition: Condition,
  path: ConditionPartPath,
  newComponent: AlgorithmPiece
): void {
  logger.debug('setConditionPartComponont ' + path.conditionPart);
  if (!isConditionTermPath(path) || path.termPath.sequence.length === 0) {
    if (path.conditionPart === 0) condition.lhs = newComponent as Term;
    else condition.rhs = newComponent as Term;
    return;
  }

  const term = path.conditionPart === 0 ? condition.lhs : condition.rhs;

  setTermPart(term, path.termPath.sequence, newComponent);
}

function getActionComponent(rule: Rule, path: ActionPath): AlgorithmPiece {
  const action = rule.action;
  if (isActionPartPath(path)) {
    return getActionPartComponent(action, path);
  }
  return action;
}

// path:  [actionIndex, termIndex, termPart]
function setActionComponent(rule: Rule, path: ActionPath, newComponent: AlgorithmPiece): void {
  logger.debug('setActionComponent');
  if (!isActionPartPath(path)) {
    rule.action = newComponent as HashiAction;
    return;
  }
  const action = rule.action;
  setActionPartComponent(action, path, newComponent);
}

function getActionPartComponent(action: HashiAction, path: ActionPartPath): Term {
  if (path.actionPart !== 0 || action.kind !== 'setProperty') throw new Error('not supported');
  const term = action.value;

  if (isActionTermPath(path) && path.termPath.sequence.length > 0) {
    const part = getTermPart(term, path.termPath.sequence);
    if (!isTerm(part)) throw new Error('path to selector cannot continue');
    return part;
  }
  return term;
}

function setActionPartComponent(
  action: HashiAction,
  path: ActionPartPath,
  newComponent: AlgorithmPiece
): void {
  logger.debug('setActionPartComponent ' + path.actionPart);
  if (path.actionPart !== 0 || action.kind !== 'setProperty') throw new Error('not supported');

  if (!isActionTermPath(path) || path.termPath.sequence.length === 0) {
    action.value = newComponent as Term;
    return;
  }
  const term = action.value;
  setTermPart(term, path.termPath.sequence, newComponent);
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

function getTermPart(term: Term, termPath: number[]): Selector | Term {
  logger.debug('getTermPart', termPath);

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

function setTermPart(term: Term, termPath: number[], newComponent: AlgorithmPiece): void {
  logger.debug('setTermPart ', termPath);

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
  setComponent(algo, path, null);
}

export function createPathToRule(ruleIndex: number): RulePath {
  return { ruleIndex };
}

export function selectSelector(path: RulePath, selectorIndex: number): SelectorPath {
  return {
    ...path,
    selectorIndex
  };
}

export function selectCondition(path: SelectorPath, conditionIndex: number): ConditionPath {
  return {
    ...path,
    conditionIndex
  };
}

export function selectConditionPart(path: ConditionPath, conditionPart: number): ConditionPartPath {
  return {
    ...path,
    conditionPart
  };
}

// export function selectConditionPartTerm(
//   path: ConditionPartPath,
//   termPath: TermPath
// ): ConditionTermPath {
//   return {
//     ...path,
//     termPath
//   };
// }

export function selectAction(path: RulePath): ActionPath {
  return { ...path, actionIndex: 0 };
}

export function selectActionPart(path: ActionPath, termIndex: number): ActionPartPath {
  return {
    ...path,
    actionPart: termIndex
  };
}

export function toTermPath(path: ConditionPartPath | ActionPartPath): AlgorithmTermPath {
  if (isAlgorithmTermPath(path)) {
    return path;
  }
  return {
    ...path,
    termPath: { sequence: [] }
  };
}

export function selectConditionPartTerm(
  path: ConditionPartPath,
  termPart: number
): AlgorithmTermPath {
  return extendTermPath(toTermPath(path), termPart);
  // return { ...path, termPath: { sequence: [termPart] } };
}

export function extendTermPath(path: AlgorithmTermPath, part: number): AlgorithmTermPath {
  const sequence =
    (isConditionPath(path) && isConditionTermPath(path)) ||
    (isActionPath(path) && isActionTermPath(path))
      ? [...path.termPath.sequence, part]
      : [part];
  return {
    ...path,
    termPath: {
      sequence: sequence
    }
  };
}

export function getAncestorSelector(algo: HashiAlgorithm, path: SelectorPath): Selector {
  const pureSelectorPath: SelectorPath = {
    ruleIndex: path.ruleIndex,
    selectorIndex: path.selectorIndex
  };
  return getComponent(algo, pureSelectorPath) as Selector;
}
