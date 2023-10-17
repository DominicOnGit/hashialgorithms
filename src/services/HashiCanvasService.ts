import { validateHashi, type Edge, type Hashi, type Vertex } from '@/stores/hashi';
import type { HashiEdge, HashiUtil, HashiVertex } from './HashiUtil';

const GridSizeFactor = 3;
const IslandRadiusFactor = 1;
const LineGap = 4;

const NormalStyle = 'black';
const SatisfiedStyle = 'darkgreen';
const ErrorStyle = 'red';

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
    private hashi: HashiUtil
  ) {
    this.canvas.font = '15px sans-serif';
    this.canvas.textAlign = 'center';
    const textMeasure = this.canvas.measureText('5');
    this.textHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;
    this.textSize = Math.max(this.textHeight, textMeasure.width);

    this.islandRadius = IslandRadiusFactor * this.textSize;
    this.gridSize = this.islandRadius * GridSizeFactor;
  }

  private drawVertex(vertex: HashiVertex): void {
    this.canvas.beginPath();
    this.canvas.strokeStyle = NormalStyle;
    this.canvas.arc(
      vertex.posX * this.gridSize,
      vertex.posY * this.gridSize,
      this.islandRadius,
      0,
      2 * Math.PI
    );
    this.canvas.stroke();

    const degree = this.hashi.getDegree(vertex);
    if (degree === vertex.targetDegree) {
      this.canvas.strokeStyle = SatisfiedStyle;
    } else if (degree > vertex.targetDegree) {
      this.canvas.strokeStyle = ErrorStyle;
    }

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

  private drawEdge(edge: HashiEdge): void {
    this.canvas.beginPath();
    this.canvas.strokeStyle = edge.multiplicity <= 2 ? NormalStyle : ErrorStyle;
    if (edge.multiplicity === 1) {
      this.line(edge.vertex1, edge.vertex2, 0);
    }

    if (edge.multiplicity === 2) {
      this.line(edge.vertex1, edge.vertex2, -LineGap / 2);
      this.line(edge.vertex1, edge.vertex2, +LineGap / 2);
    }

    if (edge.multiplicity > 2) {
      this.line(edge.vertex1, edge.vertex2, -0.8 * LineGap);
      this.line(edge.vertex1, edge.vertex2, 0);
      this.line(edge.vertex1, edge.vertex2, +0.8 * LineGap);
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
