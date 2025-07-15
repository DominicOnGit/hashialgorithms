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

  
  error(...args: unknown[]): void {
    if (this.isEnabled('error')) console.log(...args);
  }


  info(...args: unknown[]): void {
    if (this.isEnabled('info')) console.log(...args);
  }

  debug(...args: unknown[]): void {
    if (this.isEnabled('debug')) console.debug(...args);
  }
}

export const HashiViewerLogger = new Logger('error');
export const UiActionLogger = new Logger('info');
export const AlgorithmPathLogger = new Logger('error');
export const AlgorithmRunnerLogger = new Logger('error');
