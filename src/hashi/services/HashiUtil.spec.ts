import { singleTee, namedHashis, singleStar } from './HashiSamples';
import { validateHashi, type Hashi } from '@/hashi/stores/hashi';
import { expect, test, describe } from 'vitest';
import { HashiUtil } from './HashiUtil';
import { HashiTextConverter } from './HashiTextConverter';

test('validate sample hashis', () => {
  Object.entries(namedHashis).forEach(([, hashi]) => {
    validateHashi(hashi);
  });
});

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

    const actual = util.edges;

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

    const actual = util.edges;

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

    const actual = util.edges;

    expect(actual.map((x) => x.edge)).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 0 },
      { v1: 0, v2: 2, multiplicity: 0 }
    ]);
  });

  test('getAllEdges of Tee', () => {
    const util = new HashiUtil(singleTee);
    const actual = util.edges;
    expect(actual.map((x) => x.edge)).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 0 },
      { v1: 1, v2: 2, multiplicity: 0 },
      { v1: 1, v2: 3, multiplicity: 0 }
    ]);
  });

  test('getAllEdges of Star', () => {
    const util = new HashiUtil(singleStar);
    const actual = util.edges;
    expect(actual.map((x) => x.edge)).toStrictEqual([
      { v1: 0, v2: 2, multiplicity: 0 },
      { v1: 1, v2: 2, multiplicity: 0 },
      { v1: 2, v2: 3, multiplicity: 0 },
      { v1: 2, v2: 4, multiplicity: 0 }
    ]);
  });

  test('getDegree', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 1, posY: 3, targetDegree: 1 },
        { posX: 3, posY: 1, targetDegree: 1 },
        { posX: 3, posY: 3, targetDegree: 1 }
      ],
      edges: [
        {
          v1: 0,
          v2: 1,
          multiplicity: 1
        },
        {
          v1: 0,
          v2: 2,
          multiplicity: 2
        },
        {
          v1: 1,
          v2: 3,
          multiplicity: 1
        }
      ]
    };

    const util = new HashiUtil(hashi);
    expect(util.getDegree(util.vertices[0])).toBe(3);
    expect(util.getDegree(util.vertices[1])).toBe(2);
    expect(util.getDegree(util.vertices[2])).toBe(2);
    expect(util.getDegree(util.vertices[3])).toBe(1);
  });

  test('isConnected', () => {
    const hashi1 = new HashiTextConverter().parse(`x  x  x`);
    expect(hashi1.IsConnected()).toBeFalsy();

    const hashi2 = new HashiTextConverter().parse(`x 1 x 1 x`);
    expect(hashi2.IsConnected()).toBeTruthy();
  });
});
