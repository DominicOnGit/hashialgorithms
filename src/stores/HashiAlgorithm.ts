export interface HashiAlgorithm {
  rules: Rule[];
}

export interface Rule {
  selectorSequence: Selector[];
  action: HashiAction;
}

export interface VertexSelector {
  kind: 'vertex';
  conditions: Condition[];
}

export interface EdgeSelector {
  kind: 'edge';
  conditions: Condition[];
}

export type Selector = VertexSelector | EdgeSelector;

export type SelectorKind = Selector['kind'];

export interface AddEdgeAction {
  kind: 'addEdge';
}

export type HashiAction = AddEdgeAction;

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

export type AlgorithmPiece = Rule | Selector | Condition | Term;

// [ruleIndex, selectorIndex, conditionIndex, termIndex, termPart]
export type AlgorithmPath = number[];

// export interface AlgorithmPath {
//   ruleIndex: number;
//   selectorIndex?: number;
//   conditionIndex?: number;
//   termIndex?: number; // lhs or rhs
//   termPath?: AlgorithmPath;
// }
