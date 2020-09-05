/*
 * @Description: 数值型工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-07-15 21:33:30
 */

export class NumberUtil {

  /**
   * 金额千分位转换
   * @param num 数值
   */
  public static num2Thousandths(num: number): string {
    if (isNaN(num)) {
      throw new TypeError('num is not a number')
    }
    return ('' + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
  }


}
