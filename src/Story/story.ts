import type { Level } from '@/Title-Screen/stores/level';

export interface Story {
  id: string;
  title: string;
  text: string;
  pic?: string;
}

export function isStory(item: Story | Level): item is Story {
  return 'id' in item;
}
