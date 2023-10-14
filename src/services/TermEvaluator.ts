import type { ProperyAccessTerm, Term } from '@/stores/HashiAlgorithm';
import { HashiEdge, HashiUtil, HashiVertex, type Selectable } from './HashiUtil';

export class TermEvaluator {
  constructor(private hashi: HashiUtil) {}

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
      case 'degree':
        if (!(item instanceof HashiVertex)) throw new Error('bad type');
        return this.hashi.getDegree(item);
    }
  }

  public termToString(term: Term): string {
    switch (term.kind) {
      case 'constant':
        return term.value.toString();
      case 'propertyAccess':
        return `@${term.property}`;
    }
  }
}
