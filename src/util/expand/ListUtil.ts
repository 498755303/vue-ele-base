/*
 * @Description: 数组工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-08-12 14:16:35
 */

export class ListUtil {
  /**
   *  扁平化数据
   * @param {any[]} dataList
   * @param key
   */
  public static flattenData(dataList: any[], key: string = 'list') {
    const flatTree = [dataList];

    /**
     * @param {{ [x: string]: any[]; }} node
     */
    function flattenchildNodes(node) {
      flatTree.push(node);
      if (node[key]) {
        /**
         * @param {any} child
         */
        node[key].forEach((child) => flattenchildNodes(child));
      }
    }

    /**
     * @param {any} rootNode
     */
    dataList.forEach((rootNode) => {
      flattenchildNodes(rootNode);
    });
    return flatTree;
  }

  /**
   * 深度优先 平层数组
   * @param data 数组
   */
  public static flattenDataDfs(data: []) {
    if (!data || !Array.isArray(data)) throw new Error('origin data is error');
    let result = [];

    function _flatten(data) {
      let stark = [];
      stark = stark.concat(data);
      while (stark.length) {
        let temp = stark.shift();
        if (Array.isArray(temp)) {
          if (temp.length) _flatten(temp);
        } else {
          result.push(temp);
        }
      }
    }

    _flatten(data);
    return result;
  };

  /**
   * 两数组做差
   * @param arr1 数组1
   * @param arr2 数组2
   * @param type 1 arr1 - arr2  2： arr1 和arr2中不重复的
   */
  public static subDictArr(arr1: [], arr2: [], type = 1): any[] {
    for (let i = arr1.length - 1; i >= 0; i--) {
      const str = JSON.stringify(arr1[i]);
      let f = false;
      for (let j = arr2.length - 1; j >= 0; j--) {
        if (JSON.stringify(arr2[j]) == str) {
          arr2.splice(j, 1);
          f = true;
        }
      }
      if (f) {
        arr1.splice(i, 1);
      }
    }
    if (type == 1) {
      return arr1;
    } else {
      return arr1.concat(arr2);
    }
  };

  /**
   * 排序数组找位置
   * @param nums 数组
   * @param target 目标值
   */
  public static searchInsert(nums: number[], target: number): number {
    const len = nums.length;
    let l = 0, r = len - 1
    while (l <= r) {
      const mid = l + Math.floor((r - l) / 2);
      if (nums[mid] < target) {
        l = mid + 1
      } else {
        r = mid - 1
      }
    }
    return l;
  }
}
