import type { Level } from '@/Title-Screen/stores/level';
import { IntroPreLevelSequences } from './introStories';
import { isStory, type Story } from '../story';
import { MaxMultiplicityPreLevelSequences } from './maxMultiplicityStories';

export const PreLevelStorySequences: [Level, Story[]][] = [
  IntroPreLevelSequences,
  MaxMultiplicityPreLevelSequences
];

export const Stories: Record<string, Story> = PreLevelStorySequences.reduce<Record<string, Story>>(
  (dic, [, sequence]) =>
    sequence.reduce((dic2, story) => {
      dic2[story.id] = story;
      return dic2;
    }, dic),
  {}
);

export function getStartForLevel(level: Level): Story | Level {
  const preLevelSeq = PreLevelStorySequences.find(([lv]) => lv.number === level.number);
  if (preLevelSeq != null) return preLevelSeq[1][0];
  return level;
}

export function getNext(story: Story): Story | Level | null {
  for (const [level, sequence] of PreLevelStorySequences) {
    const index = sequence.findIndex((x) => x.id === story.id);
    if (index >= 0) {
      if (index === sequence.length - 1) return level;
      return sequence[index + 1];
    }
  }
  return null;
}

export function getUrl(next: Story | Level): string {
  if (isStory(next)) return `/story/${next.id}`;
  else return `/play/${next.number}`;
}
