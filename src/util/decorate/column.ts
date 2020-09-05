/*
 * @Description: 扩展可枚举属性
 * @LastEditors: HL
 * @LastEditTime: 2020-06-18 00:29:02
 */

export default function column(target: any, attr: any): void {
  if (!target._ownKeys) {
    target._ownKeys = new Set();
  }
  target._ownKeys.add(attr);
  target.getOwnKeys = () => {
    return target._ownKeys;
  };
}
