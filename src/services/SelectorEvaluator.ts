import { HashiUtil, HashiVertex, type Selectable } from './HashiUtil';
import type { Condition, Selector } from '@/stores/HashiAlgorithm';
import { TermEvaluator } from './TermEvaluator';
import type { ISelectorEvaluator } from './interfaces';
import { termToString } from './TermBuilderService';

export class SelectorEvaluator implements ISelectorEvaluator {
  private termEvaluator: TermEvaluator;
  constructor(private hashiUtil: HashiUtil) {
    this.termEvaluator = new TermEvaluator(hashiUtil, this);
  }

  public SelectAll(selector: Selector, selectedAncestors: Selectable[]): Selectable[] {
    switch (selector.kind) {
      case 'edge': {
        const parent =
          selectedAncestors.length > 0 ? selectedAncestors[selectedAncestors.length - 1] : null;

        if (parent != null && !(parent instanceof HashiVertex))
          throw new Error('expected vertex parent');

        const allEdges =
          parent != null ? this.hashiUtil.incidentEdges(parent) : this.hashiUtil.edges;

        const conditions = selector.conditions;
        const filtered = allEdges.filter((edge) =>
          conditions.every((condition) => this.evaluateCondition(condition, edge))
        );
        return filtered;
      }
      case 'vertex': {
        const conditions = selector.conditions;
        const filtered = this.hashiUtil.vertices.filter((vertex) =>
          conditions.every((condition) => this.evaluateCondition(condition, vertex))
        );
        return filtered;
      }
    }
  }

  private evaluateCondition(cond: Condition, item: Selectable): boolean {
    const lhs = this.termEvaluator.evaluate(cond.lhs, item);
    const rhs = this.termEvaluator.evaluate(cond.rhs, item);
    const res = this.evaluateOperator(lhs, cond.operator, rhs);
    const condString = `${termToString(cond.lhs)}=${lhs} ${cond.operator} ${termToString(
      cond.rhs
    )}=${rhs}`;
    console.log(`evaluateCondition(${condString}, ${item.toString()}) => ${res}`);
    return res;
  }

  public conditionToString(cond: Condition): string {
    return `${termToString(cond.lhs)} ${cond.operator} ${termToString(cond.rhs)}`;
  }

  private evaluateOperator(lhs: number, op: Condition['operator'], rhs: number): boolean {
    switch (op) {
      case 'eq':
        return lhs === rhs;
      case 'le':
        return lhs <= rhs;
      case 'lt':
        return lhs < rhs;
    }
  }
}
