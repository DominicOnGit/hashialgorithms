import { type Vertex } from '@/hashi/stores/hashi';
import type { HashiEdge, HashiSize, HashiUtil, HashiVertex } from './HashiUtil';
import type { CustomPropertyDefs } from '@/stores/CustomPropertyDef';
import { HashiViewerLogger } from '@/services/logging';

const IslandRadiusFactor = 1;
const LineGap = 4;

const DesiredMaxPx = 500;
const DesiredBlockSizes = [80, 60, 40];

const NormalStyle = 'black';
const SatisfiedStyle = 'darkgreen';
const ErrorStyle = 'red';

export const Rescale = 1;

function compareNumbers(a: number, b: number): number {
  return b > a ? 1 : b < a ? -1 : 0;
}

export function desiredSize(hashiSize: HashiSize): { width: number; height: number } {
  const maxSize = Math.max(hashiSize.nx, hashiSize.ny);

  const blockSize =
    DesiredBlockSizes.find((size) => size * maxSize < DesiredMaxPx) ??
    DesiredBlockSizes[DesiredBlockSizes.length - 1];

  return {
    width: blockSize * hashiSize.nx,
    height: blockSize * hashiSize.ny
  };
}

export class HashiCanvasService {
  private gridSize: number;
  private islandRadius: number;
  private textHeight: number;
  private textSize: number;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(
    private canvas: CanvasRenderingContext2D,
    private hashi: HashiUtil,
    private customPropertyDefs: CustomPropertyDefs
  ) {
    // canvas.translate(0.5, 0.5);
    canvas.scale(Rescale, Rescale);
    const hashiSize = this.hashi.getSize();
    this.canvasWidth = this.canvas.canvas.width / Rescale;
    this.canvasHeight = this.canvas.canvas.height / Rescale;

    this.gridSize = Math.min(this.canvasWidth / hashiSize.nx, this.canvasHeight / hashiSize.ny);

    const fontSize = this.gridSize < 80 ? 16 : 18;

    this.canvas.font = `${fontSize}px sans-serif`;
    this.canvas.textAlign = 'center';
    const textMeasure = this.canvas.measureText('5');
    this.textHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;
    this.textSize = Math.max(this.textHeight, textMeasure.width);

    this.islandRadius = IslandRadiusFactor * this.textSize;

    HashiViewerLogger.info(
      'HashiCanvasService initialized',
      `canvas size: ${this.canvasWidth} x ${this.canvasHeight}`,
      `hashi size: ${hashiSize.nx} x ${hashiSize.ny}`,
      `gridSize: ${this.gridSize}, font: ${fontSize}, islandRadius: ${this.islandRadius}, textHeight: ${this.textHeight}, textSize: ${this.textSize}`
    );
  }

  private getVertexCenterX(vertex: Vertex): number {
    return (vertex.posX - 0.5) * this.gridSize;
  }

  private getVertexCenterY(vertex: Vertex): number {
    return (vertex.posY - 0.5) * this.gridSize;
  }

  private getEdgeCenterX(edge: HashiEdge): number {
    return (this.getVertexCenterX(edge.vertex1) + this.getVertexCenterX(edge.vertex2)) / 2;
  }
  private getEdgeCenterY(edge: HashiEdge): number {
    return (this.getVertexCenterY(edge.vertex1) + this.getVertexCenterY(edge.vertex2)) / 2;
  }

  private drawVertex(vertex: HashiVertex): void {
    // HashiViewerLogger.debug(
    //   `Drawing vertex ${vertex.posX}, ${vertex.posY} at ${this.getVertexCenterX(vertex)}, ${this.getVertexCenterY(vertex)}`
    // );
    this.canvas.beginPath();
    this.canvas.strokeStyle = NormalStyle;
    this.canvas.arc(
      this.getVertexCenterX(vertex),
      this.getVertexCenterY(vertex),
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
    this.canvas.fillText(
      vertex.targetDegree.toString(),
      this.getVertexCenterX(vertex),
      this.getVertexCenterY(vertex) + this.textHeight / 2.0
    );
  }

  private line(v1: Vertex, v2: Vertex, offset: number): void {
    const dx = compareNumbers(v1.posX, v2.posX);
    const dy = compareNumbers(v1.posY, v2.posY);

    this.canvas.moveTo(
      this.getVertexCenterX(v1) + dx * this.islandRadius + dy * offset,
      this.getVertexCenterY(v1) + dy * this.islandRadius + dx * offset
    );
    this.canvas.lineTo(
      this.getVertexCenterX(v2) - dx * this.islandRadius + dy * offset,
      this.getVertexCenterY(v2) - dy * this.islandRadius + dx * offset
    );
  }

  showProperties = true;

  private drawEdge(edge: HashiEdge): void {
    this.canvas.beginPath();
    this.canvas.strokeStyle = edge.multiplicity <= 2 ? NormalStyle : ErrorStyle;
    this.canvas.setLineDash(edge.multiplicity === 0 ? [1, 3] : []);

    if (
      (edge.multiplicity === 0 &&
        edge.getCustomProperties(this.customPropertyDefs).length > 0 &&
        this.showProperties) ||
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
    if (this.showProperties) {
      this.drawEdgeProperties(edge);
    }
  }

  private drawEdgeProperties(edge: HashiEdge) {
    this.canvas.textBaseline = 'middle';
    this.canvas.textAlign = 'center';

    const xOffset = edge.vertex1.posX === edge.vertex2.posX ? 10 : 0;
    const yOffset = edge.vertex1.posY === edge.vertex2.posY ? -10 : 0;
    const x = this.getEdgeCenterX(edge) + xOffset;
    const y = this.getEdgeCenterY(edge) + yOffset;

    edge.getCustomProperties(this.customPropertyDefs).forEach((prop) => {
      this.canvas.strokeText(prop.value.toString(), x, y);
    });
  }

  draw(): void {
    // clear canvas
    this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.hashi.vertices.forEach((vertex) => this.drawVertex(vertex));

    this.hashi.edges.forEach((edge) => this.drawEdge(edge));
  }
}
