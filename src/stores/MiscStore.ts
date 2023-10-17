import { defineStore } from 'pinia';

export const useMiscStore = defineStore('misc', {
  state: () => {
    return {
      isRunning: false
    };
  }
});
