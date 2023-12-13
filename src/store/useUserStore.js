import { defineStore } from 'pinia';
import { getItem, setItem } from '@/utils/useStorage.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: getItem('user'),
  }),
  actions: {
    saveUser(userinfo) {
      this.user = userinfo;
      setItem('user', this.user);
    },
  },
});
