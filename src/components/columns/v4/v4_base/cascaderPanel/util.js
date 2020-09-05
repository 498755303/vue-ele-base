export function flattenData(root) {
  const flatTree = [root];

  function flattenchildNodes(node) {
    flatTree.push(node);
    if (node.childNodes) {
      node.childNodes.forEach(child => flattenchildNodes(child));
    }
  }
  root.childNodes.forEach(rootNode => {
    flattenchildNodes(rootNode);
  });
  return flatTree;
}

export function groupData(flattenData, keys = 'level') {
  return false;
}

function getParents(flattenData, data, level, targetLevel) {
  if (level === targetLevel) {
    return;
  }
  // 在当前级别下已经查找过的集合，防止重复查找
  const hasFindArr = [];
  // 只查找当前level的数据
  data
    .filter(item => item.level === level)
    .forEach(curSelect => {
      if (hasFindArr.map(item => item.id).includes(curSelect.id)) {
        return;
      }
      // 在扁平化数组中定位
      const findObj = flattenData.find(fItem => fItem.id === curSelect.id);
      if (findObj) {
        // 定位到父节点
        const parentNode = flattenData.find(fItem => fItem.id === findObj.parent.id);
        // 查找过的父元素的childNodes
        hasFindArr.push(...parentNode.childNodes);
        // 比较该父节点下是不是全部包含选中的节点，如果是则把父节点插入结果集当中并移除当前查找节点的所有兄弟节点(包括其本身)
        let flag = true;
        parentNode.childNodes.forEach(item => {
          flag &= data.map(p => p.id).includes(item.id);
        });
        // 全部包含
        if (flag) {
          let insertIndex = 0;
          // console.log("找到的全部包含的父节点", parentNode)
          parentNode.childNodes.forEach((pItem, pIndex) => {
            // console.log("删除的多余节点", pItem)]
            const delIndex = data.findIndex(item => item.id === pItem.id);
            if (pIndex === 0) {
              insertIndex = delIndex;
            }
            data.splice(delIndex, 1);
          });
          // 保证数组的顺序,在删除的起点插入父节点
          data.splice(insertIndex, 0, {
            id: parentNode.id,
            data: parentNode.data,
            level: parentNode.level,
            text: parentNode.text
          });
        }
      }
    });
  level--;
  getParents(flattenData, data, level, targetLevel);
}

// 补完这个树,节点降级
function makeUpTreeData(flattenData, selectLevel) {
  flattenData
    .filter(p => p.level < selectLevel)
    .forEach(node => {
      if (!node.childNodes || !node.childNodes.length) {
        const childNode = {
          id: node.id,
          parent: node,
          data: node.data,
          level: node.level + 1,
          text: node.text
        };
        node.childNodes = [childNode];
      }
    });
}

export function optimizationTreeData(flattenData, selectData, selectLevel, targetLevel) {
  // 特殊处理把flattenData树状数据的节点补完
  let sourceData = flattenData.slice(0);
  // 补完这个树,统一逻辑
  makeUpTreeData(sourceData, selectData);

  if (!selectData || !selectData.length) return [];

  let target = selectData.slice(0);

  getParents(sourceData, target, selectLevel, targetLevel);

  return target;
}

// 递归查找树形 父级,兄弟,和当前节点
export function getNodes(json, key, value, childLabel = 'children') {
  var parentNode = null;
  var node = null;
  var siblingsNode = null;

  function getNode(json, key, value, childLabel) {
    // 1. root 深度遍历整个JSON
    for (var i = 0; i < json.length; i++) {
      if (node) {
        break;
      }
      var obj = json[i];
      // 没有就下一个
      if (!obj || !obj[key]) {
        continue;
      }
      // 2.有节点就开始找，一直递归下去

      if (obj[key] == value) {
        console.log(obj, parentNode, json[i]);
        // 找到了当前节点结束递归
        node = obj;
        break;
      } else {
        // 3.如果有子节点就开始找
        if (obj[childLabel]) {
          // 4.递归前，记录当前节点，作为parent 父亲
          parentNode = obj;
          siblingsNode = obj[childLabel];
          // 递归往下找
          getNode(obj[childLabel], key, value, childLabel);
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
