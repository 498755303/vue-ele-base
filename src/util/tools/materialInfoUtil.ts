/*
 * @Description: 素材信息工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-08-12 16:55:53
 */
import { FunctionUtil } from '@/util/expand/FunctionUtil.ts';

export class MaterialInfoUtil {
  /**
   * 视频屏幕截图
   * @param {object} file 视频文件对象
   * @param {object} options 配置项
   * @param {function} options.error 错误回调
   * @param {function} options.success 成功回调
   * @param {number} options.timeout 超时时间(单位秒)
   * @param {number} options.currentTime 截第x秒(同video.currentTime)
   * @param {object} wrapper 可选 dom对象 默认body
   */
  public static videoScreenshot(file, options, wrapper) {
    options = options || {};
    options.error = options.error || null;
    options.success = options.success || null;
    options.timeout = options.timeout || 2;
    options.currentTime = options.currentTime || 0;
    wrapper = wrapper || document.body;

    let videoUrl, video, canvas;
    if (
      navigator.userAgent.indexOf('Chrome') < 0 &&
      navigator.userAgent.indexOf('Safari') < 0
    ) {
      options.error('浏览器不支持视频截图，请使用 Chrome 浏览器！');
    } else {
      try {
        videoUrl =
          typeof file === 'string' ? file : window.URL.createObjectURL(file);
        video = document.createElement('video');
        canvas = document.createElement('canvas');
        video.style.visibility = 'hidden';
        wrapper.appendChild(video);
        video.src = videoUrl;
        video.muted = true;
        let ctx = canvas.getContext('2d');
        const scale = 1;

        video.addEventListener(
          'loadeddata',
          () => {
            video.currentTime = options.currentTime;
          },
          false
        );

        video.addEventListener(
          'canplay',
          // @ts-ignore
          FunctionUtil.Debounce(function () {
            console.log('cap');
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            capturePic(ctx);
          }, 500),
          false
        );
        let timeoutInterval = setInterval(function () {
          if (!options.timeout) {
            clearInterval(timeoutInterval);
            options.error('视频截图失败');
          } else {
            if (video.readyState >= 1) {
              clearInterval(timeoutInterval);
              if (video.videoWidth == 0 || video.videoHeight == 0) {
                options.error('视频截图失败');
                return;
              }
            }
            options.timeout--;
          }
        }, 1000);
      } catch (err) {
        options.error(err);
      }
    }

    function capturePic(ctx) {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let url = canvas.toDataURL('image/jpeg');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        destroy();
        options.success(url);
      } catch (a) {
        options.error('视频截图失败');
      }
    }

    // 销毁
    function destroy() {
      try {
        wrapper.removeChild(video);
        window.URL.revokeObjectURL(videoUrl);
      } catch (e) {
        return false;
      }
    }
  }

  /**
   * @description: 获取图片文件的尺寸
   * @param {File} @file 文件对象
   * @return: {width:xxx,height:xxx}
   */
  public static getPicSize(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function (e) {
        let data = e.target.result;
        let img = new Image();
        // @ts-ignore
        img.src = data;
        img.onload = function () {
          resolve({
            width: img.width,
            height: img.height,
          });
        };
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * 计算图片尺寸
   * @param url 图片url
   * @return {width:xx,height:xx,url:xx}
   */
  public static calcWh(url: string): object {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = url;
      image.onload = function () {
        resolve({width: image.width, height: image.height, src: url});
      };
      image.onerror = function (e) {
        reject(new Error('加载失败'));
      };
    });
  };
}
