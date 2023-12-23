/**
 * @description 工具函数
 */

/**
 * @description 拼接get请求的查询字符串
 */

export function objToGetParam(obj) {
  let str = '';
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      str += `${key}=${obj[key]}&`;
    }
  }
  return str.substring(0, str.length - 1);
}

/**
 * @description 解析表格日期格式
 */

export function parseDate(date, rule) {
  rule = rule || 'YYYY-MM-DD hh:mm:ss';

  const dateObj = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  };

  for (const key in dateObj) {
    if (new RegExp(`(${key})`).test(rule)) {
      const val = dateObj[key] + '';
      rule = rule.replace(RegExp.$1, val.length === 1 ? ('00' + val).substring(val.length) : val);
    }
  }
  return rule;
}
