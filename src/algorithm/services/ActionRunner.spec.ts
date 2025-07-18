import { type SetPropertyAction } from './../stores/HashiAlgorithm';
import { expect, test, describe } from 'vitest';
import { type Hashi } from '@/hashi/stores/hashi';
import { type HashiAction } from '@/algorithm/stores/HashiAlgorithm';
import { HashiUtil } from '../../hashi/services/HashiUtil';
import { ActionRunner } from './ActionRunner';

describe('addEdge', () => {
  test('addEdge on on selected edge', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    };
    const hashiUtil = new HashiUtil(hashi);
    const action: HashiAction = { kind: 'addEdge' };

    const actionRunner = new ActionRunner(action, hashiUtil);

    actionRunner.run([hashiUtil.getEdge(1, 2)]);
    expect(hashi.edges).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 1 }
    ]);
  });

  test('addEdge on a selected ancestor', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    };
    const hashiUtil = new HashiUtil(hashi);

    const action: HashiAction = { kind: 'addEdge' };

    const actionRunner = new ActionRunner(action, hashiUtil);

    actionRunner.run([hashiUtil.getEdge(1, 2), hashiUtil.vertices[2]]);
    expect(hashi.edges).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 1 }
    ]);
  });
});

describe('setProperty', () => {
  test('to constant', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    };
    const hashiUtil = new HashiUtil(hashi);

    const action: SetPropertyAction = {
      kind: 'setProperty',
      property: 'maxMultiplicity',
      value: { kind: 'constant', value: 3 }
    };

    const actionRunner = new ActionRunner(action, hashiUtil);

    actionRunner.run([hashiUtil.getEdge(0, 1)]);
    expect(hashi.edges).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 2, customPropertyValues: { maxMultiplicity: 3 } }
    ]);
  });
  test('setProperty on a selected ancestor', () => {
    const hashi: Hashi = {
      vertices: [
        { posX: 1, posY: 1, targetDegree: 2 },
        { posX: 1, posY: 2, targetDegree: 3 },
        { posX: 1, posY: 3, targetDegree: 1 }
      ],
      edges: [{ v1: 0, v2: 1, multiplicity: 2 }]
    };
    const hashiUtil = new HashiUtil(hashi);

    const action: SetPropertyAction = {
      kind: 'setProperty',
      property: 'maxMultiplicity',
      value: { kind: 'constant', value: 3 }
    };

    const actionRunner = new ActionRunner(action, hashiUtil);

    actionRunner.run([hashiUtil.getEdge(1, 2), hashiUtil.vertices[2]]);
    expect(hashi.edges).toStrictEqual([
      { v1: 0, v2: 1, multiplicity: 2 },
      { v1: 1, v2: 2, multiplicity: 0, customPropertyValues: { maxMultiplicity: 3 } }
    ]);
  });
});
