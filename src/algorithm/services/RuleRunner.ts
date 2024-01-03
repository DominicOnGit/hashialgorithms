import { type RuleState } from './../stores/AlgorithmRunnerStore';
import type { Rule } from '@/algorithm/stores/HashiAlgorithm';
import { ActionRunner } from './ActionRunner';
import type { HashiUtil } from '../../hashi/services/HashiUtil';
import { SelectorRunner } from './SelectorRunner';

export class RuleRunner {
  constructor(
    private rule: Rule,
    private hashiUtil: HashiUtil
  ) {}

  public runRuleStep(): boolean {
    const selectorRunner = new SelectorRunner(this.rule.selectorSequence, this.hashiUtil);

    const selected = selectorRunner.SelectNext();
    console.log(`Rule ${this.rule.name}: selector retured `, selected);

    if (selected != null) {
      const actionRunner = new ActionRunner(this.rule.action, this.hashiUtil);
      actionRunner.run(selected);
      return true;
    } else {
      return false;
    }
  }

  public getRuleState(): RuleState {
    if (this.rule.selectorSequence.length === 0) return 'noMatch';
    const selectorRunner = new SelectorRunner(this.rule.selectorSequence, this.hashiUtil);
    const selected = selectorRunner.SelectNext();

    return selected != null ? 'matching' : 'noMatch';
  }
}
