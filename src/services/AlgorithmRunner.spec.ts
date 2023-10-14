import { expect, test } from 'vitest'
import { AlgorithmRunner } from './AlgorithmRunner'
import { useHashiStore, type Edge, type Hashi } from '@/stores/hashi'
import { type HashiAlgorithm } from '@/stores/HashiAlgorithm'
import { createPinia, setActivePinia } from 'pinia'

test('runs rule', () => {
  setActivePinia(createPinia())
  const hashiStore = useHashiStore()
  const algorithm: HashiAlgorithm = {
    rules: [
      {
        selectorSequence: [
          {
            kind: 'edge',
            conditions: []
          }
        ],
        action: { kind: 'addEdge' }
      }
    ]
  }

  const hashi: Hashi = {
    vertices: [
      { posX: 1, posY: 1, targetDegree: 1 },
      { posX: 1, posY: 2, targetDegree: 1 }
    ],
    edges: []
  }
  hashiStore.setHashi(hashi)

  const runner = new AlgorithmRunner(algorithm, hashi)
  runner.runStep()
  const expectedEdge: Edge = {
    v1: 0,
    v2: 1,
    multiplicity: 1
  }
  expect(hashiStore.edges).toStrictEqual([expectedEdge])
})
