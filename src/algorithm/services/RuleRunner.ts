import { type RuleState } from './../stores/AlgorithmRunnerStore';
import type { Rule } from '@/algorithm/stores/HashiAlgorithm';
import { ActionRunner } from './ActionRunner';
import type { HashiUtil } from '../../hashi/services/HashiUtil';
import { SelectorRunner } from './SelectorRunner';
import { AlgorithmRunnerLogger } from '@/services/logging';

export class RuleRunner {
  constructor(
    private rule: Rule,
    private hashiUtil: HashiUtil
  ) {}

  public runRuleStep(): boolean {
    const selectorRunner = new SelectorRunner(this.rule.selectorSequence, this.hashiUtil);

    const selected = selectorRunner.SelectNext();
    AlgorithmRunnerLogger.debug(`Rule ${this.rule.name}: selector returned `, selected);

    if (selected != null) {
      const actionRunner = new ActionRunner(this.rule.action, this.hashiUtil);
      actionRunner.run(selected);
      return true;
    } else {
      return false;
    }
  }

  public isValid(): boolean {
    if (this.rule.selectorSequence.length === 0) return false;

    const selectsEdge = this.rule.selectorSequence.some((selector) => selector.kind === 'edge');
    if (!selectsEdge) return false;

    return true;
  }

  public getRuleState(): RuleState {
    if (!this.isValid()) return 'invalid';
    if (this.rule.selectorSequence.length === 0) return 'noMatch';
    const selectorRunner = new SelectorRunner(this.rule.selectorSequence, this.hashiUtil);
    const selected = selectorRunner.SelectNext();

    return selected != null ? 'matching' : 'noMatch';
  }
}
