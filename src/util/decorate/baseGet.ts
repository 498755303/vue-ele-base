/*
 * @Description: 基础查询装饰器
 * @LastEditors: HL
 * @LastEditTime: 2020-06-18 00:29:02
 */

/**
 * 基础获取装饰器
 * @param msg 超时提示信息
 * @param tip 是否展示超时提示信息
 * @param returnOri 是否返回原始内容
 * @return 返回data内容
 */
export default function baseGet(msg: string = '获取信息失败', tip: boolean = true, returnOri: boolean = false): any {
  return (target: any, attr: any, descriptor) => {
    let oldValue = descriptor.value;
    descriptor.value = async function (...args) {
      const result = await oldValue.bind(this, ...args)();
      if (result) {
        if (result.data.code === 200) {
          return returnOri ? result.data : result.data.data;
        } else {
          this.$message.error(result.data.message);
        }
      } else {
        tip && this.$message.error(msg);
      }
    };
    return descriptor;
  }
}
