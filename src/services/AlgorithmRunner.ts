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

  runStep(): void {
    const rule = this.algorithm.rules[0];
    this.runRuleStep(rule);
  }

  runRuleStep(rule: Rule): void {
    const selectorRunner = new SelectorRunner(rule.selectorSequence, this.hashiUtil);

    const selected = selectorRunner.SelectNext();
    console.log('Rule selected ', selected);

    const actionRunner = new ActionRunner(rule.action, this.hashiUtil);
    actionRunner.run(selected);
  }
}
