import { keyMap, dbMap } from "@/config/sys/lfMap";
import localforage from 'localforage';
import * as memoryDriver from 'localforage-driver-memory';

localforage.defineDriver(memoryDriver);
const configMap = {
  baseConfig: {
    // 暂时优先使用localstorage，indexDB一直处于loading的bug
    driver: [localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL, memoryDriver._driver],
    name: "dbName",
    version: 1.0,
    storeName: "dbName" // 数据仓库的名称。在 IndexedDB 中为 dataStore，在 WebSQL 中为数据库 key/value 键值表的名称。仅含字母和数字和下划线。任何非字母和数字字符都将转换为下划线。
  },
  bachConfig: {
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE, memoryDriver._driver],
    name: "dbName-batch",
    version: 1.0,
    storeName: "dbName-batch"
  }
};
const createLf = cfgKey => {
  const config = configMap[cfgKey] || configMap.baseConfig;
  return localforage.createInstance(config);
};
export const lfKeyMap = keyMap;

const db = {};
// 获取数据库连接
export const createDbLink = (key, config) => {
  if (key in db) {
    return db[key];
  } else {
    const cfg = dbMap[key] || config;
    if (!cfg) {
      console.error("配置参数错误");
      return null;
    }
    db[key] = createLf(cfg);
    return db[key];
  }
};
