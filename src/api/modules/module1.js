import reqest from '@/util/ajax.js';


// post请求
export function saveModule(data) {
  return reqest({
    url: '/module.save/v1.0',
    method: 'POST',
    data
  });
}

// get请求
export function getModule(query) {
  return reqest({
    url: '/module.get/v1.0',
    method: 'get',
    params: query
  });
}

