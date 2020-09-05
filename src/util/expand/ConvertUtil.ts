/*
 * @Description:
 * @LastEditors: HL
 * @LastEditTime: 2020-08-12 12:06:29
 */
export class ConvertUtil {
  /**
   * 对象转key=value
   * @param o 对象
   * @return 返回字符串
   */
  public static obj2Kv(o: object): string {
    return Object.entries(o).reduce(
      (arr, [k, v]) =>
        arr.concat(encodeURIComponent(k) + '=' + encodeURIComponent(v)),
      []
    ).join('&');
  }


  /**
   * url search转对象
   * @param str 字符串
   * @return 对象
   */
  public static kv2Obj(str?: string): object {
    const url = str || location.search;
    const res = {};
    if (url.indexOf('?') != -1) {
      const s = url.slice(url.indexOf('?') + 1);
      const ss = s.split('&');
      for (let i = 0; i < ss.length; i++) {
        res[ss[i].split('=')[0]] = ss[i].split('=')[1];
      }
    }
    return res;
  }

  /**
   *
   * @param data
   */
  public static urlencode(data: object): string {
    var _result = [];
    for (let key in data) {
      const value = data[key];
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + '=' + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }

    return _result.join('&');
  };

  /**
   * 样式对象转字符串
   * @param o 样式对象
   * @return 字符串
   */
  public static obj2StyleStr(o: object): string {
    let str = '';
    for (let k in o) {
      str = str + k + ':' + o[k] + ';';
    }
    return str;
  }

  /**
   * base64转blob
   * @param urlData
   */
  public static base64ToBlob(urlData: string) {
    const arr = urlData.split(',');
    const mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    // 去掉url的头，并转化为byte
    const bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    const ia = new Uint8Array(ab);

    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
      type: mime,
    });
  }
}
