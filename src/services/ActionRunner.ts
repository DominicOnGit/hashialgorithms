import { HashiEdge, HashiUtil, type Selectable } from './HashiUtil';
import { useHashiStore, type Hashi } from '@/stores/hashi';
import type { HashiAction } from '@/stores/HashiAlgorithm';

export class ActionRunner {
  private hashiUtil: HashiUtil;

  constructor(
    private action: HashiAction,
    private hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi);
  }

  run(selected: Selectable): void {
    const hashiStore = useHashiStore();
    switch (this.action.kind) {
      case 'addEdge': {
        if (!(selected instanceof HashiEdge)) throw new Error('action not applicable');
        hashiStore.addEdge(selected.v1, selected.v2);
      }
    }
  }
}
