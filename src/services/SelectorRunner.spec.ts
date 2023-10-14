import { expect, test } from 'vitest';
import { SelectorRunner } from './SelectorRunner';
import { type Edge, type Hashi } from '@/stores/hashi';
import { type Selector } from '@/stores/HashiAlgorithm';
import { describe } from 'node:test';

describe('edge selection', () => {
  [0, 1, 2].forEach((multiplicity) =>
    test('select edge with multiplicity ' + multiplicity, () => {
      const hashi: Hashi = {
        vertices: [
          { posX: 1, posY: 1, targetDegree: 1 },
          { posX: 1, posY: 2, targetDegree: 1 },
          { posX: 1, posY: 3, targetDegree: 1 },
          { posX: 1, posY: 4, targetDegree: 1 }
        ],
        edges: [
          { v1: 1, v2: 2, multiplicity: 1 },
          { v1: 2, v2: 3, multiplicity: 2 }
        ]
      };

      const selector: Selector = {
        kind: 'edge',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'multiplicity' },
            operator: 'eq',
            rhs: { kind: 'constant', value: multiplicity }
          }
        ]
      };

      const runner = new SelectorRunner(selector, hashi);

      const actual = runner.SelectNext();

      const expectedEdge: Edge = {
        v1: multiplicity,
        v2: multiplicity + 1,
        multiplicity: multiplicity
      };
      expect(actual.wrappedItem).toStrictEqual(expectedEdge);
    })
  );
});

describe('vertex selection', () => {
  [1, 2].forEach((targetDegree) =>
    test('select vertex with targetDegree', () => {
      const hashi: Hashi = {
        vertices: [
          { posX: 1, posY: 1, targetDegree: 1 },
          { posX: 1, posY: 2, targetDegree: 2 }
        ],
        edges: []
      };

      const selector: Selector = {
        kind: 'vertex',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'targetDegree' },
            operator: 'eq',
            rhs: { kind: 'constant', value: targetDegree }
          }
        ]
      };

      const runner = new SelectorRunner(selector, hashi);

      const actual = runner.SelectNext();

      const expectedVertex = hashi.vertices[targetDegree - 1];
      expect(actual.wrappedItem).toStrictEqual(expectedVertex);
    })
  );
});
