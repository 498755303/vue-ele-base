
import store from '@/store';
// 本地存储的key记录
export const keyMap = {
  // 推广模块
  module1: {
    subModule1: {
      // 自定义列
      columns: (pId) => {
        return `module1_subModule1_columns_${store.getters.userId}_${pId}`;
      }
    }
  }
};
// 数据库连接对应关系
export const dbMap = {
  // 基本
  base: "baseConfig",
  // 批量创建
  batch: "bachConfig"
};
