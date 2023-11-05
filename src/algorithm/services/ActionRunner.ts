import { HashiEdge, HashiUtil, type Selectable } from '../../hashi/services/HashiUtil';
import { useHashiStore } from '@/hashi/stores/hashi';
import type { HashiAction } from '@/algorithm/stores/HashiAlgorithm';

export class ActionRunner {
  constructor(
    private action: HashiAction,
    private hashiUtil: HashiUtil
  ) {}

  run(selected: Selectable[]): void {
    if (selected.length === 0) throw new Error();

    const hashiStore = useHashiStore();
    switch (this.action.kind) {
      case 'addEdge': {
        const selectedEdge = this.findLastEdge(selected);
        if (selectedEdge == null) throw new Error('action not applicable');
        hashiStore.addEdge(selectedEdge.v1, selectedEdge.v2);
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
