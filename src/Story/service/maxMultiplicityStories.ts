import { SingleSnake } from '@/Title-Screen/services/levels';
import type { Level } from '@/Title-Screen/stores/level';
import type { Story } from '../story';

const IntroduceMaxMultiplicity: Story = {
  id: 'IntroduceMaxMultiplicity',
  title: 'MaxMultiplicity',
  text: `
Sometimes we know that an edge cannot have another bridge, e.g. when an incident vertex has reached  its target degree.

We can tell this to the algorithm with the 'setProperty' action, setting <em>maxMultiplicity</em> on the edge.

MaxMultiplicity can then be used in the conditions of a rule. Initally, maxMultiplicity is 2 for each possible edge.

    `
};

export const MaxMultiplicityPreLevelSequences: [Level, Story[]] = [
  SingleSnake,
  [IntroduceMaxMultiplicity]
];
