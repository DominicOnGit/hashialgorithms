import { HashiTextConverter } from '@/hashi/services/HashiTextConverter';
import { LevelCategories, type Level, type LevelCategory } from '../stores/level';
import type { HashiUtil } from '@/hashi/services/HashiUtil';

export class TextLevel implements Level {
  constructor(
    public category: LevelCategory,
    public number: number,
    public title: string,
    private hashiText: string
  ) {}

  load(): HashiUtil {
    const converter = new HashiTextConverter();
    const parsed = converter.parse(this.hashiText);
    parsed.clearEdges();
    return converter.shrink(parsed);
  }
}

export const DoubleBigSquare = new TextLevel(
  'Basic',
  1,
  'Double Big Square',
  `
    x 2 x 2 x
    2       2
    x       x
    2       2
    x 2 x 2 x
    `
);

export const SingleSnake = new TextLevel(
  'Basic',
  2,
  'Single Snake',
  `  
    x 1 x 1  x
             1
     x 1 x 1 x
     1       
     x 1  x 1 x
    `
);

export const SingleBigSquare = new TextLevel(
  'Advanced',
  3,
  'Single Big Square',
  `  
    x 1 x 1 x
    1       1
    x       x
    1       1
    x 1 x 1 x
    `
);

export const Levels: Level[] = [DoubleBigSquare, SingleSnake, SingleBigSquare];

export const LevelsByCategory = LevelCategories.map((category) => {
  return {
    categoryName: category,
    levels: Levels.filter((level) => level.category === category).sort(
      (a, b) => a.number - b.number
    )
  };
});
