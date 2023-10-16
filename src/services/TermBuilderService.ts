import type { Selector, Term } from '@/stores/HashiAlgorithm';

export class TermBuilderService {
  constructor(private selectionKind: Selector['kind']) {}

  commonTerms: Term[] = [
    { kind: 'constant', value: 0 },
    { kind: 'constant', value: 1 },
    { kind: 'constant', value: 2 }
  ];

  vertexTerms: Term[] = [
    { kind: 'propertyAccess', property: 'degree' },
    { kind: 'propertyAccess', property: 'targetDegree' }
  ];

  edgeTerms: Term[] = [{ kind: 'propertyAccess', property: 'multiplicity' }];

  public getAllTermOptions(): Term[] {
    switch (this.selectionKind) {
      case 'vertex':
        return this.commonTerms.concat(this.vertexTerms);
      case 'edge':
        return this.commonTerms.concat(this.edgeTerms);
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
