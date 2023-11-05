import type { Selector } from '@/algorithm/stores/HashiAlgorithm';
import type { Selectable } from '../../hashi/services/HashiUtil';

export interface ISelectorEvaluator {
  SelectAll(selector: Selector, selectedAncestors: Selectable[]): Selectable[];
}
