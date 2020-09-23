/*
 * @Description: 拷贝属性公共类
 * @LastEditors: HL
 * @LastEditTime: 2020-06-30 16:54:48
 */
import {Validate} from '@/util/tools/validate.ts';
import {StringUtil} from '@/util/expand/StringUtil.ts';

export class CopyPropertyUtil {
  /**
   * 获取对象属性
   * @param obj 对象
   */
  public static getNullPropertyNames(obj: object): string[] {
    return Object.keys(obj);
  }

  /**
   * copy不为空的值(浅拷贝)
   * @param src 原对象
   * @param tar 目标对象
   */
  public static copyPropertiesIgnoreNull(src: object, tar: object): void {
    Object.keys(src).forEach((k) => {
      if (Validate.isNotEmpty(src[k]) && tar.hasOwnProperty(k)) {
        tar[k] = src[k];
      }
    });
  }

  /**
   * 浅拷贝
   * @param src 原对象
   * @param tar 目标对象
   */
  public static copyProperties(src: object, tar: object): void {
    Object.keys(src).forEach((k) => {
      tar.hasOwnProperty(k) && (tar[k] = src[k]);
    });
  }

  /**
   * 根据原始数据赋值目标数据
   * @param src 元数据
   * @param tar 目标数据
   * @param ignore 忽略属性
   */
  public static copyPropertiesBySrc(src: object, tar: object, ignore?: string[]): void {
    const hasIgnore = ignore && ignore.length;
    Object.keys(src).forEach((k) => {
      if (!(hasIgnore && ignore.indexOf(k) > -1)) {
        tar[k] = src[k]
      }
    });
  }

  /**
   * copy目标属性不为null参数
   * @param src 原对象
   * @param tar 目标对象
   */
  public static copyIgnoreNull(src: object, tar: object): void {
    const keys = tar['getOwnKeys'] ? tar['getOwnKeys']() : Object.keys(tar);
    keys.forEach((k) => {
      if (src.hasOwnProperty(k) && Validate.isNotEmpty(src[k])) {
        tar[k] = src[k];
      }
    });
  }

  /**
   * copy 目标所有属性
   * @param src 原对象
   * @param tar 目标对象
   * @param init 初始值,有则在为空时赋值
   * @param ignore 忽略属性
   * @param oriCase 元数据类型
   * @param ignoreNull 是否忽略空值
   */
  private static copyBytargetBase(
    src: Object,
    tar: Object,
    ignore?: string[],
    init?: Object,
    oriCase: string = 'upper',
    ignoreNull: boolean = false
  ): void {
    const keys = tar['getOwnKeys'] ? tar['getOwnKeys']() : Object.keys(tar);
    keys.forEach((k) => {
      if (!(Validate.notEmptyList(ignore) && ignore.includes(k))) {
        const key = oriCase === 'lower' ? StringUtil.toLowerCase(k) : k;
        if (src.hasOwnProperty(key)) {
          if (ignoreNull) {
            Validate.isNotEmpty(src[key]) && (tar[k] = src[key]);
          } else {
            tar[k] = src[key];
          }
        } else {
          if (!ignoreNull) {
            (Validate.isNotEmpty(init) && init.hasOwnProperty(key)) && (tar[k] = init[key])
          }
        }
      }
    });
  }

  /**
   * copy 目标所有属性
   * @param src 原对象
   * @param tar 目标对象
   * @param ignore 忽略属性
   * @param oriCase 元数据类型
   */
  public static copyBytarget(
    src: Object,
    tar: Object,
    ignore?: string[],
    oriCase: string = 'upper'
  ): void {
    CopyPropertyUtil.copyBytargetBase(src, tar, ignore, false, oriCase);
  }

  /**
   * copy 目标所有属性
   * @param src 原对象
   * @param tar 目标对象
   * @param ignore 忽略属性
   * @param oriCase 元数据类型
   */
  public static copyBytargetIgnoreNull(
    src: Object,
    tar: Object,
    ignore?: string[],
    oriCase: string = 'upper'
  ): void {
    CopyPropertyUtil.copyBytargetBase(src, tar, ignore, false, oriCase, true);
  }

  /**
   * copy 目标所有属性,没有使用默认值
   * @param src 原对象
   * @param tar 目标对象
   * @param init 初始值配置
   * @param ignore 忽略属性
   * @param oriCase 元数据类型
   */
  public static copyBytargetForce(
    src: Object,
    tar: Object,
    init: Object,
    ignore?: string[],
    oriCase: string = 'upper'
  ): void {
    CopyPropertyUtil.copyBytargetBase(src, tar, ignore, init, oriCase, false);
  }


  /**
   * 对象|数组深拷贝
   * @param source 拷贝对象
   * @return 拷贝结果
   */
  public static objDeepCopy(source: object | []): object | [] {
    const sourceCopy = source instanceof Array ? [] : {};
    for (let item in source) {
      if (source.hasOwnProperty(item)) {
        if (source[item] == null) {
          sourceCopy[item] = null;
        } else {
          sourceCopy[item] =
            typeof source[item] === 'object'
              ? CopyPropertyUtil.objDeepCopy(source[item]) :
              source[item];
        }
      }
    }
    return sourceCopy;
  }
}
