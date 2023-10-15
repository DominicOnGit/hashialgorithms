import type { Selector } from '@/stores/HashiAlgorithm';
import type { Selectable } from './HashiUtil';

export interface ISelectorEvaluator {
  SelectAll(selector: Selector, selectedAncestors: Selectable[]): Selectable[];
}
