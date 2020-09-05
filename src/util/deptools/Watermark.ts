import {CopyPropertyUtil} from "@/util/tools/CopyPropertyUtil.ts";

export class Watermark {

  constructor(element, config) {

    if (!element) {
      return
    }
    this._element = element;
    this.mergeConfig(config)
    this.init();
  }

  private _element;

  private _config = {
    textArr: ['test', '自定义水印'], // 需要展示的文字，多行就多个元素【必填】
    font: "18px '微软雅黑'",// 字体样式
    fillStyle: 'rgba(170,170,170,0.15)', // 描边样式
    maxWidth: 200, // 文字水平时最大宽度
    minWidth: 120, // 文字水平时最小宽度
    lineHeight: 24, // 文字行高
    deg: -45, // 旋转的角度 0至-90之间
    marginRight: 150, // 每个水印的右间隔
    marginBottom: 50, // 每个水印的下间隔
    left: 20, // 整体背景距左边的距离
    top: 20 // 整体背景距上边的距离
  };


  public init(): void {
    const c = this.createCanvas();
    this.draw(c);
    const imgData = this.convertCanvasToImage(c);
    this.image2Dom(imgData);
  }

  private mergeConfig(config) {
    CopyPropertyUtil.copyPropertiesIgnoreNull(config, this._config);
  }

  /**
   * 创建隐藏canvas
   */
  private createCanvas() {
    const c = document.createElement('canvas');
    c.style.display = 'none';
    document.body.appendChild(c);
    return c;
  }


  /**
   * 绘制canvas
   * @param c canvas dom
   */
  private draw(c) {
    const ctx = c.getContext("2d");

    // 切割超过最大宽度的文本并获取最大宽度
    const textArr = this._config.textArr || [];
    let wordBreakTextArr = [];
    const maxWidthArr = [];
    textArr.forEach((text) => {
      const result = this.breakLinesForCanvas(ctx, text + '', this._config.maxWidth, this._config.font);
      wordBreakTextArr = wordBreakTextArr.concat(result.textArr);
      maxWidthArr.push(result.maxWidth);
    });
    maxWidthArr.sort(function (a, b) {
      return b - a;
    });

    // 根据需要切割结果，动态改变canvas的宽和高
    var maxWidth = Math.max(maxWidthArr[0], this._config.minWidth);
    var lineHeight = this._config.lineHeight;
    var height = wordBreakTextArr.length * lineHeight;
    var degToPI = Math.PI * this._config.deg / 180;
    var absDeg = Math.abs(degToPI);
    // 根据旋转后的矩形计算最小画布的宽高
    var hSinDeg = height * Math.sin(absDeg);
    var hCosDeg = height * Math.cos(absDeg);
    var wSinDeg = maxWidth * Math.sin(absDeg);
    var wCosDeg = maxWidth * Math.cos(absDeg);

    c.width = parseInt(String(hSinDeg + wCosDeg + this._config.marginRight));
    // @ts-ignore
    c.height = parseInt(wSinDeg + hCosDeg + this._config.marginBottom);

    // 宽高重置后，样式也需重置
    ctx.font = this._config.font;
    ctx.fillStyle = this._config.fillStyle;
    ctx.textBaseline = 'hanging' // 默认是alphabetic,需改基准线为贴着线的方式

    // 移动并旋转画布
    ctx.translate(0, wSinDeg);
    ctx.rotate(degToPI);

    // 绘制文本
    wordBreakTextArr.forEach((text, index) => {
      ctx.fillText(text, 0, lineHeight * index);
    });
  }

  // 将绘制好的canvas转成图片
  private convertCanvasToImage(canvas): string {
    return canvas.toDataURL("image/png");
  }

  /**
   * base64加入dom
   * @param str 字符串
   */
  private image2Dom(imgData: string) {
    const divMask = document.createElement('div');
    divMask.className = 'global-watermark';
    divMask.style.cssText = 'position:fixed; left:0; top:0; right:0; bottom:0; z-index:9999; pointer-events:none;'
    divMask.style.backgroundImage = 'url(' + imgData + ')';
    divMask.style.backgroundPosition = this._config.left + 'px ' + this._config.top + 'px';
    this._element.appendChild(divMask);
  }


  /**
   * 根据最大宽度切割文字
   * @param context ctx
   * @param text 文字
   * @param width 最大宽度
   * @param font 字体
   */
  private breakLinesForCanvas(context, text, width, font) {
    const result = [];
    let maxWidth = 0; // 计算最大宽度
    if (font) {
      context.font = font;
    }
    // 换行文字
    let breakPoint = this.findBreakPoint(text, width, context);
    while (breakPoint !== -1) {
      result.push(text.substr(0, breakPoint));
      text = text.substr(breakPoint);
      maxWidth = width;
      breakPoint = this.findBreakPoint(text, width, context);
    }

    if (text) {
      result.push(text);
      const lastTextWidth = context.measureText(text).width;
      maxWidth = maxWidth !== 0 ? maxWidth : lastTextWidth;
    }

    return {
      textArr: result,
      maxWidth: maxWidth
    };
  }

  /**
   * 寻找切换断点
   * @param text 文字
   * @param width 宽度
   * @param context ctx
   */
  private findBreakPoint(text, width, context) {
    let min = 0;
    let max = text.length - 1;
    while (min <= max) {
      var middle = Math.floor((min + max) / 2);
      var middleWidth = context.measureText(text.substr(0, middle)).width;
      var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
      if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
        return middle;
      }
      if (middleWidth < width) {
        min = middle + 1;
      } else {
        max = middle - 1;
      }
    }

    return -1;
  }


}