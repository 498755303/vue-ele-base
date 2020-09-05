// 递归实现数据扁平化
export function flattenData(root, children) {
  const flatTree = [root];

  function flattenchildNodes(node) {
    flatTree.push(node);
    if (node[children]) {
      node[children].forEach(child => flattenchildNodes(child));
    }
  }
  root[children].forEach(rootNode => {
    flattenchildNodes(rootNode);
  });
  return flatTree;
}
// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0);
};

// 深度优先
export const dfsTree = (data, children, unique, uniqueKey) => {
  let stark = [];
  stark = stark.concat(data);
  while (stark.length) {
    let temp = stark.shift();
    if (temp[children]) {
      stark = temp[children].concat(stark);
    }
    if (temp[uniqueKey] == unique) {
      return temp;
    }
  }
};

// 递归设置全部展开
export const setExpand = (data, props) => {
  data[props.expand] = true;
  if (!isLeaf(data, props.children)) {
    data[props.children].map(v => {
      setExpand(v, props);
    });
  }
  return data;
};
// 递归删除数据
export const remove = (data, props, unique) => {
  function _remove(datalist, props, unique) {
    if (datalist && datalist.length) {
      datalist.map((val, index) => {
        if (val[props.unique] == unique) {
          datalist.splice(index, 1);
          return data;
        } else {
          if (!isLeaf(val, props.children)) {
            _remove(val[props.children], props, unique);
          }
        }
      });
    }
  }
  return _remove([data], props, unique);
};
/** 递归增加节点
 * @param {*} data 元数据
 * @param {*} props 配置
 * @param {*} unique 目标索引
 * @param {*} appendData 增加数据
 * @param {*} type 1 追加子节点 2 前面插入 3 后面插入
 */
export const append = (data, props, unique, appendData, type) => {
  function _append(datalist, props, unique) {
    if (datalist && datalist.length) {
      for (var i = 0; i < datalist.length; i++) {
        if (datalist[i][props.unique] == unique) {
          if (type === 1) {
            if (!datalist[i][props.children]) datalist[i][props.children] = [];
            datalist[i][props.children].push(appendData);
          } else if (type === 2) {
            datalist.splice(i, 0, appendData);
          } else if (type === 3) {
            datalist.splice(i + 1, 0, appendData);
          }
          return data;
        } else {
          if (!isLeaf(datalist[i], props.children)) {
            _append(datalist[i][props.children], props, unique, appendData);
          }
        }
      }
    }
  }
  return _append([data], props, unique);
};
