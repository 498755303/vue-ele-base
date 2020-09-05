<script>
import { flattenData } from "./util";
import CascaderItem from "./panelItem";
import Node from "./model/node";
import SelectPanel from "../selectPanel";

export default {
  components: { CascaderItem, SelectPanel },
  name: "CascaderPanel",
  props: {
    data: {
      type: Array,
      required: true
    },
    props: {
      type: Object,
      default: function () {
        return {
          key: "id",
          label: "label",
          children: "children"
        };
      }
    },
    settings: {
      type: Array,
      required: true
    },
    // 选中的层级
    checkedLevel: {
      type: Number,
      required: true
    },
    // 压缩层级,获取选中数据从第zipLevel层开始,列ziplevel= 3则1 2 层选中的不获取
    zipLevel: {
      type: Number,
      required: true,
      default: 1
    },
    // 是否单选
    isSingle: {
      type: Boolean,
      default: false
    },
    // 是否显示选中项
    showSelect: {
      type: Boolean,
      default: true
    },
    // 已选标题
    selectTitle: {
      type: String,
      default: "已选"
    },
    // 是否有非全选在状态
    showIndeterminate: {
      type: Boolean,
      default: true
    }
  },
  render(h) {
    // let data = this.rootNode.childNodes;
    let len = `width: ${100 / this.settings.length}%`;
    return (
      <div class="cascader-panel">
        <div class="cascader-panel__select">
          {this.curSelectData.map((item, index) => {
            const {
              level,
              title,
              showCheckBox,
              hasAllCheck
            } = this.settings.find(item => item.level === index + 1);
            return this.curShowList[index] ? (
              <CascaderItem
                style={len}
                key={index}
                data={item}
                title={title}
                level={level}
                showCheckBox={showCheckBox}
                hasAllCheck={hasAllCheck}
                on-select={this.handleSelect}
                on-check={this.handleCheck}
                on-check-click={this.handleCheckClick}
                on-check-all={(checked, pid) =>
                  this.handleAllCheck(checked, pid, index)
                }
              />
            ) : null;
          })}
        </div>
        {this.showSelect && this.checkedData && this.checkedData.length ? (
          <SelectPanel
            class="cascader-panel__choosen"
            data={this.checkedData}
            title={this.selectTitle}
            on-clear-all={this.handleClearAll}
            on-remove={this.handleRemoveItem}
          />
        ) : null}
      </div>
    );
  },
  data() {
    return {
      rootNode: null,
      flattenData: [],
      curShowList: [],
      checkedData: []
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.initData();
      }
    },
    checkedData: {
      deep: true,
      handler(val, old) {
        let resultVal = this.getCheckedNodes();
        // console.log(val);
        this.$emit("result-change", resultVal);
      }
    }
  },
  computed: {
    // 最大层级
    maxLevel() {
      return this.settings.length;
    },
    // 当前选中的数组
    curSelectData() {
      const result = [];
      let data = this.rootNode;
      for (let i = 0; i < this.maxLevel; i++) {
        // 有可能没有选中的
        if (!data || !data.childNodes) {
          result.push([]);
          continue;
        }
        result.push(data.childNodes);
        let selectNode = data.childNodes.find(item => item.selected) || [];
        data = selectNode;
      }
      return result;
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.rootNode = new Node({
        data: this.data,
        props: this.props
      });
      this.flattenData = flattenData(this.rootNode);
      this.curShowList = new Array(this.maxLevel).fill().map((item, index) => {
        let isShow = index === 0;
        return isShow;
      });
    },
    handleSelect(id) {
      // 单选
      const selectNode = this.flattenData.find(item => item.id === id);
      selectNode.parent.childNodes.forEach(node => (node.selected = false));
      selectNode.selected = true;

      // 下一级展示出来,更深的层级不渲染
      if (selectNode.level < this.maxLevel) {
        this.curShowList[selectNode.level] = !!selectNode.childNodes.length;
        for (let i = selectNode.level + 1; i < this.maxLevel; i++) {
          this.curShowList[i] = false;
        }
      }
      // 单选模式，逻辑变为类似级联选择器，选择非最深层次的节点直接清空当前节点下所有的checked结果，视为重新选择
      if (this.isSingle && selectNode.level !== this.maxLevel) {
        this.flattenData.forEach(p => (p.checked = false));
        this.getCheckedData();
      }
    },
    handleCheckClick(id) {
      this.$emit("checkClick", id);
    },
    handleCheck(isCheck, id, immediate = true) {
      if (this.isSingle) {
        this.flattenData.forEach(p => (p.checked = false));
        // this.getCheckedData();
      }
      const checkedLevel = this.checkedLevel;
      // 勾选当前级别及子级
      let selectNode = this.flattenData.find(item => item.id === id);
      if (!selectNode) {
        return;
      }

      let self = this;
      // 递归
      // 由父到子
      function setCheck(node) {
        node.checked = isCheck;
        if (!node.childNodes.length && node.level < checkedLevel) {
          node.noChildChecked = isCheck;
        }
        if (!Array.isArray(node.childNodes) || !node.childNodes.length) {
          return;
        }
        node.childNodes.forEach(node => {
          setCheck(node);
        });
      }
      // 由子到父
      function setParentCheck(parent) {
        if (!parent || !parent.parent) {
          return;
        }
        parent.checked = parent.childNodes.every(child => {
          return child.checked === true;
        });
        if (self.showIndeterminate) {
          // 此处状态不对,有个BUG
          parent.indeterminate =
            !(
              parent.childNodes.every(child => {
                return child.checked === true;
              }) ||
              parent.childNodes.every(child => {
                return child.checked === false;
              })
            ) ||
            parent.childNodes.some(child => {
              return child.indeterminate === true;
            });
        }

        setParentCheck(parent.parent);
      }
      setCheck(selectNode);
      setParentCheck(selectNode.parent);
      if (immediate) {
        this.getCheckedData();
      }
    },
    handleAllCheck(isCheck, parentId, index) {
      // console.log("触发全选");
      const selectNode = this.flattenData.find(item => item.id === parentId);
      // 第一级全选性能优化
      if (index === 0) {
        this.flattenData.forEach(p => {
          p.checked = isCheck;
          if (!p.childNodes.length && p.level < this.checkedLevel) {
            p.noChildChecked = isCheck;
          }
          p.indeterminate = false;
        });
        if (isCheck) {
          this.checkedData = this.flattenData.filter(p => p.level === this.checkedLevel);
        } else {
          this.checkedData = [];
        }
      } else {
        selectNode.checked = isCheck;
        selectNode.childNodes.forEach(item => {
          this.handleCheck(isCheck, item.id, false);
        });
        this.getCheckedData();
      }
    },
    getCheckedData() {
      // 压缩数据 一级一级压缩
      let result = [];
      const toZipData = this.flattenData.filter(p => p.level === this.zipLevel);
      function step(nodes) {
        if (!nodes || !nodes.length) {
          return;
        }
        const curSelectData = nodes.filter(p => p.checked || p.noChildChecked);

        const noSelectData = nodes.filter(
          p => !(p.checked || p.noChildChecked)
        );
        result.push(...curSelectData);
        noSelectData.forEach(p => step(p.childNodes));
      }
      step(toZipData);
      this.checkedData = result;
    },
    handleRemoveItem(id) {
      this.handleCheck(false, id);
    },
    handleClearAll(ids) {
      ids.forEach(id => {
        this.handleCheck(false, id);
      });
    },
    // 清空选中项 publicKey
    clearChecked(keys, immediate = true) {
      keys.forEach(key => {
        const selectNode = this.flattenData.find(item => {
          return item.data[this.props.key] === key && !item.disabled;
        });
        if (selectNode) {
          this.handleCheck(false, selectNode.id, immediate);
        }
      });
    },
    setCheckedNode(key, keyName, immediate = true) {
      const selectNode = this.flattenData.find(item => {
        return item.data[keyName] === key;
      });
      if (selectNode) {
        this.handleCheck(true, selectNode.id, immediate);
      }
    },
    // 设置选中项   public API
    setCheckedNodes(keys, keyName) {
      let keyProp = keyName || this.props.key;
      keys.forEach(key => {
        this.setCheckedNode(key, keyProp, false);
      });
      this.getCheckedData();
    },
    setNewCheckedNodes(keys, keyName) {
      /* public API */
      let keyProp = keyName || this.props.key;
      this.refreshAll();
      keys.forEach(key => {
        this.setCheckedNode(key, keyProp, false);
      });
      this.getCheckedData();
    },
    /** 获取选择节点   public API
       * isZip: 是否压缩成平级节点
       */
    getCheckedNodes(isZip = true) {
      if (isZip) {
        return this.checkedData.map(item => {
          return {
            id: item.id,
            text: item.text,
            data: item.data,
            level: item.level
          };
        });
      } else {
        return this.flattenData.filter(p => p.checked || p.noChildChecked);
      }
    },
    // 刷新所有节点 public API
    refreshAll() {
      const ids = this.flattenData
        .filter(
          p => (p.checked && p.level === this.checkedLevel) || p.noChildChecked
        )
        .map(p => p.id);
      this.handleClearAll(ids);
      this.curShowList = new Array(this.maxLevel).fill().map((item, index) => {
        let isShow = index === 0;
        return isShow;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@prefix: cascader;

.@{prefix}-panel {
  // display: flex;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  background: #fff;
  height: 300px;
}

.@{prefix}-panel__select {
  display: flex;
  flex: 2;
}

.@{prefix}-panel__choosen {
  flex: 1;
}

.@{prefix}-panel-item {
  flex: 1;
  overflow-y: hidden;
}
</style>
