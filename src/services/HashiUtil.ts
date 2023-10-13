import type { Edge, Hashi } from '@/stores/hashi'

export class HashiUtil {
  constructor(private hashi: Hashi) {}

  getSize(): { nx: number; ny: number } {
    return {
      nx: Math.max(...this.hashi.vertices.map((v) => v.posX)),
      ny: Math.max(...this.hashi.vertices.map((v) => v.posY))
    }
  }

  // makeGrid(): EdgeVertexNull[][] {
  //   const size = this.getSize()
  //   const grid: EdgeVertexNull[][] = Array.from({ length: size.ny }, () =>
  //     Array.from({ length: size.nx })
  //   )

  //   this.hashi.vertices.forEach((vertex) => {
  //     grid[vertex.posY][vertex.posX] = vertex
  //   })
  //   this.hashi.edges.forEach((edge) => {
  //     const v1 = this.hashi.vertices[edge.v1]
  //     const v2 = this.hashi.vertices[edge.v2]
  //     if (v1.posX === v2.posX) {
  //       for (let y = v1.posY + 1; y < v2.posY; y++) {
  //         grid[y][v1.posX] = edge
  //       }
  //     }
  //     if (v1.posY === v2.posY) {
  //       for (let x = v1.posX + 1; x < v2.posX; x++) {
  //         grid[v1.posY][x] = edge
  //       }
  //     }
  //   })
  //   return grid
  // }

  getEdgeAt(x: number, y: number): Edge | undefined {
    const found = this.hashi.edges.find((edge) => {
      const v1 = this.hashi.vertices[edge.v1]
      const v2 = this.hashi.vertices[edge.v2]

      if (v1.posX === v2.posX && v1.posX === x) {
        return v1.posY <= y && y <= v2.posY
      }
      if (v1.posY === v2.posY && v1.posY === x) {
        return v1.posX <= x && x <= v2.posX
      }
      return false
    })
    return found
  }

  getAllEdges(): Edge[] {
    const res: Edge[] = []
    for (let v1Index = 0; v1Index < this.hashi.vertices.length; v1Index++)
      for (let v2Index = v1Index + 1; v2Index < this.hashi.vertices.length; v2Index++) {
        const v1 = this.hashi.vertices[v1Index]
        const v2 = this.hashi.vertices[v2Index]

        const existing = this.hashi.edges.find((e) => e.v1 === v1Index && e.v2 === v2Index)
        if (existing != null) {
          res.push(existing)
        } else {
          let valid = true
          if (v1.posX === v2.posX) {
            for (let y = v1.posY + 1; y < v2.posY; y++) {
              const hit = this.getEdgeAt(v1.posX, y)
              if (hit != null) {
                valid = false
                break
              }
            }
            if (valid) {
              res.push({ v1: v1Index, v2: v2Index, multiplicity: 0 })
            }
          }
          if (v1.posY === v2.posY) {
            for (let x = v1.posX + 1; x < v2.posX; x++) {
              const hit = this.getEdgeAt(x, v1.posY)
              if (hit != null) {
                valid = false
                break
              }
            }
            if (valid) {
              res.push({ v1: v1Index, v2: v2Index, multiplicity: 0 })
            }
          }
        }
      }
    return res
  }
}
