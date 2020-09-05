/*
 * @Description:枚举构造类
 * 数据源在config/dataBase
 */

export function emptyListOrEmpty(data) {
  if (!data) {
    return true;
  } else {
    if (Array.isArray(data) && data.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * 数据源数据
 */
interface EnumsData {
  code: string;
  label: string;
  value: string | number;
  id?: number;
  showTip?: boolean;
  group?: string[];
  desc?: string;
}


export class Enums {
  database: object[];

  constructor(arr: EnumsData[]) {
    if (emptyListOrEmpty(arr)) {
      throw new Error('参数错误,请传入一个数组');
    }

    this.database = arr;
    // 生成map
    arr.forEach((item) => {
      Object.keys(item).forEach((k) => {
        if (!this[`${k}Map`]) {
          this[`${k}Map`] = {};
        }
        this[`${k}Map`][item[k]] = item;
        this[item[k]] = item;
      });
    });
  }

  /**
   * 根据key获取val
   * @param {*} keyVal key对应的值
   * @param {*} valName 返回值名称(默认value)
   * @param {String} keyName key的名字(默认id)
   */
  getValueByKey(keyVal, valName: string, keyName: string) {
    !valName && (valName = 'value');
    !keyName && (keyName = 'id');
    if (!this[`${keyName}Map`]) {
      throw new Error('数据不存在该key');
    }
    const item = this[`${keyName}Map`][keyVal];
    if (!item || !item[valName]) {
      console.warn(`不存在该枚举值,key为${keyName},值为${keyVal}`);
    } else {
      return item[valName];
    }
  }

  // 获取原数据
  getValues() {
    return this.database;
  }

  // 获取数据 不包含全部
  getValueNotAll(id: number = -1) {
    let result = [];
    this.database.forEach((item) => {
      if (item['id'] != id) {
        result.push(item);
      }
    });
    return result;
  }

  // 分组数据
  group(groupName: string): object[] {
    const result = [];
    this.database.forEach((item) => {
      if (item['group'] && !emptyListOrEmpty(item['group'])) {
        if (item['group'].includes(groupName)) {
          result.push(item);
        }
      }
    });
    return result;
  }
}
