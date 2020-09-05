/*
 * @Description: notify的一个渲染工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-06-19 01:18:23
 */
// @ts-nocheck
import { Notification } from "ele-pro-hl";
export const Notify = (title, option) => {
  // 兼容性判断
  let Notify =
    window.Notification || window.mozNotification || window.webkitNotification;
  let notify;
  if (Notify) {
    // 是否允许推送
    if (window.Notification.permission === "granted") {
      // 允许推送
      // 支持并且开启桌面消息提醒
      notify = new Notify(title, {
        body: option.body,
        tag: option.tag || "",
        silent: option.silent || false,
        sound: option.sound || "",
        icon: option.icon || "../assets/images/logo.png",
        sticky: true,
      });
      // 点击事件
      notify.onclick = function() {
        this.isclick = true;
        option.onclick && option.onclick();
        this.close();
      };
      // 通知显示异常
      notify.onerror = option.onerror;
      // 通知显示的时候
      notify.onshow = option.onshow;
      // 通知关闭事件
      notify.onclose = function(a, b, c, d, e, f, g) {
        if (this.isclick) {
          option.onclose && option.onclose();
        } else {
          // 非点击关闭,监测不到右上角的关闭按钮
          // Notification({
          //     title: '提示',
          //     message: '您有一条通知已关闭,点击前去',
          //     type: 'warning',
          //     duration: 0,
          //     position: "top-left",
          //     showClose: true,
          //     // onClose: option.onclose,
          //     onClick: () => {
          //         // 路由跳转去通知页面
          //         this.close()
          //     },
          // })
        }
      };
    } else {
      // 不允许推送或者忽略了推送
      Notification({
        title: title,
        message: option.body,
        type: option.type ? option.type : "info",
        duration: option.duration ? option.duration : 0,
        position: "bottom-right",
        showClose: true,
        onClose: option.onclose,
        onClick: function() {
          option.onclick && option.onclick();
          this.close();
        },
      });
    }
  } else {
    // 浏览器不支持Notification接口,使用ele的notification
    Notification({
      title: title,
      message: option.body,
      type: option.type ? option.type : "info",
      duration: option.duration ? option.duration : 0,
      position: "bottom-right",
      showClose: true,
      // onClose: option.onclose,
      onClick: () => {
        option.onclick && option.onclick();
        this.close();
      },
    });
  }
};
