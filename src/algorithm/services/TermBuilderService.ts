import type { Selector, Term } from '@/algorithm/stores/HashiAlgorithm';

export class TermBuilderService {
  constructor(private selectionKind: Selector['kind']) {}

  commonTerms: Term[] = [
    { kind: 'constant', value: 0 },
    { kind: 'constant', value: 1 },
    { kind: 'constant', value: 2 }
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
    switch (this.selectionKind) {
      case 'vertex':
        return this.commonTerms.concat(this.vertexTerms);
      case 'edge':
        return this.commonTerms.concat(this.edgeTerms);
    }
  }

  public getTermId(term: Term): string {
    switch (term.kind) {
      case 'sum':
        return 'sum';
      default:
        return termToString(term);
    }
  }
}

export function termToString(term: Term): string {
  switch (term.kind) {
    case 'constant':
      return term.value.toString();
    case 'propertyAccess':
      return `@${term.property}`;
    case 'sum':
      return `sum_${term.over.kind}(${termToString(term.what)})`;
  }
}
