import { validateHashi, type Hashi, type Vertex, type Edge } from '@/stores/hashi';
import { expect, test, describe } from 'vitest';
import { HashiBuilder } from './HashiBuilder';

function startingHashi(): Hashi {
  const res: Hashi = {
    vertices: [
      { posY: 1, posX: 1, targetDegree: 2 },
      { posY: 1, posX: 5, targetDegree: 1 },
      { posY: 5, posX: 1, targetDegree: 1 }
    ],
    edges: [{ v1: 0, v2: 2, multiplicity: 1 }]
  };

  return res;
}

describe('addVertex', () => {
  test('to empty hashi', () => {
    const builder = new HashiBuilder();
    const newVertex: Vertex = { posX: 2, posY: 2, targetDegree: 2 };
    builder.addVertex(newVertex);

    validateHashi(builder.hashi);
    const expectedHashi: Hashi = {
      vertices: [newVertex],
      edges: []
    };
    expect(builder.hashi).toEqual(expectedHashi);
  });

  test('in the middle', () => {
    const builder = new HashiBuilder(startingHashi());
    const newVertex: Vertex = { posX: 2, posY: 2, targetDegree: 2 };
    builder.addVertex(newVertex);

    validateHashi(builder.hashi);
    const expectedHashi: Hashi = {
      vertices: [
        { posY: 1, posX: 1, targetDegree: 2 },
        { posY: 1, posX: 5, targetDegree: 1 },
        newVertex,
        { posY: 5, posX: 1, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 3, multiplicity: 1 }]
    };
    expect(builder.hashi).toEqual(expectedHashi);
  });

  test('at the start', () => {
    const builder = new HashiBuilder(startingHashi());
    const newVertex: Vertex = { posY: 0, posX: 10, targetDegree: 2 };
    builder.addVertex(newVertex);

    validateHashi(builder.hashi);
    const expectedHashi: Hashi = {
      vertices: [
        newVertex,
        { posY: 1, posX: 1, targetDegree: 2 },
        { posY: 1, posX: 5, targetDegree: 1 },
        { posY: 5, posX: 1, targetDegree: 1 }
      ],
      edges: [{ v1: 1, v2: 3, multiplicity: 1 }]
    };
    expect(builder.hashi).toEqual(expectedHashi);
  });

  test('at the end', () => {
    const builder = new HashiBuilder(startingHashi());
    const newVertex: Vertex = { posY: 6, posX: 0, targetDegree: 2 };
    builder.addVertex(newVertex);

    validateHashi(builder.hashi);
    const expectedHashi: Hashi = {
      vertices: [
        { posY: 1, posX: 1, targetDegree: 2 },
        { posY: 1, posX: 5, targetDegree: 1 },
        { posY: 5, posX: 1, targetDegree: 1 },
        newVertex
      ],
      edges: [{ v1: 0, v2: 2, multiplicity: 1 }]
    };
    expect(builder.hashi).toEqual(expectedHashi);
  });
});

test('add edge', () => {
  const builder = new HashiBuilder(startingHashi());
  const newEdge: Edge = { v1: 0, v2: 1, multiplicity: 2 };
  builder.addEdge(newEdge);

  validateHashi(builder.hashi);
  const expectedHashi: Hashi = {
    vertices: [
      { posY: 1, posX: 1, targetDegree: 2 },
      { posY: 1, posX: 5, targetDegree: 1 },
      { posY: 5, posX: 1, targetDegree: 1 }
    ],
    edges: [{ v1: 0, v2: 2, multiplicity: 1 }, newEdge]
  };
  expect(builder.hashi).toEqual(expectedHashi);
});

test('add edge with wrong order Vertices', () => {
  const builder = new HashiBuilder(startingHashi());
  const newEdge: Edge = { v1: 1, v2: 0, multiplicity: 2 };
  builder.addEdge(newEdge);

  validateHashi(builder.hashi);
  const expectedHashi: Hashi = {
    vertices: [
      { posY: 1, posX: 1, targetDegree: 2 },
      { posY: 1, posX: 5, targetDegree: 1 },
      { posY: 5, posX: 1, targetDegree: 1 }
    ],
    edges: [
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 0, v2: 1, multiplicity: 2 }
    ]
  };
  expect(builder.hashi).toEqual(expectedHashi);
});
