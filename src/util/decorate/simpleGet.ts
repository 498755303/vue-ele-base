/*
 * @Description: 基础查询装饰器
 * @LastEditors: HL
 * @LastEditTime: 2020-06-18 00:29:02
 */

/**
 * simple类获取装饰器 返回结果没有code 只有data
 * @param msg 超时提示信息
 * @param tip 是否展示超时提示信息
 * @return 返回data内容
 */
export default function simpleGet(msg: string = '获取信息失败', tip: boolean = true): any {
  return (target: any, attr: any, descriptor) => {
    let oldValue = descriptor.value;
    descriptor.value = async function (...args) {
      const result = await oldValue.bind(this, ...args)();
      if (result) {
        if (result.data.code) {
          this.$message.error(result.data.message);
        } else {
          return result.data.data;
        }
      } else {
        tip && this.$message.error(msg);
      }
    };
    return descriptor;
  }
}
