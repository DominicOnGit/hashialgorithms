import {
  Need2Bridges,
  NeedAtLeastOneBridge,
  NeedMaxMultiplicity,
  NoPairIslandDouble,
  NoPairIslandSingle,
  SetMaxMultIfRemainingDegreeIs1
} from './../stores/rules';
import { type HashiAlgorithm } from './../stores/HashiAlgorithm';
import { expect, test, describe } from 'vitest';
import { useHashiStore, type Edge, type Hashi } from '@/hashi/stores/hashi';
import { type Rule } from '@/algorithm/stores/HashiAlgorithm';
import { setActivePinia, createPinia } from 'pinia';
import {
  basic,
  cloneAndValidate,
  singleSquare,
  singleTriangle,
  doubleTriangle,
  doubleSquare,
  singleTee,
  doubleTee,
  singleStar,
  doubleStar,
  singleH
} from '@/hashi/services/HashiSamples';
import { AlgorithmRunner } from './AlgorithmRunner';
import { toRaw } from 'vue';
import { HashiUtil } from '@/hashi/services/HashiUtil';

export function runTillEnd(hashi: Hashi, algo: HashiAlgorithm): Hashi {
  setActivePinia(createPinia());

  let stepOk = true;
  while (stepOk) {
    const runner = new AlgorithmRunner(algo, new HashiUtil(hashi));
    stepOk = runner.runStep();
  }
  return hashi;
}

export function checkResult(
  original: Hashi,
  final: Hashi,
  expectedEdges: Edge[],
  ignoreMult0Edges = true
): void {
  const finalEdges: Edge[] = final.edges
    .filter((e) => e.multiplicity > 0 || !ignoreMult0Edges)
    .map((e) => ({ v1: e.v1, v2: e.v2, multiplicity: e.multiplicity }));
  expect(final.vertices).toEqual(original.vertices);
  expect(orderEdges(finalEdges)).toEqual(orderEdges(expectedEdges));
}

function testSingleRuleWithMaxMult(
  hashi: Hashi,
  maxMultEdges: Edge[],
  rule: Rule,
  expectedEdges: Edge[]
): void {
  const algo: HashiAlgorithm = {
    name: '',
    disabledRules: [],
    rules: [rule]
  };

  const hashi2 = cloneAndValidate(hashi);
  hashi2.edges.push(
    ...maxMultEdges.map<Edge>((e) => ({
      v1: e.v1,
      v2: e.v2,
      multiplicity: 0,
      customPropertyValues: { maxMultiplicity: e.multiplicity }
    }))
  );
  const finalHashi = runTillEnd(hashi2, algo);

  //  console.log('actual edges', finalHashi.edges);
  checkResult(hashi, finalHashi, expectedEdges);
}

function orderEdges(edges: Edge[]): Edge[] {
  edges.sort((a, b) => (a.v1 < b.v1 ? -1 : a.v1 > b.v1 ? 1 : 0));
  return edges;
}

function testSingleRule(hashi: Hashi, rule: Rule, expectedEdges: Edge[]): void {
  const algo: HashiAlgorithm = {
    name: '',
    disabledRules: [],
    rules: [rule]
  };

  const hashi2 = cloneAndValidate(hashi);
  hashi2.edges.push();
  const finalHashi = runTillEnd(hashi2, algo);

  checkResult(hashi, finalHashi, expectedEdges);
}

function testSinglePropertyRule(
  hashi: Hashi,
  rule: Rule,
  expectedPropName: string,
  expectedPropEdges: Edge[]
): void {
  const algo: HashiAlgorithm = {
    name: '',
    disabledRules: [],
    rules: [rule]
  };

  const hashi2 = cloneAndValidate(hashi);
  hashi2.edges.push();
  const finalHashi = runTillEnd(hashi2, algo);

  // console.log(toRaw(extractHashi(finalHashi)));
  //console.log(removeProxy(finalHashi));

  checkResult(hashi, finalHashi, []);

  const actualPropertyHashi = propertyToMultiplicity(finalHashi, expectedPropName);
  console.log(toRaw(actualPropertyHashi));
  // const expectedPropertyHashi: Hashi = {vertices: hashi.vertices, edges: expectedPropEdges};
  checkResult(hashi, actualPropertyHashi, expectedPropEdges, false);

  // expect(finalHashi.vertices).toEqual(hashi.vertices);

  // new HashiUtil(finalHashi).edges.forEach((e) => {
  //   const expectedProp = expectedPropEdges.find((x) => x.v1 === e.v1 && x.v2 === e.v2);
  //   expect(e.wrappedItem.customPropertyValues?.[expectedPropName]).toEqual(
  //     expectedProp?.multiplicity
  //   );
  //   const expectedMult = hashi.edges.find((x) => x.v1 === e.v1 && x.v2 === e.v2);
  //   expect(e.wrappedItem.multiplicity).toEqual(expectedMult?.multiplicity ?? 0);
  // });
}

function propertyToMultiplicity(hashi: Hashi, property: string): Hashi {
  hashi.edges.forEach((e) => console.log(toRaw(e)));
  const res: Hashi = {
    vertices: hashi.vertices,
    edges: hashi.edges
      .filter((e) => e.customPropertyValues?.[property] != null)
      .map((e) => ({ v1: e.v1, v2: e.v2, multiplicity: e.customPropertyValues?.[property] ?? -1 }))
  };
  return res;
}

describe('Need2Bridges', () => {
  test('on basic', () => {
    testSingleRule(basic, Need2Bridges, [
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 3, v2: 4, multiplicity: 2 }
    ]);
  });

  test('on singleTriangle', () => {
    testSingleRule(singleTriangle, Need2Bridges, []);
  });
  test('on doubleTriangle', () => {
    testSingleRule(doubleTriangle, Need2Bridges, [
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 0, v2: 2, multiplicity: 2 }
    ]);
  });
  test('on singleSquare', () => {
    testSingleRule(singleSquare, Need2Bridges, []);
  });
  test('on doubleSquare', () => {
    testSingleRule(doubleSquare, Need2Bridges, [
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 0, v2: 2, multiplicity: 2 },
      { v1: 1, v2: 3, multiplicity: 2 },
      { v1: 2, v2: 3, multiplicity: 2 }
    ]);
  });
  test('on singleTee', () => {
    testSingleRule(singleTee, Need2Bridges, []);
  });
  test('on doubleTee', () => {
    testSingleRule(doubleTee, Need2Bridges, [
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 2 },
      { v1: 1, v2: 3, multiplicity: 2 }
    ]);
  });
  test('on singleStar', () => {
    testSingleRule(singleStar, Need2Bridges, []);
  });
  test('on doubleStar', () => {
    testSingleRule(doubleStar, Need2Bridges, [
      { v1: 0, v2: 2, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 2 },
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 2, v2: 4, multiplicity: 2 }
    ]);
  });

  test('on singleH', () => {
    testSingleRule(singleH, Need2Bridges, []);
  });
});

describe('NeedAtLeastOneBridge', () => {
  test('on basic', () => {
    testSingleRule(basic, NeedAtLeastOneBridge, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 1 },
      { v1: 3, v2: 4, multiplicity: 1 }
    ]);
  });

  test('on singleTriangle', () => {
    testSingleRule(singleTriangle, NeedAtLeastOneBridge, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 }
    ]);
  });
  test('on doubleTriangle', () => {
    testSingleRule(doubleTriangle, NeedAtLeastOneBridge, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 }
    ]);
  });
  test('on singleSquare', () => {
    testSingleRule(singleSquare, NeedAtLeastOneBridge, []);
  });
  test('on doubleSquare', () => {
    testSingleRule(doubleSquare, NeedAtLeastOneBridge, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 3, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 1 }
    ]);
  });
  test('on singleTee', () => {
    testSingleRule(singleTee, NeedAtLeastOneBridge, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 1, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 3, multiplicity: 1 }
    ]);
  });
  test('on doubleTee', () => {
    testSingleRule(doubleTee, NeedAtLeastOneBridge, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 1, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 3, multiplicity: 1 }
    ]);
  });
  test('on singleStar', () => {
    testSingleRule(singleStar, NeedAtLeastOneBridge, [
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 2, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 1 },
      { v1: 2, v2: 4, multiplicity: 1 }
    ]);
  });
  test('on doubleStar', () => {
    testSingleRule(doubleStar, NeedAtLeastOneBridge, [
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 2, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 1 },
      { v1: 2, v2: 4, multiplicity: 1 }
    ]);
  });
  test('on singleH', () => {
    testSingleRule(singleH, NeedAtLeastOneBridge, []);
  });
});

describe('NeedMaxMultiplicity', () => {
  test('on basic', () => {
    testSingleRule(basic, NeedMaxMultiplicity, [
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 3, v2: 4, multiplicity: 2 }
    ]);
  });

  test('on singleTriangle', () => {
    testSingleRule(singleTriangle, NeedMaxMultiplicity, []);
  });
  test('on singleSquare', () => {
    testSingleRule(singleSquare, NeedMaxMultiplicity, []);
  });

  test('on singleTriangle with some maxMulti', () => {
    testSingleRuleWithMaxMult(
      singleTriangle,
      [{ v1: 0, v2: 1, multiplicity: 1 }],
      NeedMaxMultiplicity,
      [{ v1: 0, v2: 1, multiplicity: 1 }]
    );

    testSingleRuleWithMaxMult(
      singleTriangle,
      [{ v1: 0, v2: 2, multiplicity: 1 }],
      NeedMaxMultiplicity,
      [{ v1: 0, v2: 2, multiplicity: 1 }]
    );
  });

  test('on basic with some maxMulti', () => {
    testSingleRuleWithMaxMult(basic, [{ v1: 0, v2: 1, multiplicity: 1 }], NeedMaxMultiplicity, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 3, v2: 4, multiplicity: 2 }
    ]);
  });
});

describe('SetMaxMultIfRemainingDegree', () => {
  test('SetMaxMultIfRemainingDegreeIs1 on singleTriange', () => {
    testSinglePropertyRule(singleTriangle, SetMaxMultIfRemainingDegreeIs1, 'maxMultiplicity', [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 }
    ]);
  });

  test('SetMaxMultIfRemainingDegreeIs1 on doubleTriange', () => {
    testSinglePropertyRule(doubleTriangle, SetMaxMultIfRemainingDegreeIs1, 'maxMultiplicity', []);
  });
});

describe('NoPairIsland', () => {
  test('NoPairIslandSingle on singleSquare', () => {
    testSinglePropertyRule(singleSquare, NoPairIslandSingle, 'maxMultiplicity', []);
  });

  test('NoPairIslandDouble on singleSquare', () => {
    testSinglePropertyRule(singleSquare, NoPairIslandDouble, 'maxMultiplicity', [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 3, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 1 }
    ]);
  });

  test('NoPairIslandSingle on singleH', () => {
    testSinglePropertyRule(singleH, NoPairIslandSingle, 'maxMultiplicity', [
      { v1: 0, v2: 3, multiplicity: 0 },
      { v1: 2, v2: 5, multiplicity: 0 }
    ]);
  });
});
