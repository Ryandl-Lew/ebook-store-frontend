/**
 * 全站统一价格展示：人民币符号 + 两位小数
 * @param {number|string} value
 * @returns {string}
 */
export function formatPrice(value) {
  return `¥${Number(value).toFixed(2)}`;
}
