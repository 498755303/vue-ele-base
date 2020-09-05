/*
 * @Description: 分页查询装饰器
 * @LastEditors: HL
 * @LastEditTime: 2020-06-18 00:29:02
 */
import {Validate} from '@/util/tools/validate.ts';

/**
 * 分页获取装饰器
 * @param msg 超时失败提示
 * @param pageKey this[pageKey] 分页参数key名,不传不会赋值
 * @param tip 是否展示超时提示信息

 * @return 响应数据{list:xxx,pageInfo:xxx}
 */

export default function page(msg: string = '获取信息失败', pageKey: string = 'inheritPage', tip: boolean = true): any {
  return (target: any, attr: any, descriptor) => {
    let oldValue = descriptor.value;
    descriptor.value = async function (...args) {
      const result = await oldValue.bind(this, ...args)();
      if (result) {
        if (result.data.code === 200) {
          if (
            Validate.isNotEmpty(result.data.data.pageInfo) && Validate.isNotEmpty(this[pageKey])
          ) {
            this[pageKey].total = result.data.data.pageInfo.totalCount;
            this[pageKey].currentPage = result.data.data.pageInfo.currentPage;
          }
          return result.data.data;
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
