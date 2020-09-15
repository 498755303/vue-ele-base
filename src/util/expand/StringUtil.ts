/*
 * @Description: 数组工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-08-12 11:53:32
 */

export class StringUtil {
  /**
   * 转驼峰
   * @param text 字符串
   */
  public static toUpperCase(text: string): string {
    return text.replace(/\_(\w)/g, (all, letter) => {
      return letter.toUpperCase();
    });
  }

  /**
   * 转下划线
   * @param text 字符串
   */
  public static toLowerCase(text: string): string {
    return text.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  /**
   * 判断包含特殊字符
   * @param text 字符串
   */
  public static containSpecialChar(text: string): boolean {
    let containSpecial = RegExp(
      /[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/
    );
    return containSpecial.test(text);
  }

  /**
   * 计算长度(单双字符)
   * @param str 字符串
   * @return 长度
   */
  public static calcStringWidth(str: string): number {
    const reg = new RegExp('[^\x00-\xff]', 'g');
    const doubleStr = str.match(reg);
    let doubleStrLen = doubleStr ? doubleStr.length : 0;
    const othLen = (str || '').length - doubleStrLen;
    return doubleStrLen + Math.ceil(othLen / 2);
  }

  // 半角转全角
  public static toDBC(str: string): string {
    var tmp = '';
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) == 32) {
        tmp = tmp + String.fromCharCode(12288);
      }
      if (str.charCodeAt(i) < 127) {
        tmp = tmp + String.fromCharCode(str.charCodeAt(i) + 65248);
      }
    }
    return tmp;
  }

  // 全角转半角
  public static toCDB(str: string): string {
    var tmp = '';
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) == 12288) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
        continue;
      }
      if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
      } else {
        tmp += String.fromCharCode(str.charCodeAt(i));
      }
    }
    return tmp;
  }

  /**
   * 字符串指定位置插入
   * @param oriStr 原始字符串
   * @param start 指定位置
   * @param str 新插入字符串
   */
  public static splice(oriStr: string, start: number, str: string) {
    return oriStr.slice(0, start) + str + oriStr.slice(start);
  }
}
