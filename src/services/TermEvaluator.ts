import type { Term } from '@/stores/HashiAlgorithm'
import { type Edge, type Hashi } from '@/stores/hashi'

export class TermEvaluator {
  constructor(private hashi: Hashi) {}

  public evaluateOnEdge(term: Term, edge: Edge): number {
    const res = this.evaluateOnEdge2(term, edge)
    console.log(`evaluateOnEdge(${term.kind}, ${edge.v1}-${edge.v2}) => ${res}`, edge)
    return res
  }

  private evaluateOnEdge2(term: Term, edge: Edge): number {
    switch (term.kind) {
      case 'constant': {
        return term.value
      }
      case 'propertyAccess': {
        return edge[term.property]
      }
      default:
        throw Error()
    }
  }
}
