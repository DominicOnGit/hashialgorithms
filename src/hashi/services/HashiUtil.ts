import { validateHashi, type Edge, type Hashi, type Vertex } from '@/hashi/stores/hashi';
import type { CustomPropertyData, CustomPropertyDefs } from '@/stores/CustomPropertyDef';

export interface Selectable {
  wrappedItem: Edge | Vertex;
  toString(): string;
}

export class HashiVertex implements Selectable, Vertex {
  constructor(
    private vertex: Vertex,
    public index: number
  ) {
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

  public equals(other: Vertex): boolean {
    return this.posX === other.posX && this.posY === other.posY;
  }

  public isIncident(e: HashiEdge): boolean {
    return e.v1 === this.index || e.v2 === this.index;
  }

  public toString(): string {
    return `v${this.index}`;
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

  public set multiplicity(value: number) {
    if (value < 0 || value > 2) throw new Error('invalid multiplicity');
    this.edge.multiplicity = value;
  }

  public getCustomProperties(propertyDefs: CustomPropertyDefs): CustomPropertyData[] {
    if (this.edge.customPropertyValues != null) {
      return Object.entries(this.edge.customPropertyValues)
        .map(([name, value]) => ({ value, def: propertyDefs.find((x) => x.name === name) }))
        .filter((x) => x.def != null)
        .map<CustomPropertyData>(({ value, def }) => {
          if (def == null) throw new Error();
          return {
            ...def,
            value
          };
        });
    }
    return [];
  }

  public equals(other: Edge): boolean {
    return this.v1 === other.v1 && this.v2 === other.v2;
  }

  public isIncident(v: HashiVertex): boolean {
    return v.index === this.v1 || v.index === this.v2;
  }

  public getOtherEnd(v: HashiVertex): HashiVertex {
    if (v.index === this.v1) return this.vertex2;
    if (v.index === this.v2) return this.vertex1;
    throw new Error('not incident');
  }

  public toString(): string {
    return `${this.v1}-${this.v2}`;
  }
}

export class HashiUtil {
  vertices: HashiVertex[];
  edges: HashiEdge[];

  public get wrappedItem(): Hashi {
    return this.hashi;
  }

  constructor(private hashi: Hashi) {
    validateHashi(hashi);

    this.vertices = hashi.vertices.map((v, i) => new HashiVertex(v, i));
    this.edges = hashi.edges.map((e) => new HashiEdge(e, this.vertices));

    this.addMissingEdges();
  }

  incidentEdges(v: HashiVertex): HashiEdge[] {
    return this.edges.filter((e) => e.isIncident(v));
  }

  incidentVertices(e: HashiEdge): HashiVertex[] {
    return [e.vertex1, e.vertex2];
  }

  getDegree(v: HashiVertex): number {
    return this.incidentEdges(v).reduce((sum, e) => sum + e.multiplicity, 0);
  }

  adjacentVertices(v: HashiVertex): HashiVertex[] {
    const incidentEdges = this.incidentEdges(v).filter((e) => e.multiplicity > 0);
    const res = incidentEdges.map((e) => e.getOtherEnd(v));
    return res;
  }

  getEdge(v1: number, v2: number): HashiEdge {
    const edge = this.edges.find((e) => e.v1 === v1 && e.v2 === v2);
    if (edge == null) throw new Error();
    return edge;
  }

  getSize(): HashiSize {
    return {
      nx: Math.max(...this.hashi.vertices.map((v) => v.posX)),
      ny: Math.max(...this.hashi.vertices.map((v) => v.posY))
    };
  }

  getVertexAt(x: number, y: number): HashiVertex | undefined {
    return this.vertices.find((v) => v.posX === x && v.posY === y);
  }

  getEdgeAt(x: number, y: number): HashiEdge | undefined {
    const found = this.edges.find((edge) => {
      const v1 = edge.vertex1;
      const v2 = edge.vertex2;

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

  getNextVertex(xStart: number, yStart: number, dx: number, dy: number): Vertex | null {
    const size = this.getSize();
    for (
      let x = xStart + dx, y = yStart + dy;
      0 <= x && x <= size.nx && 0 <= y && y <= size.ny;
      x += dx, y += dy
    ) {
      const vertex = this.getVertexAt(x, y);
      if (vertex != null) return vertex;
    }
    return null;
  }

  private addMissingEdges(): void {
    for (let v1Index = 0; v1Index < this.vertices.length; v1Index++)
      for (let v2Index = v1Index + 1; v2Index < this.vertices.length; v2Index++) {
        const v1 = this.vertices[v1Index];
        const v2 = this.vertices[v2Index];

        const existing = this.edges.find((e) => e.v1 === v1Index && e.v2 === v2Index);
        if (existing == null) {
          let valid = true;
          if (v1.posX === v2.posX) {
            for (let y = v1.posY + 1; y < v2.posY; y++) {
              const hitVertex = this.getVertexAt(v1.posX, y);
              const hitEdge = this.getEdgeAt(v1.posX, y);
              if (hitVertex != null || hitEdge != null) {
                valid = false;
                break;
              }
            }
            if (valid) {
              this.addEdge(v1Index, v2Index, 0);
            }
          }
          if (v1.posY === v2.posY) {
            for (let x = v1.posX + 1; x < v2.posX; x++) {
              const hitVertex = this.getVertexAt(x, v1.posY);
              const hitEdge = this.getEdgeAt(x, v1.posY);
              if (hitVertex != null || hitEdge != null) {
                valid = false;
                break;
              }
            }
            if (valid) {
              this.addEdge(v1Index, v2Index, 0);
            }
          }
        }
      }
  }

  private addEdge(v1: number, v2: number, multiplicity: number): void {
    const edge = { v1, v2, multiplicity };
    this.hashi.edges.push(edge);
    this.edges.push(new HashiEdge(edge, this.vertices));
  }

  public calculateTargetDegrees(): void {
    this.vertices.forEach((v) => {
      v.wrappedItem.targetDegree = this.incidentEdges(v).reduce(
        (sum, e) => sum + e.multiplicity,
        0
      );
    });
  }

  public IsValid(): boolean {
    return (
      this.edges.every((e) => e.multiplicity <= 2) &&
      this.vertices.every((v) => this.getDegree(v) <= v.targetDegree)
    );
  }

  public IsConnected(): boolean {
    if (this.vertices.length === 0) return true;
    const reachedAndProcessed: HashiVertex[] = [];
    const reachendNotProcess = [this.vertices[0]];

    while (reachendNotProcess.length > 0) {
      const v = reachendNotProcess.pop();
      if (v == null) throw new Error();
      if (!reachedAndProcessed.includes(v)) {
        reachendNotProcess.push(...this.adjacentVertices(v));
      }
    }

    return reachedAndProcessed.length === this.vertices.length;
  }

  public IsSolved(): boolean {
    return this.vertices.every((v) => this.getDegree(v) === v.targetDegree) && this.IsConnected();
  }

  public getSolutionState(): SolutionState {
    if (!this.IsValid()) return 'invalid';
    if (this.IsSolved()) return 'solved';
    return 'open';
  }

  public clearEdges(): void {
    this.edges.forEach((e) => (e.multiplicity = 0));
  }
}

export type SolutionState = 'solved' | 'invalid' | 'wrong' | 'open';

// export interface DiscriminatedEdge {
//   kind: 'edge'
//   edge: Edge
// }
// export interface DiscriminatedVertex {
//   kind: 'vertex'
//   vertex: Vertex
// }

export type EdgeVertexNull = Vertex | Edge | null;

export type HashiSize = { nx: number; ny: number };
