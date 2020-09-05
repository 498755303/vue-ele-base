<script>
import _ from "lodash";
import { flattenData, getLevelMap } from "./util";
import CascaderItem from "./panelItem";
import Node from "./model/node";
import SelectPanel from "../selectPanel";
import CasecaderSub from "./panelSecond";

export default {
  components: { CascaderItem, SelectPanel, CasecaderSub },
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
          labelSpare: "label",
          children: "children"
        };
      }
    },
    settings: {
      type: Array,
      required: true
    },
    selectSetting: {
      type: Object
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
    },
    // 懒加载
    lazy: {
      type: Boolean,
      default: false
    },
    // 懒加载方法
    lazyHandle: {
      type: Function
    },
    // 懒加载是否刷新
    lazyRefresh: {
      type: Boolean,
      default: true
    }
  },
  render(h) {
    return (
      <div class="cascader-panel">
        <div class="cascader-panel__select">
          <CascaderItem
            key={1}
            data={this.firstLevel}
            title={this.settings[0].title}
            level={1}
            maxLevel={this.maxLevel}
            showCheckBox={true}
            hasAllCheck={true}
            on-select={this.handleSelect}
            on-selectAll={this.handleSelectAll}
            on-check={this.handleCheck}
            on-check-click={this.handleCheckClick}
            on-check-all={(checked, pid) =>
              this.handleAllCheck(checked, pid, 0)
            }
          />
          <CasecaderSub
            key={2}
            data={this.secondLevel}
            title={this.settings[1].title}
            level={2}
            maxLevel={this.maxLevel}
            on-select={this.handleSelect}
            on-check={this.handleCheck}
            on-check-click={this.handleCheckClick}
            on-check-all={(checked, pid) =>
              this.handleAllCheck(checked, pid, 0)
            }
          />
        </div>
        {this.showSelect ? (
          <SelectPanel
            class="cascader-panel__choosen"
            data={this.checkedData}
            title={this.selectTitle}
            setting={this.selectSetting}
            on-clear-all={this.handleClearAll}
            on-remove={this.handleRemoveItem}
          />
        ) : null}
      </div>
    );
  },
  data() {
    return {
      datas: null, // 数据
      rootNode: null, // 节点树
      flattenData: [], // 平层数据
      levelMap: null, // 层级对应Map level:[]
      checkedData: [], // 选中数据
      curSelectNode: null // 当前选中节点
    };
  },
  watch: {
    data: {
      deep: true,
      handler(nv) {
        this.curSelectNode = null;
        this.datas = _.cloneDeep(nv);
      },
      immediate: true
    },
    datas: {
      deep: true,
      handler(nv) {
        this.initData();
      }
    },
    checkedData: {
      deep: true,
      handler(val, old) {
        let resultVal = this.getCheckedNodes();
        this.$emit("result-change", resultVal);
      }
    }
  },
  computed: {
    // 最大层级
    maxLevel() {
      return this.settings.length;
    },
    // 首层数据
    firstLevel() {
      return this.levelMap[1] || [];
    },
    // 一层选中显示下面,未选中显示全部
    secondLevel() {
      return this.curSelectNode ? this.curSelectNode.childNodes : this.levelMap[2] || [];
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.rootNode = new Node({
        data: this.datas,
        props: this.props
      });
      this.flattenData = flattenData(this.rootNode);
      this.levelMap = getLevelMap(this.flattenData);
    },
    // 单选
    handleSelect(id) {
      const selectNode = this.flattenData.find(item => item.id === id);
      this.curSelectNode = selectNode;
      selectNode.parent.childNodes.forEach(node => (node.selected = false));
      selectNode.selected = true;
    },
    // 全部
    handleSelectAll() {
      console.log(1)
      this.curSelectNode = null;
    },
    handleCheckClick(id) {
      this.$emit("checkClick", id);
    },
    handleCheck(isCheck, id, immediate = true) {
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
    },
    // 获取某些节点
    getSomeNodes(keys, keyName) {
      let result = [];
      let keyProp = keyName || this.props.key;
      keys.forEach(key => {
        result.push(this.flattenData.find(item => item.data[keyProp] == key));
      });
      return result;
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
  height: 100%;
  border: 1px solid #dee4f5;
  // flex: 2;
}

.@{prefix}-panel__choosen {
  // flex: 1;
}

.@{prefix}-panel-item {
  // flex: 1;
  overflow-y: hidden;
  height: 100%;
}
</style>
