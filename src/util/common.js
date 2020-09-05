const uniq = array => {
  const temp = [];
  const l = array.length;
  for (let i = 0; i < l; i++) {
    for (let j = i + 1; j < l; j++) {
      if (array[i] === array[j]) {
        i++;
        j = i;
      }
    }
    temp.push(array[i]);
  }
  return temp;
};

// 递归查找树形 父级,兄弟,和当前节点
const getNodes = (json, key, value, childLabel = 'children') => {
  let parentNode = null;
  let node = null;
  let siblingsNode = null;

  function getNode(subJson, subKey, subValue, subChildLabel) {
    // 1. root 深度遍历整个JSON
    for (let i = 0; i < subJson.length; i++) {
      if (node) {
        break;
      }
      let obj = subJson[i];
      // 没有就下一个
      if (!obj || !obj[subKey]) {
        continue;
      }
      // 2.有节点就开始找，一直递归下去

      if (obj[subKey] === subValue) {
        // 找到了当前节点结束递归
        node = obj;
        break;
      } else {
        // 3.如果有子节点就开始找
        if (obj[subChildLabel]) {
          // 4.递归前，记录当前节点，作为parent 父亲
          parentNode = obj;
          siblingsNode = obj[subChildLabel];
          // 递归往下找
          getNode(obj[subChildLabel], subKey, subValue, subChildLabel);
        } else {
          // 跳出当前递归，返回上层递归
          continue;
        }
      }
    }

    // 5.如果木有找到父节点，置为null，因为没有父亲
    if (!parentNode) {
      parentNode = null;
    }

    // 6.返回结果obj
    return {
      parentNode: parentNode,
      siblingsNode: siblingsNode,
      node: node
    };
  }

  return getNode(json, key, value, childLabel);
};

const recursiveTree = (data, key) => {
  data.map(item => {
    item[key] === '' ||
    item[key] === undefined ||
    item[key] === null ||
    (Array.isArray(item[key]) && item[key].length === 0)
      ? delete item[key]
      : recursiveTree(item[key], key);
  });
};

// 根据子ID，返回整体ID数组
const findIndexArray = (json, key, value, indexArray, children = 'list') => {
  let arr = Array.from(indexArray);
  for (let i = 0, len = json.length; i < len; i++) {
    arr.push(json[i][key]);
    if (json[i][key] === value) {
      return arr;
    }
    let child = json[i][children];
    if (child && child.length) {
      let result = findIndexArray(child, key, value, arr, children);
      if (result) {
        return result;
      }
    }
    arr.pop();
  }
  return false;
};
// 置顶 ID的INPUT插入字符串
const insertInputTxt = (id, insertTxt) => {
  const elInput = document.getElementById(id);
  const startPos = elInput.selectionStart;
  const endPos = elInput.selectionEnd;
  if (startPos === undefined || endPos === undefined) return;
  const txt = elInput.value;
  elInput.value = txt.substring(0, startPos) + insertTxt + txt.substring(endPos);
  elInput.focus();
  elInput.selectionStart = startPos + insertTxt.length;
  elInput.selectionEnd = startPos + insertTxt.length;
};
// 计算简单数组里每个元素的个数
const calcArrayElNum = arr => {
  return arr.reduce(function (prev, next) {
    prev[next] = prev[next] + 1 || 1;
    return prev;
  }, {});
};
// 返回账户显示
const accountLabel = data => {
  let result;
  if (data.alias) {
    result = data.alias;
  } else if (data.thirdAccountName) {
    result = data.thirdAccountName;
  } else if (data.thirdName) {
    result = data.thirdName;
  } else if (data.thirdLoginName) {
    result = data.thirdLoginName;
  } else if (data.thirdAccountId) {
    result = data.thirdAccountId;
  } else {
    result = '-';
  }
  return result;
};

export {
  uniq,
  getNodes,
  findIndexArray,
  insertInputTxt,
  calcArrayElNum,
  accountLabel,
  recursiveTree
};
