import { type Hashi, validateHashi } from '@/stores/hashi';
import type { HashiAlgorithm, Rule } from '@/stores/HashiAlgorithm';
import { SelectorRunner } from './SelectorRunner';
import { ActionRunner } from './ActionRunner';

export class AlgorithmRunner {
  constructor(
    private algorithm: HashiAlgorithm,
    private hashi: Hashi
  ) {
    validateHashi(hashi);
  }

  runStep(): void {
    const rule = this.algorithm.rules[0];
    this.runRuleStep(rule);
  }

  runRuleStep(rule: Rule): void {
    const selector = rule.selectorSequence[0];

    const selectorRunner = new SelectorRunner(selector, this.hashi);

    const selected = selectorRunner.SelectNext();
    console.log('Rule selected ', selected);

    const actionRunner = new ActionRunner(rule.action, this.hashi);
    actionRunner.run(selected);
  }
}
