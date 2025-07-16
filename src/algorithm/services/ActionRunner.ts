import { SelectorEvaluator } from './SelectorEvaluator';
import { TermEvaluator } from './TermEvaluator';
import { HashiEdge, HashiUtil, type Selectable } from '../../hashi/services/HashiUtil';
import type { HashiAction } from '@/algorithm/stores/HashiAlgorithm';
import { AlgorithmRunnerLogger } from '@/services/logging';

export class ActionRunner {
  constructor(
    private action: HashiAction,
    private hashiUtil: HashiUtil
  ) {}

  run(selected: Selectable[]): void {
    AlgorithmRunnerLogger.info(`Running action ${this.action.kind}`);
    if (selected.length === 0) throw new Error();

    switch (this.action.kind) {
      case 'addEdge': {
        const selectedEdge = this.findLastEdge(selected);
        if (selectedEdge == null) throw new Error('action not applicable');
        selectedEdge.multiplicity++;
        return;
      }
      case 'setProperty': {
        const selectedEdge = this.findLastEdge(selected);
        if (selectedEdge == null) throw new Error('action not applicable');
        const selectorEvaluator = new SelectorEvaluator(this.hashiUtil);
        const termEvaluator = new TermEvaluator(this.hashiUtil, selectorEvaluator);
        const evaluatedValue = termEvaluator.evaluate(this.action.value, selectedEdge, []);
        selectedEdge.setCustomPropertyValue(this.action.property, evaluatedValue);
        return;
      }
    }
  }

  private findLastEdge(selected: Selectable[]): HashiEdge | null {
    const found = findLast(selected, (x) => x instanceof HashiEdge) as HashiEdge | null;
    return found;
  }
}

export function findLast<T>(array: T[], predicate: (x: T) => boolean): T | null {
  for (let i = array.length; i >= 0; i--) {
    if (predicate(array[i])) return array[i];
  }
  return null;
}

export function unreachable(value: never, message = `No such case in exhaustive switch: ${value}`) {
  throw new Error(message);
}
