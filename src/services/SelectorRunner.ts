import { HashiUtil, HashiVertex, type Selectable } from './HashiUtil';
import type { Condition, Selector } from '@/stores/HashiAlgorithm';
import { TermEvaluator } from './TermEvaluator';

export class SelectorRunner {
  constructor(
    private selectors: Selector[],
    private hashiUtil: HashiUtil
  ) {
    if (selectors.length === 0) throw new Error('no selector');
  }

  public SelectNext(): Selectable[] {
    const all = this.SelectAll();
    if (all.length === 0) throw new Error('nothing selected');
    return all[0];
  }

  public SelectAll(): Selectable[][] {
    return this.SelectAllFromLevel([[]], 0);
  }

  private SelectAllFromLevel(ancestorsToLevelSet: Selectable[][], level: number): Selectable[][] {
    if (level === this.selectors.length) return ancestorsToLevelSet;

    const res = ancestorsToLevelSet.flatMap((selectedAncestors) => {
      const allAtLevel = this.SelectAllSingleSelector(this.selectors[level], selectedAncestors);
      console.log(
        'selector evaluated at level ' + level,
        selectedAncestors.map((x) => x.toString()),
        allAtLevel.map((x) => x.toString())
      );
      const ancestorsAtLevelSet = allAtLevel.map((atLevel) => [...selectedAncestors, atLevel]);
      return this.SelectAllFromLevel(ancestorsAtLevelSet, level + 1);
    });
    return res;
  }

  private SelectAllSingleSelector(
    selector: Selector,
    selectedAncestors: Selectable[]
  ): Selectable[] {
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
      default:
        throw new Error('not implemented');
    }
  }

  private evaluateCondition(cond: Condition, item: Selectable): boolean {
    const evaluator = new TermEvaluator(this.hashiUtil);
    const lhs = evaluator.evaluate(cond.lhs, item);
    const rhs = evaluator.evaluate(cond.rhs, item);
    const res = this.evaluateOperator(lhs, cond.operator, rhs);
    const condString = `${evaluator.termToString(cond.lhs)}=${lhs} ${
      cond.operator
    } ${evaluator.termToString(cond.rhs)}=${rhs}`;
    console.log(`evaluateCondition(${condString}, ${item.toString()}) => ${res}`);
    return res;
  }

  public conditionToString(cond: Condition): string {
    const evaluator = new TermEvaluator(this.hashiUtil);
    return `${evaluator.termToString(cond.lhs)} ${cond.operator} ${evaluator.termToString(
      cond.rhs
    )}`;
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
