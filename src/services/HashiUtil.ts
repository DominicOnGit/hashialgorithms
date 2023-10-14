import { validateHashi, type Edge, type Hashi, type Vertex } from '@/stores/hashi';

export interface Selectable {
  wrappedItem: Edge | Vertex;
}

export class HashiVertex implements Selectable, Vertex {
  constructor(private vertex: Vertex) {
    if (vertex instanceof HashiVertex) throw new Error('recursive');
  }

  public get wrappedItem(): Vertex {
    return this.vertex;
  }

  public get posX(): number {
    return this.vertex.posX;
  }
  public get posY(): number {
    return this.vertex.posY;
  }

  public get targetDegree(): number {
    return this.vertex.targetDegree;
  }
}

export class HashiEdge implements Selectable, Edge {
  vertex1: HashiVertex;
  vertex2: HashiVertex;

  constructor(
    public edge: Edge,
    vertices: HashiVertex[]
  ) {
    if (edge instanceof HashiEdge) throw new Error('recursive');
    this.vertex1 = vertices[edge.v1];
    this.vertex2 = vertices[edge.v2];
  }

  public get wrappedItem(): Edge {
    return this.edge;
  }

  public get v1(): number {
    return this.edge.v1;
  }
  public get v2(): number {
    return this.edge.v2;
  }
  public get multiplicity(): number {
    return this.edge.multiplicity;
  }

  public equals(other: Edge): boolean {
    return this.v1 === other.v1 && this.v2 === other.v2;
  }
}

export class HashiUtil {
  vertices: HashiVertex[];
  edges: HashiEdge[];

  constructor(private hashi: Hashi) {
    validateHashi(hashi);

    this.vertices = hashi.vertices.map((v) => new HashiVertex(v));
    this.edges = hashi.edges.map((e) => new HashiEdge(e, this.vertices));
  }

  getSize(): { nx: number; ny: number } {
    return {
      nx: Math.max(...this.hashi.vertices.map((v) => v.posX)),
      ny: Math.max(...this.hashi.vertices.map((v) => v.posY))
    };
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
      const v1 = this.hashi.vertices[edge.v1];
      const v2 = this.hashi.vertices[edge.v2];

      if (v1.posX === v2.posX && v1.posX === x) {
        return v1.posY <= y && y <= v2.posY;
      }
      if (v1.posY === v2.posY && v1.posY === y) {
        return v1.posX <= x && x <= v2.posX;
      }
      return false;
    });
    return found;
  }

  getAllEdges(): HashiEdge[] {
    const res: HashiEdge[] = [];
    for (let v1Index = 0; v1Index < this.vertices.length; v1Index++)
      for (let v2Index = v1Index + 1; v2Index < this.vertices.length; v2Index++) {
        const v1 = this.vertices[v1Index];
        const v2 = this.vertices[v2Index];

        const existing = this.edges.find((e) => e.v1 === v1Index && e.v2 === v2Index);
        if (existing != null) {
          res.push(existing);
        } else {
          let valid = true;
          if (v1.posX === v2.posX) {
            for (let y = v1.posY + 1; y < v2.posY; y++) {
              const hit = this.getEdgeAt(v1.posX, y);
              if (hit != null) {
                valid = false;
                break;
              }
            }
            if (valid) {
              res.push(new HashiEdge({ v1: v1Index, v2: v2Index, multiplicity: 0 }, this.vertices));
            }
          }
          if (v1.posY === v2.posY) {
            for (let x = v1.posX + 1; x < v2.posX; x++) {
              const hit = this.getEdgeAt(x, v1.posY);
              if (hit != null) {
                valid = false;
                break;
              }
            }
            if (valid) {
              res.push(new HashiEdge({ v1: v1Index, v2: v2Index, multiplicity: 0 }, this.vertices));
            }
          }
        }
      }
    return res;
  }
}

// export interface DiscriminatedEdge {
//   kind: 'edge'
//   edge: Edge
// }
// export interface DiscriminatedVertex {
//   kind: 'vertex'
//   vertex: Vertex
// }

export type EdgeVertexNull = Vertex | Edge | null;
