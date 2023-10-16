import type { ProperyAccessTerm, SumTerm, Term } from '@/stores/HashiAlgorithm';
import { HashiEdge, HashiUtil, HashiVertex, type Selectable } from './HashiUtil';
import type { ISelectorEvaluator } from './interfaces';

export class TermEvaluator {
  constructor(
    private hashi: HashiUtil,
    private selectorEvaluator: ISelectorEvaluator
  ) {}

  public evaluate(term: Term, item: Selectable): number {
    const res = this.evaluate2(term, item);
    // console.log(`evaluate(${term.kind}, .) => ${res}`, term, item);
    return res;
  }

  private evaluate2(term: Term, item: Selectable): number {
    switch (term.kind) {
      case 'constant': {
        return term.value;
      }
      case 'propertyAccess': {
        return this.evaluatePropertyAccess(term.property, item);
      }
      case 'sum': {
        return this.evaluateSum(term, item);
      }
    }
  }

  private evaluateSum(sum: SumTerm, item: Selectable): number {
    const itemsToSumOver = this.selectorEvaluator.SelectAll(sum.over, [item]);
    const res = itemsToSumOver.reduce((acc, item) => acc + this.evaluate2(sum.what, item), 0);
    return res;
  }

  private evaluatePropertyAccess(
    property: ProperyAccessTerm['property'],
    item: Selectable
  ): number {
    switch (property) {
      case 'multiplicity':
        if (!(item instanceof HashiEdge)) throw new Error('bad type');
        return item.multiplicity;
      case 'targetDegree':
        if (!(item instanceof HashiVertex)) throw new Error('bad type');
        return item.targetDegree;
      case 'degree':
        if (!(item instanceof HashiVertex)) throw new Error('bad type');
        return this.hashi.getDegree(item);
    }
  }
}
