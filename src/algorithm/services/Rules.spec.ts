import { HashiUtil } from './../../hashi/services/HashiUtil';
import {
  NeedAllBridges,
  NeedAtLeastOneBridge,
  NeedMaxMultiplicity,
  SetMaxMultIfRemainingDegreeIs1
} from './../stores/rules';
import { type HashiAlgorithm } from './../stores/HashiAlgorithm';
import { expect, test } from 'vitest';
import { useHashiStore, type Edge, type Hashi } from '@/hashi/stores/hashi';
import { type Rule } from '@/algorithm/stores/HashiAlgorithm';
import { setActivePinia, createPinia } from 'pinia';
import {
  basic,
  cloneAndValidate,
  singleSquare,
  singleTriangle,
  doubleTriangle
} from '@/hashi/services/HashiSamples';
import { AlgorithmRunner } from './AlgorithmRunner';

function runTillEnd(hashi: Hashi, algo: HashiAlgorithm): Hashi {
  setActivePinia(createPinia());
  const hashiStore = useHashiStore();
  hashiStore.setHashi(hashi);

  let stepOk = true;
  while (stepOk) {
    const currentHashi = hashiStore;
    const runner = new AlgorithmRunner(algo, currentHashi);
    stepOk = runner.runStep();
  }
  return hashiStore;
}

function testSingleRuleWithMaxMult(
  hashi: Hashi,
  maxMultEdges: Edge[],
  rule: Rule,
  expectedEdges: Edge[]
): void {
  const algo: HashiAlgorithm = {
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

  console.log('actual edges', finalHashi.edges);

  expect(finalHashi.vertices).toEqual(hashi.vertices);
  finalHashi.edges.forEach((e) => delete e.customPropertyValues);
  expect(finalHashi.edges).toEqual(expectedEdges);
}

function testSingleRule(hashi: Hashi, rule: Rule, expectedEdges: Edge[]): void {
  const algo: HashiAlgorithm = {
    rules: [rule]
  };

  const hashi2 = cloneAndValidate(hashi);
  hashi2.edges.push();
  const finalHashi = runTillEnd(hashi2, algo);

  expect(finalHashi.vertices).toEqual(hashi.vertices);
  expect(finalHashi.edges).toEqual(expectedEdges);
}

function testSinglePropertyRule(
  hashi: Hashi,
  rule: Rule,
  expectedPropName: string,
  expectedPropEdges: Edge[]
): void {
  const algo: HashiAlgorithm = {
    rules: [rule]
  };

  const hashi2 = cloneAndValidate(hashi);
  hashi2.edges.push();
  const finalHashi = runTillEnd(hashi2, algo);

  expect(finalHashi.vertices).toEqual(hashi.vertices);

  new HashiUtil(finalHashi).edges.forEach((e) => {
    const expectedProp = expectedPropEdges.find((x) => x.v1 === e.v1 && x.v2 === e.v2);
    expect(e.wrappedItem.customPropertyValues?.[expectedPropName]).toEqual(
      expectedProp?.multiplicity
    );
    const expectedMult = hashi.edges.find((x) => x.v1 === e.v1 && x.v2 === e.v2);
    expect(e.wrappedItem.multiplicity).toEqual(expectedMult?.multiplicity ?? 0);
  });
}

test('NeedAllBridges', () => {
  testSingleRule(basic, NeedAllBridges, [
    { v1: 2, v2: 3, multiplicity: 2 },
    { v1: 3, v2: 4, multiplicity: 2 }
  ]);
});

test('NeedAllBridges on singleTriangle', () => {
  testSingleRule(singleTriangle, NeedAllBridges, []);
});
test('NeedAllBridges on doubleTriangle', () => {
  testSingleRule(doubleTriangle, NeedAllBridges, [
    { v1: 0, v2: 1, multiplicity: 2 },
    { v1: 0, v2: 2, multiplicity: 2 }
  ]);
});

test('NeedAtLeastOneBridge', () => {
  testSingleRule(basic, NeedAtLeastOneBridge, [
    { v1: 0, v2: 1, multiplicity: 1 },
    { v1: 0, v2: 2, multiplicity: 1 },
    { v1: 2, v2: 3, multiplicity: 1 },
    { v1: 3, v2: 4, multiplicity: 1 }
  ]);
});

test('NeedAtLeastOneBridge on singleTriangle', () => {
  testSingleRule(singleTriangle, NeedAtLeastOneBridge, [
    { v1: 0, v2: 1, multiplicity: 1 },
    { v1: 0, v2: 2, multiplicity: 1 }
  ]);
});
test('NeedAtLeastOneBridge on doubleTriangle', () => {
  testSingleRule(doubleTriangle, NeedAtLeastOneBridge, [
    { v1: 0, v2: 1, multiplicity: 1 },
    { v1: 0, v2: 2, multiplicity: 1 }
  ]);
});

test('NeedMaxMultiplicity with default maxMulti', () => {
  testSingleRule(basic, NeedMaxMultiplicity, [
    { v1: 2, v2: 3, multiplicity: 2 },
    { v1: 3, v2: 4, multiplicity: 2 }
  ]);
});

test('NeedMaxMultiplicity on singleTriangle', () => {
  testSingleRule(singleTriangle, NeedMaxMultiplicity, []);
});

test('NeedMaxMultiplicity on singleTriangle with some maxMulti', () => {
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

test('NeedMaxMultiplicity with some maxMulti', () => {
  testSingleRuleWithMaxMult(basic, [{ v1: 0, v2: 1, multiplicity: 1 }], NeedMaxMultiplicity, [
    { v1: 0, v2: 1, multiplicity: 1 },
    { v1: 2, v2: 3, multiplicity: 2 },
    { v1: 3, v2: 4, multiplicity: 2 }
  ]);
});

[NeedAtLeastOneBridge, NeedAllBridges, NeedMaxMultiplicity].forEach((rule) => {
  test(rule.name + ' cannot solve singleSquare', () => {
    testSingleRule(singleSquare, rule, []);
  });
});

test('SetMaxMultIfRemainingDegreeIs1 on singleTriange', () => {
  testSinglePropertyRule(singleTriangle, SetMaxMultIfRemainingDegreeIs1, 'maxMultiplicity', [
    { v1: 0, v2: 1, multiplicity: 1 },
    { v1: 0, v2: 2, multiplicity: 1 }
  ]);
});

test('SetMaxMultIfRemainingDegreeIs1 on doubleTriange', () => {
  testSinglePropertyRule(doubleTriangle, SetMaxMultIfRemainingDegreeIs1, 'maxMultiplicity', []);
});
