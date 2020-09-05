/*
 * @Description: 字符串扩展
 * @LastEditors: HL
 * @LastEditTime: 2020-07-02 00:45:49
 */
// 返回字符的[字节]长度    1个汉字=2个字节长度  列表DIV文本溢出时用来判断字符(中英混合)长度
String.prototype.gblen = () => {
  var len = 0;
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
};
// 根据非汉字[字节]长度标准 返回--指定长度的字符
String.prototype.gbstr = size => {
  var len = 0;
  var str = '';
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
      len += 2;
      str += this[i];
    } else {
      len++;
      str += this[i];
    }
    if (len + 2 > size) {
      return str;
    }
  }
  return str;
};
// 根据非汉字[字节]长度标准  返回--指定长度后剩余的字符
String.prototype.gbelse = size => {
  var len = 0;
  var str = '';
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
      len += 2;
      if (len > size) {
        str += this[i];
      }
    } else {
      len++;
      if (len > size) {
        str += this[i];
      }
    }
  }
  return str;
};
