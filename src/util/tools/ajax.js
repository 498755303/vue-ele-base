// 原始ajax
export const ajaxGo = param => {
  if (param) {
    if (!('url' in param)) {
      return false;
    }
  } else {
    return false;
  }
  let methods = param.methods || 'GET';
  let url = param.url;
  let async = param.async || true;
  let headers = param.headers;
  var xhr = new XMLHttpRequest();
  xhr.open(methods, url, async);
  setHeader(xhr, headers);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let res_json = JSON.parse(xhr.responseText);
      if (res_json.code === 200) {
        param.success && param.success(res_json);
      } else {
        param.error && param.error(res_json);
      }
    }
  };

  xhr.send(JSON.stringify(param.data));

  function setHeader(request, list) {
    if (!list) {
      return request;
    }
    for (var i in list) {
      request.setRequestHeader(i, list[i]);
    }
    return request;
  }
};
