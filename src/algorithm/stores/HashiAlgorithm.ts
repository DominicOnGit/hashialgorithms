export interface HashiAlgorithm {
  rules: Rule[];
}

export interface Rule {
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

export type Operator = 'lt' | 'le' | 'eq';

export interface Condition {
  lhs: Term;
  operator: Operator;
  rhs: Term;
}

export interface ProperyAccessTerm {
  kind: 'propertyAccess';
  property: 'multiplicity' | 'targetDegree' | 'degree';
}

export interface ConstantTerm {
  kind: 'constant';
  value: number;
}

export interface SumTerm {
  kind: 'sum';
  over: Selector;
  what: Term;
}

export type Term = ProperyAccessTerm | ConstantTerm | SumTerm;

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
