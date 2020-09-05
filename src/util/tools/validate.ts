/*
 * @Description: 校验类
 * @LastEditors: HL
 * @LastEditTime: 2020-06-21 12:31:53
 */
import schema from 'async-validator';

/**
 * 素材校验属性
 */
interface materialValid {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  ratio?: number;
}

/**
 * 校验类
 */
export class Validate {
  /**
   * 校验空或空数组
   * @param data 数组
   */
  public static emptyListOrEmpty(data: any): boolean {
    return !data || (Array.isArray(data) && data.length == 0);
  }

  /**
   * 费非空数组
   * @param data 数组
   */
  public static notEmptyList(data: any): boolean {
    return !Validate.emptyListOrEmpty(data);
  }

  /**
   * 校验空 ''，null,undefinde,[],{}
   * @param data 任意类型数据
   */
  public static isNotEmpty(data: any): boolean {
    if (!data) {
      return false;
    } else {
      if (Array.isArray(data) && data.length == 0) {
        return false;
      } else if (!Array.isArray(data) && JSON.stringify(data) === '{}') {
        return false;
      } else {
        return true;
      }
    }
  }

  public static isEmpty(data: any): boolean {
    return !Validate.isNotEmpty(data);
  }

  /**
   * 判断对象中是否包含某些key
   * @param tar 目标
   * @param keys keys
   */
  public static hasKeys(tar: object, keys: string[]) {
    for (let k of keys) {
      if (!tar.hasOwnProperty(k)) {
        console.error(`目标对象中缺少参数${k}`);
        return false;
      }
    }
    return true;
  }


  /**
   * 校验素材尺寸
   * @param file 校验文件
   * @param valid 检验属性
   */
  public static validateSize(file: File, valid: materialValid) {
    return new Promise((resolve, reject) => {
      let {minWidth, maxWidth, minHeight, maxHeight, ratio} = valid;
      let img = new Image();
      img.onload = function () {
        if (ratio) {
          if (ratio == img.width / img.height) {
            resolve();
          } else {
            reject(new Error('图片尺寸不符合'));
          }
        } else {
          minWidth = minWidth || -Infinity;
          maxWidth = maxWidth || Infinity;
          minHeight = minHeight || -Infinity;
          maxHeight = maxHeight || Infinity;
          if (
            img.width >= minWidth &&
            img.width <= maxWidth &&
            img.height >= minHeight &&
            img.height <= maxHeight
          ) {
            URL.revokeObjectURL(_url);
            resolve();
          } else {
            reject(new Error('图片尺寸不符合'));
          }
        }
      };
      var _url = URL.createObjectURL(file);
      img.src = _url;
    });
  }

  public static validator(descriptor) {
    return new schema(descriptor);
  }
}
