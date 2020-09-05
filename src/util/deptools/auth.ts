/*
 * @Description: auth相关
 * @LastEditors: HL
 * @LastEditTime: 2020-07-01 11:30:04
 */

import * as Cookies from 'js-cookie';

const curDomain = document.domain
  .split('.')
  .slice(-2)
  .join('.');
const TokenKey = 'Authorization';

export class AuthUtil {
  public static setCookies(key: string, value) {
    return Cookies.set(key, value);
  }

  public static getCookies(key) {
    return Cookies.get(key);
  }

  public static getToken() {
    // 修改逻辑为先从local中获取,和即合平台公用
    // return Cookies.get(TokenKey, { path: curDomain });
    return Cookies.get(TokenKey);
  }

  public static setToken(token, expire, domain?: boolean) {
    return Cookies.set(
      TokenKey,
      token,
      domain
        ? {
          domain: `.${curDomain}`,
          expires: expire || 1,
        }
        : {
          expires: expire || 1,
        }
    );
  }

  public static removeToken() {
    Cookies.remove(TokenKey);
    Cookies.remove(TokenKey, {domain: curDomain});
  }

  // 缓存用户名密码，未加密
  public static setSessionuser(user) {
    window.sessionStorage.username = user.username;
    window.sessionStorage.password = user.password;
  }

  // 取出用户名密码
  public static getSessionuser(user) {
    return {
      username: window.sessionStorage.username,
      password: window.sessionStorage.password,
    };
  }
}
