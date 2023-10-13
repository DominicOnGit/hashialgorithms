import type { Hashi } from '@/stores/hashi'

export class HashiBuilder {
  public build(): Hashi {
    const res = {
      size: 5,
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 2, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 5, posY: 2, targetDegree: 4 },
        { posX: 5, posY: 4, targetDegree: 5 }
      ],
      edges: [
        { v1: 0, v2: 1, multiplicity: 1 },
        { v1: 3, v2: 2, multiplicity: 2 },
        { v1: 0, v2: 2, multiplicity: 1 },
        { v1: 4, v2: 3, multiplicity: 2 }
      ]
    }

    if (!this.validate(res)) {
      console.error('invalid hashi')
      throw new Error()
    }
    return res
  }

  public validate(hashi: Hashi): boolean {
    const invalidEdge = hashi.edges.find(
      (e) => e.v1 < 0 || e.v2 < 0 || e.v1 >= hashi.vertices.length || e.v2 >= hashi.vertices.length
    )
    return invalidEdge == null
  }
}
