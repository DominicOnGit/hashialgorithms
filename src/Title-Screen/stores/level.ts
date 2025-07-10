import type { HashiUtil } from '@/hashi/services/HashiUtil';

export type LevelCategory = 'Basic' | 'Advanced' | 'Expert';

export const LevelCategories: LevelCategory[] = ['Basic', 'Advanced', 'Expert'];

export interface Level {
  category: LevelCategory;
  number: number;
  title: string;

  load(): HashiUtil;
}
