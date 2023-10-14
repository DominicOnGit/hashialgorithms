import { HashiEdge, HashiUtil, type Selectable } from './HashiUtil';
import { useHashiStore } from '@/stores/hashi';
import type { HashiAction } from '@/stores/HashiAlgorithm';

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
        const selectedLeaf = selected[selected.length - 1];
        if (!(selectedLeaf instanceof HashiEdge)) throw new Error('action not applicable');
        hashiStore.addEdge(selectedLeaf.v1, selectedLeaf.v2);
      }
    }
  }
}
