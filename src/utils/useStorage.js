/**
 * 封装Storage
 */

// 获取Storage的命名空间
import config from '@/config';

// 获取本地存储的Storage
export function getStorage() {
  return JSON.parse(window.localStorage.getItem(config.namespace)) || {};
}
// 获取本地存储的Storage里得某一个key
export function getItem(key) {
  const storage = getStorage();
  return storage[key];
}
// 设置本地存储的Storage里得某一个key
export function setItem(key, val) {
  const storage = getStorage();
  storage[key] = val;
  window.localStorage.setItem(config.namespace, JSON.stringify(storage));
}
// 删除本地存储的Storage里得某一个key
export function removeItem(key) {
  const storage = getStorage();
  delete storage[key];
  window.localStorage.setItem(config.namespace, JSON.stringify(storage));
}
// 删除本地存储的Storage
export function clearAll() {
  window.localStorage.removeItem(config.namespace);
}
