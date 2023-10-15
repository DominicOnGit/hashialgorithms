import { HashiUtil, type Selectable } from './HashiUtil';
import type { Selector } from '@/stores/HashiAlgorithm';
import { SelectorEvaluator } from './SelectorEvaluator';

export class SelectorRunner {
  private selectorEvaluator: SelectorEvaluator;

  constructor(
    private selectors: Selector[],
    private hashiUtil: HashiUtil
  ) {
    if (selectors.length === 0) throw new Error('no selector');
    this.selectorEvaluator = new SelectorEvaluator(hashiUtil);
  }

  public SelectNext(): Selectable[] {
    const all = this.SelectAll();
    if (all.length === 0) throw new Error('nothing selected');
    return all[0];
  }

  public SelectAll(): Selectable[][] {
    return this.SelectAllFromLevel([[]], 0);
  }

  private SelectAllFromLevel(ancestorsToLevelSet: Selectable[][], level: number): Selectable[][] {
    if (level === this.selectors.length) return ancestorsToLevelSet;

    const res = ancestorsToLevelSet.flatMap((selectedAncestors) => {
      const allAtLevel = this.selectorEvaluator.SelectAll(this.selectors[level], selectedAncestors);
      console.log(
        'selector evaluated at level ' + level,
        selectedAncestors.map((x) => x.toString()),
        allAtLevel.map((x) => x.toString())
      );
      const ancestorsAtLevelSet = allAtLevel.map((atLevel) => [...selectedAncestors, atLevel]);
      return this.SelectAllFromLevel(ancestorsAtLevelSet, level + 1);
    });
    return res;
  }
}
