import { SelectorEvaluator } from './SelectorEvaluator';
import { expect, test, describe } from 'vitest';
import { type Term } from '@/algorithm/stores/HashiAlgorithm';
import { HashiUtil, type Selectable } from '../../hashi/services/HashiUtil';
import { TermEvaluator } from './TermEvaluator';
import type { ISelectorEvaluator } from './interfaces';

describe('propertyAccess', () => {
  const mockSelectorEvaluator: ISelectorEvaluator = {
    SelectAll: (): Selectable[] => {
      throw new Error();
    }
  };

  test('targetDegree', () => {
    const hashi = new HashiUtil({
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    });

    const term: Term = { kind: 'propertyAccess', property: 'targetDegree' };
    const evaluator = new TermEvaluator(hashi, mockSelectorEvaluator);

    expect(evaluator.evaluate(term, hashi.vertices[0], [])).toBe(2);
    expect(evaluator.evaluate(term, hashi.vertices[1], [])).toBe(3);
    expect(evaluator.evaluate(term, hashi.vertices[2], [])).toBe(1);
  });

  test('degree', () => {
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

    const term: Term = { kind: 'propertyAccess', property: 'degree' };
    const evaluator = new TermEvaluator(hashi, mockSelectorEvaluator);

    expect(evaluator.evaluate(term, hashi.vertices[0], [])).toBe(1);
    expect(evaluator.evaluate(term, hashi.vertices[1], [])).toBe(3);
    expect(evaluator.evaluate(term, hashi.vertices[2], [])).toBe(2);
    expect(evaluator.evaluate(term, hashi.vertices[3], [])).toBe(0);
  });

  test('multiplicity', () => {
    const hashi = new HashiUtil({
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    });

    const term: Term = { kind: 'propertyAccess', property: 'multiplicity' };
    const evaluator = new TermEvaluator(hashi, mockSelectorEvaluator);

    expect(evaluator.evaluate(term, hashi.edges[0], [])).toBe(2);
    expect(evaluator.evaluate(term, hashi.edges[1], [])).toBe(0);
  });
});

describe('plus', () => {
  const mockSelectorEvaluator: ISelectorEvaluator = {
    SelectAll: (): Selectable[] => {
      throw new Error();
    }
  };

  test('adding constants', () => {
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

    const term: Term = {
      kind: 'plus',
      lhs: { kind: 'constant', value: 3 },
      rhs: { kind: 'constant', value: 2 }
    };

    const evaluator = new TermEvaluator(hashi, mockSelectorEvaluator);

    expect(evaluator.evaluate(term, hashi.vertices[0], [])).toBe(3 + 2);
  });
});

describe('sum', () => {
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

    const term: Term = {
      kind: 'sum',
      over: { kind: 'edge', conditions: [] },
      what: { kind: 'constant', value: 3 }
    };
    const mockSelectorEvaluator: ISelectorEvaluator = {
      SelectAll: (): Selectable[] => hashi.edges.slice(0, 2)
    };

    const evaluator = new TermEvaluator(hashi, mockSelectorEvaluator);

    expect(evaluator.evaluate(term, hashi.vertices[0], [])).toBe(2 * 3);
  });

  test('count other incident edges', () => {
    const hashi = new HashiUtil({
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 },
        { posX: 2, posY: 2, targetDegree: 1 }
      ],
      edges: [
        { v1: 0, v2: 1, multiplicity: 1 },
        { v1: 1, v2: 2, multiplicity: 2 }
      ]
    });

    const term: Term = {
      kind: 'sum',
      over: { kind: 'edge', excludeAncestor: true, conditions: [] },
      what: { kind: 'constant', value: 1 }
    };

    const selectorEvaluator = new SelectorEvaluator(hashi);

    const evaluator = new TermEvaluator(hashi, selectorEvaluator);

    expect(evaluator.evaluate(term, hashi.vertices[1], [hashi.vertices[0], hashi.edges[0]])).toBe(
      2
    );
  });

  test('count other incident vertices', () => {
    const hashi = new HashiUtil({
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 },
        { posX: 2, posY: 2, targetDegree: 1 }
      ],
      edges: [
        { v1: 0, v2: 1, multiplicity: 1 },
        { v1: 1, v2: 2, multiplicity: 2 }
      ]
    });

    const term: Term = {
      kind: 'sum',
      over: { kind: 'vertex', excludeAncestor: true, conditions: [] },
      what: { kind: 'constant', value: 1 }
    };

    const selectorEvaluator = new SelectorEvaluator(hashi);

    const evaluator = new TermEvaluator(hashi, selectorEvaluator);

    expect(evaluator.evaluate(term, hashi.edges[1], [hashi.edges[0], hashi.vertices[1]])).toBe(1);
  });
});
