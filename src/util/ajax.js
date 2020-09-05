/**
 * axios全局配置，包括验证校验及错误处理
 */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { AuthUtil } from "@/util/deptools/auth.ts";
import { Message, Loading, Notification } from 'ele-pro-hl'
import { baseUrl, reqCfg } from '@/config/sys/app'
let loadingInstance, notify
const { ignoreLoading, canelApi } = reqCfg
// 取消重复请求
let pending = []
let cancelToken = axios.CancelToken
let removePending = ever => {
  for (let p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) {
      if (
        canelApi.some(v => {
          return v.indexOf(ever.url) !== -1
        })
      ) {
        pending[p].f()
        pending.splice(p, 1)
      }
    }
  }
}
// 超时设置
const service = axios.create({
  timeout: 30000, // 请求超时时间
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: false
})
// let loadingInstance;
// http request 拦截器
service.interceptors.request.use(
  config => {
    // 需要判断该api是否有权限
    if (AuthUtil.getToken()) {
      config.headers = {
        Authorization: 'Bearer ' + AuthUtil.getToken()
      }
    }
    // post请求序列化表单和设置表头
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      if (!ignoreLoading.includes(config.url)) {
        loadingInstance = Loading.service({
          // target: document.querySelector('.content-wrap'),
          lock: true,
          text: '数据正在提交中，请稍候',
          background: 'rgba(255,255,255,0.4)'
        })
      }
      if (AuthUtil.getToken()) {
        // 序列化
        config.headers = {
          Authorization: 'Bearer ' + AuthUtil.getToken(),
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      } else {
        config.headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    }
    // 取消重复请求
    removePending(config)
    config.cancelToken = new cancelToken(c => {
      pending.push({
        u: config.url + '&' + config.method,
        f: c
      })
    })
    return config
  },
  err => {
    // 请求错误处理
    Message({
      showClose: true,
      message: err,
      type: 'error'
    })
    if (loadingInstance) {
      loadingInstance.close()
    }
    return Promise.reject(err)
  }
)

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
  response => {
    // 取消重复请求
    removePending(response.config)
    if (response.data) {
      if (
        response.data.code === 401 ||
        response.data.code === 402 ||
        response.status === 401
      ) {
        if (!notify) {
          notify = Notification({
            title: '请重新登陆',
            showClose: true,
            message: '登录超时或未授权，请重新登陆',
            duration: 3000,
            type: 'error',
            onClick: () => {
              store.dispatch('logOut').then(res => {
                router.push('/login')
              })
            },
            onClose: () => {
              store.dispatch('logOut').then(res => {
                router.push('/login')
              })
              // window.location.reload();
            }
          })
        }

        // Message({
        //   showClose: true,
        //   message: "登录超时或未授权，请重新登陆",
        //   duration: 2000,
        //   type: "error",
        //   onClose: () => {
        //     window.location.reload();
        //     router.push("/login");
        //   }
        // });
      }
    }
    if (loadingInstance) {
      loadingInstance.close()
    }
    return response
  },
  error => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    if (error.response) {
      switch (error.response.status) {
      case 401:
        if (!notify) {
          notify = Notification({
            title: '请重新登陆',
            showClose: true,
            message: '登录超时或未授权，请重新登陆',
            duration: 3000,
            type: 'error',
            onClick: () => {
              store.dispatch('logOut').then(res => {
                router.push('/login')
              })
            },
            onClose: () => {
              store.dispatch('logOut').then(res => {
                router.push('/login')
              })
            }
          })
        } else {
          notify.close()
          notify = Notification({
            title: '请重新登陆',
            showClose: true,
            message: '登录超时或未授权，请重新登陆',
            duration: 3000,
            type: 'error',
            onClick: () => {
              store.dispatch('logOut').then(res => {
                router.push('/login')
              })
            },
            onClose: () => {
              store.dispatch('logOut').then(res => {
                router.push('/login')
              })
            }
          })
        }

        break
      case 403:
        router.push('error/403')
        break
      case 404:
        Message({
          showClose: true,
          message: '请求数据失败,请重试',
          duration: 2000,
          type: 'error'
        })
        // router.push('error/404');
        break
      case 500:
        Message({
          showClose: true,
          message: '服务器错误,请联系系统管理员',
          type: 'error'
        })
        break
      default:
        console.log('error')
        break
      }
    }
    Promise.reject(error)
  }
)

export default service
