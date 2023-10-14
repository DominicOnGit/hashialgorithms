import type { Hashi } from '@/stores/hashi';
import { expect, test, describe } from 'vitest';
import { HashiUtil } from './HashiUtil';

describe('HashiUtil', () => {
  test('getAllEdges', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 1, posY: 2, targetDegree: 1 }
      ],
      edges: []
    };

    const util = new HashiUtil(hashi);

    const actual = util.getAllEdges();

    expect(actual.map((x) => x.edge)).toStrictEqual([{ v1: 0, v2: 1, multiplicity: 0 }]);
  });

  test('getAllEdges3', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 1, posY: 2, targetDegree: 1 }
      ],
      edges: [
        {
          v1: 0,
          v2: 1,
          multiplicity: 1
        }
      ]
    };

    const util = new HashiUtil(hashi);

    const actual = util.getAllEdges();

    expect(actual.map((x) => x.edge)).toStrictEqual([{ v1: 0, v2: 1, multiplicity: 1 }]);
  });

  test('getAllEdges2', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 1, posY: 3, targetDegree: 1 },
        { posX: 3, posY: 1, targetDegree: 1 }
      ],
      edges: []
    };

    const util = new HashiUtil(hashi);

    const actual = util.getAllEdges();

    expect(actual.map((x) => x.edge)).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 0 },
      { v1: 0, v2: 2, multiplicity: 0 }
    ]);
  });
});
