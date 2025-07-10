import type { Hashi, Vertex } from '../stores/hashi';
import { HashiUtil } from './HashiUtil';

export class HashiTextConverter {
  public parse(text: string): HashiUtil {
    const lines = this.getLines(text);

    const vertices: Vertex[] = this.parseVertices(lines);

    const hashi: Hashi = { vertices, edges: [] };

    const hashiUtil = new HashiUtil(hashi);

    this.parseEdges(lines, hashiUtil);
    hashiUtil.calculateTargetDegrees();

    return hashiUtil;
  }

  private getLines(text: string): string[] {
    const lines = text.split('\n');

    while (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    // for each line, find number of leading whitespace characters
    const leadingWhitespaceCounts = lines.map((line) => {
      const match = line.match(/^\s*/);
      return match ? match[0].length : 0;
    });

    const minLeadingWhitespace = Math.min(...leadingWhitespaceCounts);
    const trimmedLines =
      minLeadingWhitespace > 0 ? lines.map((line) => line.slice(minLeadingWhitespace)) : lines;

    return trimmedLines;
  }

  private parseVertices(lines: string[]): Vertex[] {
    const vertices: Vertex[] = [];
    lines.forEach((line, index) => {
      for (let col = 0; col < line.length; col++) {
        const char = line[col];

        if (char === 'x') {
          const vertex: Vertex = {
            posX: col,
            posY: index,
            targetDegree: 0
          };
          vertices.push(vertex);
        }
      }
    });

    vertices.sort((a, b) => {
      if (a.posY === b.posY) {
        a.posX - b.posX;
      }
      return a.posY - b.posY;
    });
    return vertices;
  }

  private parseEdges(lines: string[], hashiUtil: HashiUtil): void {
    lines.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) {
        const char = line[x];

        if (char === '0' || char === '1' || char === '2') {
          const multiplicity = parseInt(char, 10);
          const edge = hashiUtil.getEdgeAt(x, y);
          if (edge == null) {
            throw new Error(`Edge not found at (${x}, ${y})`);
          }
          edge.multiplicity = multiplicity;
        }
      }
    });
  }
}
