import { defineStore } from 'pinia';

export interface Progress {
  solvedLevels: number[];
}

export const useProgressStore = defineStore('progress', {
  state: (): Progress => {
    return {
      solvedLevels: []
    };
  },
  getters: {},
  actions: {
    solved(level: number): void {
      if (!this.solvedLevels.includes(level)) {
        this.solvedLevels.push(level);
      }
    }
  }
});

export function canPlay(state: Progress, level: number): boolean {
  return (
    level === 1 || state.solvedLevels.includes(level) || state.solvedLevels.includes(level - 1)
  );
}
