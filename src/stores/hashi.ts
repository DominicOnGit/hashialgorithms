import { HashiBuilder } from '@/services/HashiBuilder'
import { defineStore } from 'pinia'

export interface Vertex {
  posX: number
  posY: number

  targetDegree: number
}

export interface Edge {
  v1: number

  // v1 < v2
  v2: number

  multiplicity: number
}

export interface Hashi {
  // i < j =>  (vi.posY == vj.posY => vi.posX < vj.posX)  && (vi.posX == vj.posX => vi.posY < vj.posY)
  vertices: Vertex[]

  // v1.posX == v2.posX => v1.posY < v2.posY
  // v1.posY == v2.posY => v1.posX < v2.posX
  edges: Edge[]
}

export const useHashiStore = defineStore('hashi', {
  state: (): Hashi => {
    return new HashiBuilder().build()
  },
  actions: {
    setHashi(hashi: Hashi): void {
      console.log(`setHashi()`, hashi)
      this.$patch(hashi)
    },
    addEdge(v1: number, v2: number): void {
      console.log(`addEdge(${v1}, ${v2})`)
      const found = this.edges.find((e) => e.v1 === v1 && e.v2 === v2)
      if (found) {
        found.multiplicity++
      } else {
        this.edges.push({ v1, v2, multiplicity: 1 })
      }
    }
  }
})

export function validateHashi(hashi: Hashi): void {
  for (let i = 0; i < hashi.vertices.length - 1; i++) {
    const vi = hashi.vertices[i]
    const vj = hashi.vertices[i + 1]
    if ((vi.posY == vj.posY && vi.posX >= vj.posX) || (vi.posX == vj.posX && vi.posY >= vj.posY)) {
      throw new Error('Unsorted vertices')
    }
  }

  hashi.edges.forEach((e) => {
    if (e.v1 < 0 || e.v2 < 0 || e.v1 >= hashi.vertices.length || e.v2 >= hashi.vertices.length) {
      throw new Error('Vertex index out of bounds')
    }
    if (e.v1 === e.v2) {
      throw new Error('self edge')
    }
    if (e.v1 > e.v2) {
      throw new Error('unordered edge')
    }
  })
}
