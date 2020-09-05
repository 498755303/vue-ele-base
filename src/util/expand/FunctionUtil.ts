/*
 * @Description: 工具类-功能类
 * @LastEditors: HL
 * @LastEditTime: 2020-06-19 01:19:45
 */

// @ts-nocheck
export class FunctionUtil {
  public static kaishi() {
    var docElm = document.documentElement;
    // W3C
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      // FireFox
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      // Chrome等
      docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
      // IE11
      docElm.msRequestFullscreen();
    }
  }

  public static guanbi() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  /**
   * 复制结果对象
   * @param cpObj 剪贴板对象 如this.$copyText
   * @param ctx 待复制的对象
   */
  public static json2clipboard(cpObj, ctx) {
    return new Promise((resolve, reject) => {
      cpObj(JSON.stringify(ctx))
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject(new Error('复制失败'));
        });
    });
  }

  public static isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  public static isWin() {
    return /windows|win32/i.test(navigator.userAgent);
  }

  /**
   * iframe下载（存在跨域问题）
   */
  public static downloadByIframe(url: string) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';

      function iframeLoad() {
        const win = iframe.contentWindow;
        const doc = win.document;
        if (win.location.href === url) {
          if (doc.body.childNodes.length > 0) {
            reject(new Error('已存在'));
          } else {
            iframe.parentNode.removeChild(iframe);
            resolve();
          }
        }
      }

      if ('onload' in iframe) {
        iframe.onload = iframeLoad;
      } else if (iframe.attachEvent) {
        iframe.attachEvent('onload', iframeLoad);
      } else {
        iframe.onreadystatechange = function onreadystatechange() {
          if (iframe.readyState === 'complete') {
            iframeLoad();
          }
        };
      }
      iframe.src = '';
      document.body.appendChild(iframe);
      setTimeout(() => {
        iframe.contentWindow.location.href = url;
      }, 50);
    });
  };

  /**
   * @description: JS实现多行省略号
   * @param o {object} {text:"文字",line:行数,ele:元素(非必传),w:元素宽度,fontSize:元素内字体大小}
   * @return:
   */
  public static esclipesByJs(o: object): string {
    if (!o || !o.text) {
      return;
    }
    const totalBlen = o.text.gblen();
    let baseWidth;
    let baseFontSize;
    if (o.w && o.fontSize) {
      baseWidth = o.w;
      baseFontSize = o.fontSize;
    } else {
      // 仅适用于px
      const eleDom = document.querySelector(o.ele);
      baseWidth = window.getComputedStyle(eleDom).width.slice(0, -2);
      baseFontSize = window.getComputedStyle(eleDom).fontSize(0, -2);
    }
    // 所计算的strNum为元素内部一行可容纳的字节数(不区分中英文)
    const strNum = Math.floor((baseWidth / baseFontSize) * 2);
    let content = '';
    // 多行可容纳总字节数
    const totalStrNum = Math.floor(strNum * o.line);
    if (totalBlen > totalStrNum) {
      content = o.text.gbstr(totalStrNum);
      content = content.substr(0, content.length - 2) + '...';
    } else {
      content = o.text;
    }
    return content;
  };

  /**
   * 函数防抖 (只执行最后一次点击)
   * @param fn 方法
   * @param t 时间
   * @returns {Function}
   * @constructor
   */
  public static Debounce(fn, t) {
    let delay = t || 500;
    let timer;
    return function () {
      let args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, delay);
    };
  };

  /**
   * 函数节流
   * @param fn
   * @param t
   * @returns {Function}
   * @constructor
   */
  public static Throttle(fn, t) {
    let last;
    let timer;
    let interval = t || 500;
    return function () {
      let args = arguments;
      let now = +new Date();
      if (last && now - last < interval) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          last = now;
          fn.apply(this, args);
        }, interval);
      } else {
        last = now;
        fn.apply(this, args);
      }
    };
  };

}
