import reqest from '@/util/ajax.js';


// post请求
export function saveCommonUser(data) {
  return reqest({
    url: '/common.user.save/v1.0',
    method: 'POST',
    data
  });
}

// get请求
export function getUserInfo(query) {
  return reqest({
    url: '/user.info.get/v1.0',
    method: 'get',
    params: query
  });
}

