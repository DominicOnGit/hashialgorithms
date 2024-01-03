import { type Rule } from '@/algorithm/stores/HashiAlgorithm';
import {
  cloneAndValidate,
  doubleSquare,
  doubleStar,
  doubleTee,
  doubleTriangle,
  singleH,
  singleSquare,
  singleStar,
  singleTee,
  singleTriangle
} from '@/hashi/services/HashiSamples';
import { type Edge, type Hashi } from '@/hashi/stores/hashi';
import { describe, test } from 'vitest';
import { type HashiAlgorithm } from '../stores/HashiAlgorithm';
import { SetMaxMultIfRemainingDegreeIs1 } from '../stores/rules';
import {
  NeedAtLeastOneBridgeMaxMulti,
  NeedMaxMultiplicity,
  SetMaxMultIfRemainingDegreeIs0
} from './../stores/rules';
import { checkResult, runTillEnd } from './Rules.spec';

function testMultiRules(hashi: Hashi, rules: Rule[], expectedEdges: Edge[]): void {
  const algo: HashiAlgorithm = {
    disabledRules: [],
    rules
  };

  const hashi2 = cloneAndValidate(hashi);
  hashi2.edges.push();
  const finalHashi = runTillEnd(hashi2, algo);

  checkResult(hashi, finalHashi, expectedEdges);
}

describe('4 maxmulti rules', () => {
  const rules = [
    NeedMaxMultiplicity,
    NeedAtLeastOneBridgeMaxMulti,
    SetMaxMultIfRemainingDegreeIs0,
    SetMaxMultIfRemainingDegreeIs1
  ];

  test('on singleTriangle', () => {
    testMultiRules(singleTriangle, rules, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 0, v2: 2, multiplicity: 1 }
    ]);
  });
  test('on doubleTriangle', () => {
    testMultiRules(doubleTriangle, rules, [
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 0, v2: 2, multiplicity: 2 }
    ]);
  });

  test('on singleSquare', () => {
    testMultiRules(singleSquare, rules, []);
  });
  test('on doubleSquare', () => {
    testMultiRules(doubleSquare, rules, [
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 0, v2: 2, multiplicity: 2 },
      { v1: 1, v2: 3, multiplicity: 2 },
      { v1: 2, v2: 3, multiplicity: 2 }
    ]);
  });

  test('on singleTee', () => {
    testMultiRules(singleTee, rules, [
      { v1: 0, v2: 1, multiplicity: 1 },
      { v1: 1, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 3, multiplicity: 1 }
    ]);
  });
  test('on doubleTee', () => {
    testMultiRules(doubleTee, rules, [
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 2 },
      { v1: 1, v2: 3, multiplicity: 2 }
    ]);
  });
  test('on singleStar', () => {
    testMultiRules(singleStar, rules, [
      { v1: 0, v2: 2, multiplicity: 1 },
      { v1: 1, v2: 2, multiplicity: 1 },
      { v1: 2, v2: 3, multiplicity: 1 },
      { v1: 2, v2: 4, multiplicity: 1 }
    ]);
  });
  test('on doubleStar', () => {
    testMultiRules(doubleStar, rules, [
      { v1: 0, v2: 2, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 2 },
      { v1: 2, v2: 3, multiplicity: 2 },
      { v1: 2, v2: 4, multiplicity: 2 }
    ]);
  });

  test('on singleH', () => {
    testMultiRules(singleH, rules, [{ v1: 1, v2: 4, multiplicity: 1 }]);
  });
});
