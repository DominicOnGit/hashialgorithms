import { defineStore } from 'pinia';

export interface CustomPropertyDef {
  name: string;
  color: string;
  initialValue: number;

  onVertex: boolean;
}

export type CustomPropertyDefs = CustomPropertyDef[];

export interface CustomPropertyData extends CustomPropertyDef {
  value: number;
}

export interface CustomPropertyStore {
  defs: CustomPropertyDefs;
}

export const useCustomPropertyStore = defineStore('CustomProperty', {
  state: (): CustomPropertyStore => {
    return {
      defs: [
        {
          name: 'maxMultiplicity',
          onVertex: false,
          initialValue: 2,
          color: 'blue'
        }
      ]
    };
  }
});
