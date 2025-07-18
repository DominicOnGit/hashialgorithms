import { HashiTextConverter } from '@/hashi/services/HashiTextConverter';
import { LevelCategories, type Level, type LevelCategory } from '../stores/level';
import type { HashiUtil } from '@/hashi/services/HashiUtil';
import { assertNotNull } from '@/services/misc';

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

let levelNum = 1;

export const DoubleBigSquare = new TextLevel(
  'Basic',
  levelNum++,
  'Double Big Square',
  `
    x 2 x 2 x
    2       2
    x       x
    2       2
    x 2 x 2 x
    `
);

export const SinglePlus = new TextLevel(
  'Basic',
  levelNum++,
  'Single Plus',
  `  
        x
        1
    x 1 x 1 x
        1
        x
    `
);

export const SingleSnake = new TextLevel(
  'Basic',
  levelNum++,
  'Single Snake',
  `  
    x 1 x 1  x
             1
     x 1 x 1 x
     1       
     x 1  x 1 x
    `
);

export const Spiral = new TextLevel(
  'Basic',
  levelNum++,
  'Single Plus',
  `  
            x
        x   
        2   1
    x 1 x 1 x
    1   2
        x
    x
    `
);

export const Mix1 = new TextLevel(
  'Basic',
  levelNum++,
  'Mix1',
  `
  x   x 1 x 2 x
  2   1   2    
            x1  x  
                2
  x2  x             
  2
    x1    x  1x
    1
  x   x     x  2x
                2
    x             
  1   1   2
  x   x  2x2   1x
    1
    x  1x    2x       
  `
);

export const SingleE = new TextLevel(
  'Advanced',
  levelNum++,
  'Single E',
  `  
    x 1 x
    1
    x 1 x
    1     
    x 1 x 
    `
);

export const SingleBigSquare = new TextLevel(
  'Advanced',
  levelNum++,
  'Single Big Square',
  `  
    x 1 x 1 x
    1       1
    x       x
    1       1
    x 1 x 1 x
    `
);

export const Mix2 = new TextLevel(
  'Advanced',
  levelNum++,
  'Mix2',
  `
  x . x1. x
  1   1   2
  x1  x
    x2    x
  1 
  x1    x              
  `
);

export const Crossings = new TextLevel(
  'Advanced',
  levelNum++,
  'Single Plus',
  `  
          x     x
          1     1
             x1 x
             1
          x     x
          1     1
          x1 x 1x
    `
);

export const Isolation = new TextLevel(
  'Expert',
  levelNum++,
  'Isolation',
  `
  x 1 x 1 x 1 x
  1           1
  x 1 x 1 x 1 x
  `
);

const SimpleLevels = [DoubleBigSquare, SinglePlus];

const RequiringMaxDegree = [SingleSnake, Spiral, Mix1];

const RequiringPairIsolationDetection = [SingleE, SingleBigSquare, Crossings, Mix2];

const Unsolvable = [Isolation];

export const Levels: Level[] = [
  ...SimpleLevels,
  ...RequiringMaxDegree,
  ...RequiringPairIsolationDetection,
  ...Unsolvable
];

export const LevelsByCategory = LevelCategories.map((category) => {
  return {
    categoryName: category,
    levels: Levels.filter((level) => level.category === category).sort(
      (a, b) => a.number - b.number
    )
  };
});

export function getLevel(levelStr: string): Level {
  const levelNum = parseInt(levelStr as string, 10);
  const level = Levels.find((level) => level.number === levelNum);
  assertNotNull(level, 'Level not found');
  return level;
}

export function loadLevelHashi(levelStr: string): HashiUtil {
  const level = getLevel(levelStr);

  const hashi = level.load();
  return hashi;
}

export function getNextLevel(level: Level): Level | null {
  const levelIndex = Levels.findIndex((l) => l.number === level.number);
  if (levelIndex < 0) throw new Error();
  return levelIndex < Levels.length - 1 ? Levels[levelIndex + 1] : null;
}
