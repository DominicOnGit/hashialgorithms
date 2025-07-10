import type { Hashi } from '../stores/hashi';
import { HashiTextConverter } from './HashiTextConverter';
import { expect, test, describe } from 'vitest';

describe('HashiTextConverter', () => {
  test('should parse x 1 x', () => {
    const inputText = 'x 1 x';
    const target = new HashiTextConverter();
    const actual = target.parse(inputText);

    const expected: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 5, posY: 1, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 1 }]
    };
    expect(actual.wrappedItem).toEqual(expected);
  });

  test('should parse x|1|x', () => {
    const inputText = 'x\n1\nx';
    const target = new HashiTextConverter();
    const actual = target.parse(inputText);

    const expected: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 1 }]
    };
    expect(actual.wrappedItem).toEqual(expected);
  });

  test('should trim empty lines', () => {
    const inputText = `
    x 1 x
    `;
    const target = new HashiTextConverter();
    const actual = target.parse(inputText);

    const expected: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 5, posY: 1, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 1 }]
    };
    expect(actual.wrappedItem).toEqual(expected);
  });

  test('should parse square', () => {
    const inputText = `
x 1 x
1   1
x 1 x`;
    const target = new HashiTextConverter();
    const actual = target.parse(inputText);

    const expected: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 5, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 3, targetDegree: 2 },
        { posX: 5, posY: 3, targetDegree: 2 }
      ],
      edges: [
        { v1: 0, v2: 1, multiplicity: 1 },
        { v1: 0, v2: 2, multiplicity: 1 },
        { v1: 1, v2: 3, multiplicity: 1 },
        { v1: 2, v2: 3, multiplicity: 1 }
      ]
    };
    expect(actual.wrappedItem).toEqual(expected);
  });
});
