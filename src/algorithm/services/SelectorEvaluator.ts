import { HashiUtil, HashiVertex, type Selectable, HashiEdge } from '../../hashi/services/HashiUtil';
import type { Condition, Operator, Selector } from '@/algorithm/stores/HashiAlgorithm';
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
        const allEdges = this.getUnconditionalEdges(selector, selectedAncestors);

        const conditions = selector.conditions;
        const filtered = allEdges.filter((edge) =>
          conditions.every((condition) =>
            this.evaluateCondition(condition, edge, selectedAncestors)
          )
        );
        return filtered;
      }
      case 'vertex': {
        const allVertices = this.getUnconditionalVertices(selector, selectedAncestors);
        const conditions = selector.conditions;
        const filtered = allVertices.filter((vertex) =>
          conditions.every((condition) =>
            this.evaluateCondition(condition, vertex, selectedAncestors)
          )
        );
        return filtered;
      }
    }
  }

  private getUnconditionalVertices(
    selector: Selector,
    selectedAncestors: Selectable[]
  ): HashiVertex[] {
    const parent =
      selectedAncestors.length > 0 ? selectedAncestors[selectedAncestors.length - 1] : null;
    if (parent != null && !(parent instanceof HashiEdge)) throw new Error('expected edge parent');

    const allVertices =
      parent != null ? this.hashiUtil.incidentVertices(parent) : this.hashiUtil.vertices;

    if (selector.excludeAncestor) {
      const grandParent =
        selectedAncestors.length > 1 ? selectedAncestors[selectedAncestors.length - 2] : null;
      if (grandParent == null || !(grandParent instanceof HashiVertex))
        throw new Error('expected vertex grandParent');
      return allVertices.filter((x) => !grandParent.equals(x));
    }
    return allVertices;
  }

  private getUnconditionalEdges(selector: Selector, selectedAncestors: Selectable[]): HashiEdge[] {
    const parent =
      selectedAncestors.length > 0 ? selectedAncestors[selectedAncestors.length - 1] : null;

    if (parent != null && !(parent instanceof HashiVertex))
      throw new Error('expected vertex parent');

    const allEdges = parent != null ? this.hashiUtil.incidentEdges(parent) : this.hashiUtil.edges;

    if (selector.excludeAncestor) {
      const grandParent =
        selectedAncestors.length > 1 ? selectedAncestors[selectedAncestors.length - 2] : null;
      if (grandParent == null || !(grandParent instanceof HashiEdge))
        throw new Error('expected edge grandParent');
      return allEdges.filter((x) => !grandParent.equals(x));
    }
    return allEdges;
  }

  private evaluateCondition(
    cond: Condition,
    item: Selectable,
    selectedAncestors: Selectable[]
  ): boolean {
    const lhs = this.termEvaluator.evaluate(cond.lhs, item, selectedAncestors);
    const rhs = this.termEvaluator.evaluate(cond.rhs, item, selectedAncestors);
    const res = this.evaluateOperator(lhs, cond.operator, rhs);
    const condString = `${termToString(cond.lhs)}=${lhs} ${cond.operator} ${termToString(
      cond.rhs
    )}=${rhs}`;
    console.debug(`evaluateCondition(${condString}, ${item.toString()}) => ${res}`);
    return res;
  }

  public conditionToString(cond: Condition): string {
    return `${termToString(cond.lhs)} ${cond.operator} ${termToString(cond.rhs)}`;
  }

  private evaluateOperator(lhs: number, op: Operator, rhs: number): boolean {
    switch (op) {
      case 'eq':
        return lhs === rhs;
      case 'le':
        return lhs <= rhs;
      case 'lt':
        return lhs < rhs;
      case 'gt':
        return lhs > rhs;
      case 'ge':
        return lhs >= rhs;
    }
  }
}
