import { HashiUtil, type Selectable } from './HashiUtil';
import { type Edge, type Hashi } from '@/stores/hashi';
import type { Condition, Selector } from '@/stores/HashiAlgorithm';
import { TermEvaluator } from './TermEvaluator';

export class SelectorRunner {
  private hashiUtil: HashiUtil;

  constructor(
    private selector: Selector,
    private hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi);
  }

  public SelectNext(): Selectable {
    switch (this.selector.kind) {
      case 'edge': {
        const allEdges = this.hashiUtil.getAllEdges();
        if (allEdges.length === 0) throw new Error('no edges');

        const conditions = this.selector.conditions;
        const filteredEdge = allEdges.find((edge) =>
          conditions.every((condition) => this.evaluateEdgeCondition(condition, edge))
        );
        if (filteredEdge == null) throw new Error('no filtered edges');
        return filteredEdge;
      }
      case 'vertex': {
        const conditions = this.selector.conditions;
        throw new Error('not implemented');
      }
      default:
        throw new Error('not implemented');
    }
  }

  private evaluateEdgeCondition(cond: Condition, edge: Edge): boolean {
    const evaluator = new TermEvaluator(this.hashi);
    const lhs = evaluator.evaluateOnEdge(cond.lhs, edge);
    const rhs = evaluator.evaluateOnEdge(cond.rhs, edge);
    const res = this.evaluateOperator(lhs, cond.operator, rhs);
    console.log(`evaluateEdgeCondition(.,.) => ${res}`);
    return res;
  }

  private evaluateOperator(lhs: number, op: Condition['operator'], rhs: number): boolean {
    switch (op) {
      case 'eq':
        return lhs === rhs;
      case 'leq':
        return lhs <= rhs;
    }
  }
}
