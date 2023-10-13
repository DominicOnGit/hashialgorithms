import { defineStore } from 'pinia'

export interface HashiAlgorithm {
  rules: Rule[]
}

export interface Rule {
  selectorSequence: Selector[]
  action: HashiAction
}

export interface VertexSelector {
  kind: 'vertex'
}

export interface EdgeSelector {
  kind: 'edge'
  conditions: Condition[]
}

export type Selector = VertexSelector | EdgeSelector

export interface AddEdgeAction {
  kind: 'addEdge'
}

export type HashiAction = AddEdgeAction

export interface Condition {
  lhs: Term
  operator: 'leq' | 'eq'
  rhs: Term
}

export interface ProperyAccessTerm {
  kind: 'propertyAccess'
  property: 'multiplicity'
}

export interface ConstantTerm {
  kind: 'constant'
  value: number
}

export type Term = ProperyAccessTerm | ConstantTerm

export const TestAlgorithm: HashiAlgorithm = {
  rules: [
    {
      selectorSequence: [
        {
          kind: 'edge',
          conditions: [
            {
              lhs: { kind: 'propertyAccess', property: 'multiplicity' },
              operator: 'leq',
              rhs: { kind: 'constant', value: 1 }
            }
          ]
        }
      ],
      action: { kind: 'addEdge' }
    }
  ]
}

export const useHashiAlgorithmStore = defineStore('hashiAlgorithm', {
  state: (): HashiAlgorithm => {
    return TestAlgorithm
  }
})
