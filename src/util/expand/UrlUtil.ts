

const _analysisUrl = (location) => {
  location = location || window.location;
  const target = location.href ? location : document.createElement('a');
  typeof location === 'string' && (target.href = location);
  return {
    hash: target.hash && target.hash.slice(1),
    host: target.host,
    hostname: target.hostname,
    href: target.href,
    pathname: target.pathname,
    port: target.port || '80',
    protocol: target.protocol,
    search: (function () {
      const s = target.search;
      if (!s) return s;
      const temp = {};
      s.slice(1)
        .split('&')
        .forEach(function (item) {
          const kv = item.split('=');
          temp[kv[0]] = kv[1];
        });
      return temp;
    })()
  };
};

/**
 * url工具类
 */
export class UrlUtil {

  public static getSearch(key: string, location?: string): string | object {
    // 使用该方法 传入参数 第一个是需要获取的键 第二个是传入地址
    const tmp = _analysisUrl(location);
    console.log(tmp);
    // 如果没有传入参数 将所有的结果返回 如果 传入参数 将需要的键对应的值返回
    return key ? tmp.search[key] : tmp;
  };
}