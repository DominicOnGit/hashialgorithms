import { expect, test, describe } from 'vitest';
import { SelectorRunner } from './SelectorRunner';
import { type Edge, type Hashi, type Vertex } from '@/stores/hashi';
import { type Selector, type SumTerm } from '@/stores/HashiAlgorithm';
import { HashiUtil } from './HashiUtil';
import { SelectorEvaluator } from './SelectorEvaluator';

function runSingleSelector(selector: Selector, hashi: Hashi): Edge | Vertex {
  const runner = new SelectorRunner([selector], new HashiUtil(hashi));
  const actualSet = runner.SelectAll();
  expect(actualSet.length).toBe(1);
  const actual = actualSet[0];
  expect(actual.length).toBe(1);
  return actual[0].wrappedItem;
}

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

      const actual = runSingleSelector(selector, hashi);

      const expectedEdge: Edge = {
        v1: multiplicity,
        v2: multiplicity + 1,
        multiplicity: multiplicity
      };
      expect(actual).toStrictEqual(expectedEdge);
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

      const actual = runSingleSelector(selector, hashi);

      const expectedVertex = hashi.vertices[targetDegree - 1];
      expect(actual).toStrictEqual(expectedVertex);
    })
  );

  test('select vertex with not enough degree', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 1 },
        { posX: 1, posY: 2, targetDegree: 2 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 1 }]
    };

    const selector: Selector = {
      kind: 'vertex',
      conditions: [
        {
          lhs: { kind: 'propertyAccess', property: 'degree' },
          operator: 'lt',
          rhs: { kind: 'propertyAccess', property: 'targetDegree' }
        }
      ]
    };

    const actual = runSingleSelector(selector, hashi);

    const expectedVertex = hashi.vertices[1];
    expect(actual).toStrictEqual(expectedVertex);
  });

  test('select incident edge', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    };

    const selectors: Selector[] = [
      {
        kind: 'vertex',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'degree' },
            operator: 'lt',
            rhs: { kind: 'propertyAccess', property: 'targetDegree' }
          }
        ]
      },
      {
        kind: 'edge',
        conditions: [
          {
            lhs: { kind: 'propertyAccess', property: 'multiplicity' },
            operator: 'lt',
            rhs: { kind: 'constant', value: 2 }
          }
        ]
      }
    ];

    const runner = new SelectorRunner(selectors, new HashiUtil(hashi));
    const actualSet = runner.SelectAll();
    const actualItems = actualSet.map((ancestors) => ancestors[ancestors.length - 1].wrappedItem);
    const expectedEdge: Edge = { v1: 1, v2: 2, multiplicity: 0 };
    expect(actualItems).toStrictEqual([expectedEdge, expectedEdge]);
  });

  test('count incident edges', () => {
    const hashi = new HashiUtil({
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 },
        { posX: 5, posY: 5, targetDegree: 1 }
      ],
      edges: [
        { v1: 0, v2: 1, multiplicity: 1 },
        { v1: 1, v2: 2, multiplicity: 2 }
      ]
    });

    const sum: SumTerm = {
      kind: 'sum',
      over: { kind: 'edge', conditions: [] },
      what: { kind: 'constant', value: 1 }
    };

    const selector: Selector = {
      kind: 'vertex',
      conditions: [
        {
          lhs: sum,
          operator: 'eq',
          rhs: { kind: 'constant', value: 1 }
        }
      ]
    };

    const selectorEvaluator = new SelectorEvaluator(hashi);
    const actual = selectorEvaluator.SelectAll(selector, []);

    expect(actual).toStrictEqual([hashi.vertices[0], hashi.vertices[2]]);
  });
});
