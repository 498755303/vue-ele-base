/*
 * @Description: 对象工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-06-20 21:33:30
 */

export class ObjectUtil {
  /**
   * 删除KEY
   * @param target 对象
   * @param key key名
   */
  public static delKey(target: {}, key: string): void {
    key in target && delete target[key]
  }

  /**
   * 清空对象,不排除
   * @param target 目标对象
   * @param include 包含key
   * @param exclude 排除key
   */
  public static delKeys(target: {}, include?: string[], exclude?: string[]): void {
    if (include && include.length) {
      include.forEach(k => {
        ObjectUtil.delKey(target, k);
      })
    } else {
      Object.keys(target).forEach(k => {
        if (exclude && exclude.length) {
          !exclude.includes(k) && ObjectUtil.delKey(target, k);
        } else {
          ObjectUtil.delKey(target, k);
        }
      })
    }
  }

  /**
   * 清空对象排除
   * @param target 目标对象
   * @param exclude 排除项
   */
  public static delKeysIgnore(target: {}, exclude: string[]): void {
    Object.keys(target).forEach(k => {
      !exclude.includes(k) && ObjectUtil.delKey(target, k);
    })
  }

}
