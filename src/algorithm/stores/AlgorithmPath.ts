import type { Rule, Selector, Condition, Term, HashiAction } from './HashiAlgorithm';

export type AlgorithmPiece = Rule | Selector | Condition | Term | HashiAction;
export type AlgorithmPathType = 'rule' | 'selector' | 'action';

// selectorpath [ruleIndex, selectorOrAction, selectorIndex, conditionIndex, termIndex, termPart]
// actionPath: [ ruleIndex, selectorOrAction, actionIndex, termIndex, termPart]

// {
//   kind: 'selector' | 'action';
//   sequence: number[];
// };
// export interface AlgorithmPath {
//   ruleIndex: number;
//   selectorIndex?: number;
//   conditionIndex?: number;
//   termIndex?: number; // lhs or rhs
//   termPath?: AlgorithmPath;
// }

// export type AlgorithmPath = number[];

export interface RulePath {
  //  type: 'rule';
  ruleIndex: number;
}

export interface SelectorPath extends RulePath {
  //  type: 'selector';
  selectorIndex: number;
}

export interface ConditionPath extends SelectorPath {
  //  type: 'condition';
  conditionIndex: number;
}

export interface ConditionPartPath extends ConditionPath {
  //  type: 'conditionPart';
  conditionPart: number; // 0 for lhs, 1 for rhs
}

export interface TermPath {
  sequence: number[];
}

export interface ConditionTermPath extends ConditionPartPath {
  termPath: TermPath;
}

export interface ActionPath extends RulePath {
  //  type: 'action';
  actionIndex: number;
}

export interface ActionPartPath extends ActionPath {
  actionPart: number;
}

export interface ActionTermPath extends ActionPartPath {
  termPath: TermPath;
}

export type AlgorithmTermPath = ConditionTermPath | ActionTermPath;

export type AlgorithmPath = RulePath | SelectorPath;

export function isSelectorPath(path: AlgorithmPath): path is SelectorPath {
  return 'selectorIndex' in path;
}

export function isActionPath(path: AlgorithmPath): path is ActionPath {
  return 'actionIndex' in path;
}

export function isActionPartPath(path: AlgorithmPath): path is ActionPartPath {
  return 'actionPart' in path;
}

export function isConditionPath(path: AlgorithmPath): path is ConditionPath {
  return 'conditionIndex' in path;
}

export function isConditionPartPath(path: AlgorithmPath): path is ConditionPartPath {
  return 'conditionPart' in path;
}

export function isConditionTermPath(path: ConditionPath): path is ConditionTermPath {
  return 'termPath' in path;
}

export function isActionTermPath(path: ActionPath): path is ActionTermPath {
  return 'termPath' in path;
}

export function isAlgorithmTermPath(path: AlgorithmPath): path is AlgorithmTermPath {
  return 'termPath' in path;
}

export function pathType(path: AlgorithmPath): AlgorithmPathType {
  if (isSelectorPath(path)) {
    return 'selector';
  } else if (isActionPath(path)) {
    return 'action';
  } else {
    return 'rule';
  }
}
