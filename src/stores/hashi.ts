import { HashiBuilder } from '@/services/HashiBuilder'
import { defineStore } from 'pinia'

export interface Vertex {
  posX: number
  posY: number

  targetDegree: number
}

export interface Edge {
  v1: number
  v2: number

  multiplicity: number
}

export interface Hashi {
  size: number

  vertices: Vertex[]

  edges: Edge[]
}

export const useHashiStore = defineStore('hashi', {
  state: (): Hashi => {
    return new HashiBuilder().build()
  }
})
