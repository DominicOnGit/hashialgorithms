import { validateHashi, type Hashi } from '@/stores/hashi';

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
