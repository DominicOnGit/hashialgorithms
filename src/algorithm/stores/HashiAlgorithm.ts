import type { CustomPropertyDef } from '@/stores/CustomPropertyDef';

export interface HashiAlgorithm {
  rules: Rule[];
}

export interface Rule {
  name?: string;
  selectorSequence: Selector[];
  action: HashiAction;
}

export type SelectorKind = 'vertex' | 'edge';

export interface SelectorKindAndExcludeAncestor {
  kind: SelectorKind;
  excludeAncestor?: boolean;
}

export interface Selector extends SelectorKindAndExcludeAncestor {
  conditions: Condition[];
}

export interface AddEdgeAction {
  kind: 'addEdge';
}

export interface SetPropertyAction {
  kind: 'setProperty';
  property: string;
  value: Term;
}

export type HashiAction = AddEdgeAction | SetPropertyAction;

export type Operator = 'lt' | 'le' | 'eq' | 'gt' | 'ge';

export interface Condition {
  lhs: Term;
  operator: Operator;
  rhs: Term;
}

export interface ProperyAccessTerm {
  kind: 'propertyAccess';
  property: 'multiplicity' | 'targetDegree' | 'degree';
}

export interface CustomProperyAccessTerm {
  kind: 'custompropertyAccess';
  property: CustomPropertyDef;
}

export interface ConstantTerm {
  kind: 'constant';
  value: number;
}

export interface PlusTerm {
  kind: 'plus';
  lhs: Term;
  rhs: Term;
}

export interface SumTerm {
  kind: 'sum';
  over: Selector;
  what: Term;
}

export type Term = ProperyAccessTerm | CustomProperyAccessTerm | ConstantTerm | SumTerm | PlusTerm;

export type AlgorithmPiece = Rule | Selector | Condition | Term | HashiAction;

// selectorpath [ruleIndex, selectorOrAction, selectorIndex, conditionIndex, termIndex, termPart]
// actionPath: [ ruleIndex, selectorOrAction, actionIndex, termIndex, termPart]
export type AlgorithmPath = number[];
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
