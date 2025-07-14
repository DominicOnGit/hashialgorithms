export type LogLevelType = 'error' | 'info' | 'debug';

const LevelToNumber: Record<LogLevelType, number> = {
  error: 0,
  info: 1,
  debug: 2
};

export class Logger {
  constructor(private level: LogLevelType) {}

  isEnabled(level: LogLevelType): boolean {
    return LevelToNumber[level] <= LevelToNumber[this.level];
  }

  info(...args: unknown[]): void {
    if (this.isEnabled('info')) console.log(...args);
  }

  debug(...args: unknown[]): void {
    if (this.isEnabled('debug')) console.debug(...args);
  }
}

export const UiActionLogger = new Logger('info');
export const AlgorithmPathLogger = new Logger('error');
export const AlgorithmRunnerLogger = new Logger('error');
