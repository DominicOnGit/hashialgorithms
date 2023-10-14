import type { ProperyAccessTerm, Term } from '@/stores/HashiAlgorithm';
import { type Hashi } from '@/stores/hashi';
import { HashiEdge, HashiVertex, type Selectable } from './HashiUtil';

export class TermEvaluator {
  constructor(private hashi: Hashi) {}

  public evaluate(term: Term, item: Selectable): number {
    const res = this.evaluate2(term, item);
    console.log(`evaluate(${term.kind}, .) => ${res}`, item);
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
      default:
        throw Error();
    }
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
    }
  }
}
