import type { Selector, Term } from '@/algorithm/stores/HashiAlgorithm';
import type { CustomPropertyDefs } from '@/stores/CustomPropertyDef';

export class TermBuilderService {
  constructor(
    private selectionKind: Selector['kind'],
    private customPropDefs: CustomPropertyDefs
  ) {}

  commonTerms: Term[] = [
    { kind: 'constant', value: 0 },
    { kind: 'constant', value: 1 },
    { kind: 'constant', value: 2 },
    { kind: 'plus', lhs: { kind: 'constant', value: 1 }, rhs: { kind: 'constant', value: 1 } }
  ];

  vertexTerms: Term[] = [
    { kind: 'propertyAccess', property: 'degree' },
    { kind: 'propertyAccess', property: 'targetDegree' },
    { kind: 'sum', over: { kind: 'edge', conditions: [] }, what: { kind: 'constant', value: 1 } }
  ];

  edgeTerms: Term[] = [
    { kind: 'propertyAccess', property: 'multiplicity' },
    { kind: 'sum', over: { kind: 'vertex', conditions: [] }, what: { kind: 'constant', value: 1 } }
  ];

  public getAllTermOptions(allowSum: boolean): Term[] {
    const unfiltered = this.getAllTermOptionsUnfiltered();
    if (allowSum) return unfiltered;
    else return unfiltered.filter((x) => x.kind !== 'sum');
  }

  private getAllTermOptionsUnfiltered(): Term[] {
    const customPropertyTerms = this.customPropDefs
      .filter((pd) => pd.onVertex === (this.selectionKind === 'vertex'))
      .map<Term>((pd) => ({ kind: 'custompropertyAccess', property: pd }));
    switch (this.selectionKind) {
      case 'vertex':
        return this.commonTerms.concat(this.vertexTerms).concat(customPropertyTerms);
      case 'edge':
        return this.commonTerms.concat(this.edgeTerms).concat(customPropertyTerms);
    }
  }
}

export function getTermId(term: Term): string {
  switch (term.kind) {
    case 'sum':
      return 'sum';
    case 'plus':
      return 'plus';
    default:
      return termToString(term);
  }
}

export function termToString(term: Term): string {
  switch (term.kind) {
    case 'constant':
      return term.value.toString();
    case 'propertyAccess':
      return `@${term.property}`;
    case 'custompropertyAccess':
      return `@${term.property.name}`;
    case 'plus':
      return `${termToString(term.lhs)} + ${termToString(term.rhs)}`;
    case 'sum':
      return `sum_${term.over.kind}(${termToString(term.what)})`;
  }
}
