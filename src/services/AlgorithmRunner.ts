import { HashiUtil } from './HashiUtil'
import { useHashiStore, type Edge, type Hashi, type Vertex, validateHashi } from '@/stores/hashi'
import type {
  Condition,
  HashiAction,
  HashiAlgorithm,
  Rule,
  Selector
} from '@/stores/HashiAlgorithm'
import { TermEvaluator } from './TermEvaluator'

export class AlgorithmRunner {
  constructor(
    private algorithm: HashiAlgorithm,
    private hashi: Hashi
  ) {
    validateHashi(hashi)
  }

  runStep(): void {
    const rule = this.algorithm.rules[0]
    this.runRuleStep(rule)
  }

  runRuleStep(rule: Rule): void {
    const selector = rule.selectorSequence[0]

    const selectorRunner = new SelectorRunner(selector, this.hashi)

    const selected = selectorRunner.SelectNext()
    console.log('Rule selected ', selected)

    const actionRunner = new ActionRunner(rule.action, this.hashi)
    actionRunner.run(selected)
  }
}

interface DiscriminatedEdge {
  kind: 'edge'
  edge: Edge
}
interface DiscriminatedVertex {
  kind: 'vertex'
  vertex: Vertex
}
type Selectable = DiscriminatedEdge | DiscriminatedVertex

export class SelectorRunner {
  private hashiUtil: HashiUtil

  constructor(
    private selector: Selector,
    private hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi)
  }

  public SelectNext(): Selectable {
    switch (this.selector.kind) {
      case 'edge': {
        const allEdges = this.hashiUtil.getAllEdges()
        if (allEdges.length === 0) throw new Error('no edges')

        const conditions = this.selector.conditions
        const filteredEdge = allEdges.find((edge) =>
          conditions.every((condition) => this.evaluateEdgeCondition(condition, edge))
        )
        if (filteredEdge == null) throw new Error('no filtered edges')
        return { kind: 'edge', edge: filteredEdge }
      }
      default:
        throw new Error('not implemented')
    }
  }

  private evaluateEdgeCondition(cond: Condition, edge: Edge): boolean {
    const evaluator = new TermEvaluator(this.hashi)
    const lhs = evaluator.evaluateOnEdge(cond.lhs, edge)
    const rhs = evaluator.evaluateOnEdge(cond.rhs, edge)
    const res = this.evaluateOperator(lhs, cond.operator, rhs)
    console.log(`evaluateEdgeCondition(.,.) => ${res}`)
    return res
  }

  private evaluateOperator(lhs: number, op: Condition['operator'], rhs: number): boolean {
    switch (op) {
      case 'eq':
        return lhs === rhs
      case 'leq':
        return lhs <= rhs
    }
  }
}

export class ActionRunner {
  private hashiUtil: HashiUtil

  constructor(
    private action: HashiAction,
    private hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi)
  }

  run(selected: Selectable): void {
    const hashiStore = useHashiStore()
    switch (this.action.kind) {
      case 'addEdge': {
        if (selected.kind !== 'edge') throw new Error('action not applicable')
        hashiStore.addEdge(selected.edge.v1, selected.edge.v2)
      }
    }
  }
}

export type EdgeVertexNull = Vertex | Edge | null
