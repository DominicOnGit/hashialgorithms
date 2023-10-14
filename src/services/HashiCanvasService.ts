import { validateHashi, type Edge, type Hashi, type Vertex } from '@/stores/hashi';

const GridSizeFactor = 3;
const IslandRadiusFactor = 1;
const DoubleLineGap = 2;

function compareNumbers(a: number, b: number): number {
  return b > a ? 1 : b < a ? -1 : 0;
}

export class HashiCanvasService {
  private gridSize: number;
  private islandRadius: number;
  private textHeight: number;
  private textSize: number;

  constructor(
    private canvas: CanvasRenderingContext2D,
    private hashi: Hashi
  ) {
    validateHashi(hashi);
    this.canvas.font = '15px sans-serif';
    this.canvas.textAlign = 'center';
    const textMeasure = this.canvas.measureText('5');
    this.textHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;
    this.textSize = Math.max(this.textHeight, textMeasure.width);

    this.islandRadius = IslandRadiusFactor * this.textSize;
    this.gridSize = this.islandRadius * GridSizeFactor;
  }

  private drawVertex(vertex: Vertex): void {
    this.canvas.beginPath();
    this.canvas.arc(
      vertex.posX * this.gridSize,
      vertex.posY * this.gridSize,
      this.islandRadius,
      0,
      2 * Math.PI
    );
    this.canvas.stroke();

    this.canvas.textBaseline = 'alphabetic';
    this.canvas.strokeText(
      vertex.targetDegree.toString(),
      vertex.posX * this.gridSize,
      vertex.posY * this.gridSize + this.textHeight / 2.0
    );
    // this.canvas.textBaseline = "middle"
    // this.canvas.strokeText(vertex.targetDegree.toString(), vertex.posX * gridSize, vertex.posY * gridSize);
  }

  private line(v1: Vertex, v2: Vertex, offset: number): void {
    const dx = compareNumbers(v1.posX, v2.posX);
    const dy = compareNumbers(v1.posY, v2.posY);

    this.canvas.moveTo(
      v1.posX * this.gridSize + dx * this.islandRadius + dy * offset,
      v1.posY * this.gridSize + dy * this.islandRadius + dx * offset
    );
    this.canvas.lineTo(
      v2.posX * this.gridSize - dx * this.islandRadius + dy * offset,
      v2.posY * this.gridSize - dy * this.islandRadius + dx * offset
    );
  }

  private drawEdge(edge: Edge): void {
    const v1 = this.hashi.vertices[edge.v1];
    const v2 = this.hashi.vertices[edge.v2];

    this.canvas.beginPath();
    if (edge.multiplicity === 1) {
      this.line(v1, v2, 0);
    }

    if (edge.multiplicity === 2) {
      this.line(v1, v2, -DoubleLineGap);
      this.line(v1, v2, +DoubleLineGap);
    }
    this.canvas.stroke();
  }

  draw(): void {
    // clear canvas
    this.canvas.clearRect(0, 0, 400, 400);

    this.hashi.vertices.forEach((vertex) => this.drawVertex(vertex));

    this.hashi.edges.forEach((edge) => this.drawEdge(edge));
  }
}
