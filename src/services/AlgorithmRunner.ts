import { type Hashi } from '@/stores/hashi';
import type { HashiAlgorithm, Rule } from '@/stores/HashiAlgorithm';
import { SelectorRunner } from './SelectorRunner';
import { ActionRunner } from './ActionRunner';
import { HashiUtil } from './HashiUtil';

export class AlgorithmRunner {
  private hashiUtil: HashiUtil;

  constructor(
    private algorithm: HashiAlgorithm,
    hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi);
  }

  runStep(): boolean {
    const rule = this.algorithm.rules[0];
    const hadEffect = this.runRuleStep(rule);
    return hadEffect;
  }

  runRuleStep(rule: Rule): boolean {
    const selectorRunner = new SelectorRunner(rule.selectorSequence, this.hashiUtil);

    const selected = selectorRunner.SelectNext();
    console.log('Rule selected ', selected);

    if (selected != null) {
      const actionRunner = new ActionRunner(rule.action, this.hashiUtil);
      actionRunner.run(selected);
      return true;
    } else {
      return false;
    }
  }
}
