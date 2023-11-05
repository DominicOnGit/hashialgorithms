import { RuleRunner } from './RuleRunner';
import { type Hashi } from '@/hashi/stores/hashi';
import type { HashiAlgorithm } from '@/algorithm/stores/HashiAlgorithm';
import { HashiUtil } from '../../hashi/services/HashiUtil';

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
    const ruleRunner = new RuleRunner(rule, this.hashiUtil);
    const hadEffect = ruleRunner.runRuleStep();
    return hadEffect;
  }
}
