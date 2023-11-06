import { type Vertex } from '@/hashi/stores/hashi';
import type { HashiEdge, HashiUtil, HashiVertex } from './HashiUtil';
import type { CustomPropertyDefs } from '@/stores/CustomPropertyDef';

const GridSizeFactor = 5;
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
    private hashi: HashiUtil,
    private customPropertyDefs: CustomPropertyDefs
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
    this.canvas.setLineDash(edge.multiplicity === 0 ? [1, 3] : []);

    if (
      (edge.multiplicity === 0 && edge.getCustomProperties(this.customPropertyDefs).length > 0) ||
      edge.multiplicity === 1
    ) {
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

    this.canvas.setLineDash([]);
    this.drawEdgeProperties(edge);
  }

  private drawEdgeProperties(edge: HashiEdge) {
    this.canvas.textBaseline = 'middle';
    this.canvas.textAlign = 'center';

    const xOffset = edge.vertex1.posX === edge.vertex2.posX ? 10 : 0;
    const yOffset = edge.vertex1.posY === edge.vertex2.posY ? -10 : 0;
    const x = ((edge.vertex1.posX + edge.vertex2.posX) * this.gridSize) / 2 + xOffset;
    const y = ((edge.vertex1.posY + edge.vertex2.posY) * this.gridSize) / 2 + yOffset;

    edge.getCustomProperties(this.customPropertyDefs).forEach((prop) => {
      this.canvas.strokeText(prop.value.toString(), x, y);
    });
  }

  draw(): void {
    // clear canvas
    this.canvas.clearRect(0, 0, 400, 400);

    this.hashi.vertices.forEach((vertex) => this.drawVertex(vertex));

    this.hashi.edges.forEach((edge) => this.drawEdge(edge));
  }
}
