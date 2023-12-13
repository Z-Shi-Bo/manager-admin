import { defineStore } from 'pinia';
import { getItem, setItem } from '@/utils/useStorage.js';

export const useCommonStore = defineStore('common', {
  state: () => ({
    isCollapse: getItem('common')?.isCollapse ?? false,
  }),
  actions: {
    toggleMenuStatus(isCollapse) {
      this.isCollapse = isCollapse;
      setItem('common', { isCollapse: this.isCollapse });
    },
  },
});
