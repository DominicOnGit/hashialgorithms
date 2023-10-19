import { validateHashi, type Hashi, type Vertex, type Edge } from '@/stores/hashi';
import { HashiUtil, type HashiSize } from './HashiUtil';
import { getRandomInt, pickRandom } from './randomUtil';

export class HashiBuilder {
  public hashi: Hashi;

  constructor(hashi?: Hashi | undefined) {
    this.hashi = hashi ?? { vertices: [], edges: [] };
    validateHashi(this.hashi);
  }

  addVertex(newVertex: Vertex): void {
    console.debug('addVertex', newVertex);
    const firstTooBig = this.hashi.vertices.findIndex(
      (v) => v.posY > newVertex.posY || (v.posY === newVertex.posY && v.posX >= newVertex.posX)
    );
    if (firstTooBig === -1) {
      this.hashi.vertices.push(newVertex);
    } else {
      if (
        this.hashi.vertices[firstTooBig].posX === newVertex.posX &&
        this.hashi.vertices[firstTooBig].posY === newVertex.posY
      )
        throw new Error('position not free');
      this.hashi.vertices.splice(firstTooBig, 0, newVertex);
      this.hashi.edges.forEach((e) => {
        if (e.v1 >= firstTooBig) e.v1++;
        if (e.v2 >= firstTooBig) e.v2++;
      });
    }
    validateHashi(this.hashi);
  }

  addEdge(newEdge: Edge): void {
    if (newEdge.v1 > newEdge.v2) {
      this.hashi.edges.push({
        v1: newEdge.v2,
        v2: newEdge.v1,
        multiplicity: newEdge.multiplicity
      });
    } else {
      this.hashi.edges.push(newEdge);
    }
    validateHashi(this.hashi);
  }

  addVertexAndConnect(newVertex: Vertex, connectTo: Vertex, multiplicity: number): void {
    this.addVertex(newVertex);

    const updatedNewVertexIndex = this.hashi.vertices.findIndex(
      (v) => v.posX === newVertex.posX && v.posY === newVertex.posY
    );
    const updatedConnectToIndex = this.hashi.vertices.findIndex(
      (v) => v.posX === connectTo.posX && v.posY === connectTo.posY
    );
    if (updatedNewVertexIndex === -1 || updatedConnectToIndex === -1) throw new Error();
    this.addEdge({
      v1: updatedConnectToIndex,
      v2: updatedNewVertexIndex,
      multiplicity
    });
  }

  // 0 if no extension possible
  private getMaxExtension(
    hashiUtil: HashiUtil,
    maxSize: HashiSize,
    vertex: Vertex,
    dx: number,
    dy: number
  ): number {
    const size = hashiUtil.getSize();

    for (
      let y = vertex.posY + dy, x = vertex.posX + dx, step = 0;
      0 <= y && y <= size.ny && 0 <= x && x <= size.nx;
      x += dx, y += dy, step++
    ) {
      if (
        x <= 0 ||
        maxSize.nx < x ||
        y <= 0 ||
        maxSize.ny < y ||
        hashiUtil.getVertexAt(x, y) != null ||
        hashiUtil.getEdgeAt(x, y) != null
      ) {
        return step;
      }
    }

    if (dx > 0) return maxSize.nx - vertex.posX;
    if (dy > 0) return maxSize.ny - vertex.posY;

    throw new Error();
    if (dx < 0) return vertex.posX - 1;
    if (dy < 0) return vertex.posY - 1;
  }

  private findVectorToGrow(
    hashiUtil: HashiUtil,
    maxSize: HashiSize,
    candidates: Vertex[]
  ): { vertex: Vertex; vector: DirectionAndDistance } | null {
    const directions: Direction[] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    while (candidates.length > 0) {
      const pickIndex = getRandomInt(0, candidates.length);
      const pickedVertex = candidates[pickIndex];
      candidates.splice(pickIndex, 1);

      const directionAndMaxExtension: DirectionAndDistance[] = directions.map((d) => {
        return {
          dir: d,
          dist: this.getMaxExtension(hashiUtil, maxSize, pickedVertex, d[0], d[1])
        };
      });
      const validDirections = directionAndMaxExtension.filter((x) => x.dist !== 0);

      if (validDirections.length > 0) {
        return {
          vertex: pickedVertex,
          vector: pickRandom(validDirections)
        };
      }
    }
    return null;
  }

  grow(maybeMaxSize?: HashiSize): boolean {
    const maxSize: HashiSize = maybeMaxSize ?? { nx: 100, ny: 100 };
    const hashiUtil = new HashiUtil(this.hashi);

    // pick vertex with degree < 4
    const candidates = hashiUtil.vertices.filter((v) => hashiUtil.incidentEdges(v).length < 4);

    const vectorToGrow = this.findVectorToGrow(hashiUtil, maxSize, candidates);
    if (vectorToGrow != null) {
      const limitedMax = Math.min(vectorToGrow.vector.dist, 5);
      const randomDist = getRandomInt(1, limitedMax + 1);

      const newVertex: Vertex = {
        posY: vectorToGrow.vertex.posY + randomDist * vectorToGrow.vector.dir[1],
        posX: vectorToGrow.vertex.posX + randomDist * vectorToGrow.vector.dir[0],
        targetDegree: 1
      };
      this.addVertexAndConnect(newVertex, vectorToGrow.vertex, 1);
      return true;
    } else {
      return false;
    }
  }
}

type Direction = [dx: number, dy: number];
type DirectionAndDistance = { dir: Direction; dist: number };
