import { validateHashi, type Hashi } from '@/hashi/stores/hashi';

export function empty(): Hashi {
  return { vertices: [], edges: [] };
}

export function simpleEmpty(): Hashi {
  const res = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 2 },
      { posX: 3, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 3, targetDegree: 1 }
    ],
    edges: []
  };

  validateHashi(res);
  return res;
}

export function buildEmpty(): Hashi {
  const res = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 2, posY: 1, targetDegree: 2 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 5, posY: 2, targetDegree: 4 },
      { posX: 5, posY: 4, targetDegree: 5 }
    ],
    edges: []
  };

  validateHashi(res);
  return res;
}

export function build(): Hashi {
  const res = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 2, posY: 1, targetDegree: 2 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 5, posY: 2, targetDegree: 4 },
      { posX: 5, posY: 4, targetDegree: 5 }
    ],
    edges: [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 3, v2: 4, multiplicity: 2 }
    ]
  };

  validateHashi(res);
  return res;
}

export function buildInvalid(): Hashi {
  const res = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 2, posY: 1, targetDegree: 2 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 5, posY: 2, targetDegree: 4 },
      { posX: 5, posY: 4, targetDegree: 5 }
    ],
    edges: [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 0, v2: 2, multiplicity: 3 },
      { v1: 3, v2: 4, multiplicity: 2 }
    ]
  };

  validateHashi(res);
  return res;
}

export function buildWithMaxMultiplicity(): Hashi {
  const res: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 2 },
      { posX: 2, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 3 },
      { posX: 5, posY: 2, targetDegree: 4 },
      { posX: 5, posY: 4, targetDegree: 2 }
    ],
    edges: [
      {
        v1: 0,
        v2: 1,
        multiplicity: 0,
        customPropertyValues: { maxMultiplicity: 1 }
      },
      { v1: 2, v2: 3, multiplicity: 2, customPropertyValues: { maxMultiplicity: 1 } },
      { v1: 0, v2: 2, multiplicity: 0, customPropertyValues: { maxMultiplicity: 2 } },
      { v1: 3, v2: 4, multiplicity: 2, customPropertyValues: { maxMultiplicity: 2 } }
    ]
  };

  validateHashi(res);
  return res;
}

export const basic: Hashi = {
  vertices: [
    { posX: 1, posY: 1, targetDegree: 2 },
    { posX: 2, posY: 1, targetDegree: 1 },
    { posX: 1, posY: 2, targetDegree: 3 },
    { posX: 5, posY: 2, targetDegree: 4 },
    { posX: 5, posY: 4, targetDegree: 2 }
  ],
  edges: []
};

export const singleTriangle: Hashi = {
  vertices: [
    { posX: 1, posY: 1, targetDegree: 2 },
    { posX: 2, posY: 1, targetDegree: 1 },
    { posX: 1, posY: 2, targetDegree: 1 }
  ],
  edges: []
};

export const singleSquare: Hashi = {
  vertices: [
    { posX: 1, posY: 1, targetDegree: 2 },
    { posX: 2, posY: 1, targetDegree: 2 },
    { posX: 1, posY: 2, targetDegree: 2 },
    { posX: 2, posY: 2, targetDegree: 2 }
  ],
  edges: []
};

export const singleSnake: Hashi = {
  vertices: [
    { posX: 1, posY: 1, targetDegree: 1 },
    { posX: 2, posY: 1, targetDegree: 2 },
    { posX: 3, posY: 1, targetDegree: 2 },
    { posX: 4, posY: 1, targetDegree: 2 },
    { posX: 5, posY: 1, targetDegree: 1 }
  ],
  edges: []
};

export const singleTee: Hashi = {
  vertices: [
    { posX: 1, posY: 1, targetDegree: 1 },
    { posX: 1, posY: 2, targetDegree: 3 },
    { posX: 2, posY: 2, targetDegree: 1 },
    { posX: 1, posY: 3, targetDegree: 1 }
  ],
  edges: []
};

export const singleStar: Hashi = {
  vertices: [
    { posX: 2, posY: 1, targetDegree: 1 },
    { posX: 1, posY: 2, targetDegree: 1 },
    { posX: 2, posY: 2, targetDegree: 4 },
    { posX: 3, posY: 2, targetDegree: 1 },
    { posX: 2, posY: 3, targetDegree: 1 }
  ],
  edges: []
};

export const doubleTriangle = doubleHashi(singleTriangle);

export const namedHashis: Record<string, Hashi> = {
  singleTriangle: singleTriangle,
  doubleTriangle: doubleTriangle,
  singleSquare: singleSquare,
  singleSnake: singleSnake,
  singleTee: singleTee,
  singleStar: singleStar
};

export function doubleHashi(hashi: Hashi): Hashi {
  return {
    vertices: hashi.vertices.map((v) => ({
      posX: v.posX,
      posY: v.posY,
      targetDegree: 2 * v.targetDegree
    })),
    edges: []
  };
}

export function cloneAndValidate(hashi: Hashi): Hashi {
  const clone = JSON.parse(JSON.stringify(hashi));
  validateHashi(clone);
  return clone;
}
