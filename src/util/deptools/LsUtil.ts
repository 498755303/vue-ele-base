/*
 * @Description: localStorage相关
 * @LastEditors: HL
 * @LastEditTime: 2020-07-15 11:11:59
 */
import { Validate } from "@/util/tools/validate.ts";

export class LsUtil {
  /**
   * 获取
   * @param key 键
   */
  public static getItem(key: string) {
    if (!key) {
      return;
    }
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (err) {
      return window.localStorage.getItem(key);
    }
  }

  /**
   * 设置值
   * @param key 键
   * @param val 值
   */
  public static setItem(key: string, val): void {
    try {
      if (!key) {
        return;
      }
      window.localStorage[key] = JSON.stringify(val);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 判断是否有key
   * @param key
   */
  public static hasItem(key: string): boolean {
    return Validate.isNotEmpty(window.localStorage.getItem(key));
  }

  /**
   * 移出某一项
   * @param key
   */
  public static removeItem(key: string): void {
    if (!key) {
      return;
    }
    window.localStorage.removeItem(key);
  }

  /**
   * 清空
   */
  public static clear(): void {
    window.localStorage.clear();
  }

  /**
   * 获取所有key
   */
  public static keys() {
    window.localStorage.keys();
  }
}
