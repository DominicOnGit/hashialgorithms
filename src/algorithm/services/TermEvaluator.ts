import { type CustomPropertyDef } from './../../stores/CustomPropertyDef';
import type { PlusTerm, ProperyAccessTerm, SumTerm, Term } from '@/algorithm/stores/HashiAlgorithm';
import { HashiEdge, HashiUtil, HashiVertex, type Selectable } from '../../hashi/services/HashiUtil';
import type { ISelectorEvaluator } from './interfaces';
import { termToString } from './TermBuilderService';
import { AlgorithmRunnerLogger } from '@/services/logging';

export class TermEvaluator {
  constructor(
    private hashi: HashiUtil,
    private selectorEvaluator: ISelectorEvaluator
  ) {}

  public evaluate(term: Term, item: Selectable, selectedAncestors: Selectable[]): number {
    const res = this.evaluate2(term, item, selectedAncestors);
    // console.log(`evaluate(${term.kind}, .) => ${res}`, term, item);
    return res;
  }

  private evaluate2(term: Term, item: Selectable, selectedAncestors: Selectable[]): number {
    switch (term.kind) {
      case 'constant': {
        return term.value;
      }
      case 'propertyAccess': {
        return this.evaluatePropertyAccess(term.property, item);
      }
      case 'custompropertyAccess': {
        return this.evaluateCustomPropertyAccess(term.property, item);
      }
      case 'plus': {
        return this.evaluatePlus(term, item, selectedAncestors);
      }
      case 'sum': {
        return this.evaluateSum(term, item, selectedAncestors);
      }
    }
  }

  private evaluatePlus(plus: PlusTerm, item: Selectable, selectedAncestors: Selectable[]): number {
    const left = this.evaluate2(plus.lhs, item, selectedAncestors);
    const right = this.evaluate2(plus.rhs, item, selectedAncestors);
    return left + right;
  }

  private evaluateSum(sum: SumTerm, item: Selectable, selectedAncestors: Selectable[]): number {
    const chainToItem = [...selectedAncestors, item];
    const itemsToSumOver = this.selectorEvaluator.SelectAll(sum.over, chainToItem);
    const itemValues = itemsToSumOver.map((summandItem) =>
      this.evaluate2(sum.what, summandItem, chainToItem)
    );
    AlgorithmRunnerLogger.debug(
      `evaluateSum ${termToString(sum)} on ${item.toString()}: `,
      itemsToSumOver.map((summandItem, index) => `${summandItem.toString()}=${itemValues[index]}`)
    );
    const res = itemValues.reduce((acc, summand) => acc + summand, 0);
    return res;
  }

  private evaluateCustomPropertyAccess(property: CustomPropertyDef, item: Selectable): number {
    if (property.onVertex) {
      throw new Error('not implemented');
    } else {
      if (!(item instanceof HashiEdge)) throw new Error('bad type');
      {
        if (item.edge.customPropertyValues != null) {
          return item.edge.customPropertyValues[property.name] ?? property.initialValue;
        }
        return property.initialValue;
      }
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
}
