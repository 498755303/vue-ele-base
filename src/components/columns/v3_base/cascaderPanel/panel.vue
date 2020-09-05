<script>
import { flattenData } from "./util";
import CascaderItem from "./panelItem";
import LiDom from "./lidom";
import Node from "./model/node";
import SelectPanel from "../selectPanel";

export default {
  components: { CascaderItem, SelectPanel, LiDom },
  name: "ColumnsPanel",
  props: {
    data: {
      type: Array,
      required: true
    },
    // 必选项
    mustColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    props: {
      type: Object,
      default: function () {
        return {
          key: "id",
          label: "label",
          children: "children",
          controlList: "subItems",
          disabled: "disabled",
          hidden: "hide"
        };
      }
    },
    settings: {
      type: Object,
      required: true
    },
    checkedLevel: {
      type: Number,
      required: true
    },
    zipLevel: {
      type: Number,
      required: true
    },
    showSelect: {
      type: Boolean,
      default: true
    },
    dragable: {
      type: Boolean,
      default: false
    },
    // 是否可选父级
    parentCheckedable: {
      type: Boolean,
      default: false
    }
  },
  render(h) {
    let data = this.rootNode.childNodes;
    return (
      <div class="columns-panel">
        <div class="columns-panel__select">
          <div class="columns-panel__header">{this.settings.header}</div>
          <div class="columns-panel__content clearfix">
            <ul class="columns-panel__content_left">
              {this.levelOneData.map((item, index) => {
                return (
                  <LiDom
                    data={item}
                    index={index}
                    activeIndex={this.activeLi}
                    on-liClick={() => this.liClick(item, index)}
                  />
                );
              })}
            </ul>
            <div class="columns-panel__content_right">
              <div class="columns-panel__content_box_wrap">
                {data.map((item, index) => {
                  return (
                    <div class="columns-panel__content_box">
                      <p class="columns-panel__content_box_header">
                        {item.text}
                      </p>
                      <CascaderItem
                        key={index}
                        data={item.childNodes}
                        level={item.level + 1}
                        showCheckBox={true}
                        hasAllCheck={true}
                        on-check={this.handleCheck}
                        on-check-all={(checked, pid) =>
                          this.handleAllCheck(checked, pid, index)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {(this.showSelect && (this.checkedData && this.checkedData.length)) ||
          (this.mustColumns && this.mustColumns.length) ? (
            <SelectPanel
              class="columns-panel__choosen"
              must={this.mustColumns}
              data={this.checkedData}
              mustProps={this.props}
              title={this.selectTitle}
              dragable={this.dragable}
              on-clear-all={this.handleClearAll}
              on-remove={this.handleRemoveItem}
              on-update={this.update}
            />
          ) : null}
      </div>
    );
  },
  data() {
    return {
      rootNode: null,
      flattenData: [],
      checkedData: [],
      headerTopList: [],
      activeLi: 0
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.rootNode = new Node({
          data: this.data,
          props: this.props
        });
        this.flattenData = flattenData(this.rootNode);
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
    maxLevel() {
      return this.settings.length;
    },
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
    },
    levelOneData() {
      let tmp = this.getFlattenData(1);
      return tmp;
    }
  },
  created() {
    this.initData();
  },
  methods: {
    update(o) {
      this.checkedData = o;
    },
    _getCheckedData() {
      // 压缩数据 一级一级压缩
      let result = [];
      const toZipData = this.flattenData.filter(p => p.level === this.zipLevel);
      function step(nodes) {
        if (!nodes || !nodes.length) {
          return;
        }
        const curSelectData = nodes.filter(
          p => !p.disabled && (p.checked || p.noChildChecked)
        );
        const noSelectData = nodes.filter(
          p => !(p.checked || p.noChildChecked)
        );
        result.push(...curSelectData);
        noSelectData.forEach(p => step(p.childNodes));
      }
      step(toZipData);
      this.checkedData = result;
    },
    getCheckedData() {
      return this.checkedData;
    },
    _checkChange(node, f) {
      let index = -1;
      if (this.checkedData && this.checkedData.length) {
        index = this.checkedData.findIndex(v => {
          return v.id === node.id;
        });
      }
      if (f) {
        if (index === -1) {
          this.checkedData.push(node);
        }
      } else {
        if (index > -1) {
          this.checkedData.splice(index, 1);
        }
      }
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
      const self = this;
      // 递归
      // 由父到子
      function setCheck(node) {
        node.checked = isCheck;
        self._checkChange(node, isCheck);
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
        self._checkChange(parent, parent.checked);
        setParentCheck(parent.parent);
      }
      setCheck(selectNode);
      this.parentCheckedable && setParentCheck(selectNode.parent);
      if (selectNode.data[this.props.controlList]) {
        let ids = selectNode.data[this.props.controlList].map(val => {
          return this.flattenData.find(v => v.data.id == val).id;
        });
        ids.forEach(id => {
          this.handleDisabled(id, !isCheck);
          !isCheck && this.handleCheck(isCheck, id);
        });
      }
      if (immediate) {
        this.getCheckedData();
      }
    },
    handleAllCheck(isCheck, parentId, index) {
      const selectNode = this.flattenData.find(item => item.id === parentId);
      // 第一级全选性能优化
      selectNode.checked = isCheck;
      selectNode.childNodes.forEach(item => {
        this.handleCheck(isCheck, item.id, false);
      });
      this.getCheckedData();
    },
    // 选中清除
    handleRemoveItem(id) {
      this.handleCheck(false, id);
    },
    // 选中清空
    handleClearAll(ids) {
      ids.forEach(id => {
        this.handleCheck(false, id);
      });
    },
    setCheckedNode(key, immediate = true, checked = true) {
      const selectNode = this.flattenData.find(item => item.data[this.props.key] === key);
      if (selectNode && !selectNode.disabled) {
        this.handleCheck(checked, selectNode.id, immediate);
      }
    },
    // 左侧列表点击事件
    liClick(item, index) {
      let wrap = document.querySelector(".columns-panel__content_right");
      wrap.scrollTo(0, this.headerTopList[index]);
      this.activeLi = index;
    },
    // 生成位置数据
    privateGeneratePosition() {
      let headerList = document.querySelectorAll(
        ".columns-panel__content_box_header"
      );
      let wrap = document.querySelector(".columns-panel__content_right");
      let wrapTop = wrap.offsetTop;
      let topList = [];
      headerList.forEach(val => {
        topList.push(val.offsetTop - wrapTop);
      });
      this.headerTopList = topList;
    },
    // 切换disabled
    handleDisabled(id, flag) {
      let tmp = this.flattenData.find(item => item.id === id);
      if (tmp) {
        tmp[this.props.disabled] = flag;
      }
    },
    // 初始化数据
    initData() {
      this.rootNode = new Node({
        data: this.data,
        props: this.props
      });
      this.flattenData = flattenData(this.rootNode);
      let disables = [];
      this.flattenData.forEach(item => {
        if (item.data[this.props.controlList]) {
          item.data[this.props.controlList].forEach(id => {
            let disabledNode = this.flattenData.find(
              val => val.data[this.props.key] === id
            );
            if (disabledNode) {
              disables.push(disabledNode.id);
            }
          });
        }
      });
      disables = new Set(disables);
      disables.forEach(v => {
        this.handleDisabled(v, true);
      });
    },
    /* public API */
    setCheckedNodes(keys) {
      keys.forEach(key => {
        this.setCheckedNode(key, false);
      });
      this.getCheckedData();
    },
    // 先清空已选
    setCheckedNodesByClear(keys) {
      this.checkedData = [];
      this.setCheckedNodes(keys);
    },
    setNewCheckedNodes(keys) {
      /* public API */
      this.refreshAll();
      keys.forEach(key => {
        this.setCheckedNode(key, false);
      });
    },
    /* public API */
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
    // 清空所有节点
    refreshAll() {
      /* public API */
      const ids = this.flattenData
        .filter(
          p => (p.checked && p.level === this.checkedLevel) || p.noChildChecked
        )
        .map(p => p.id);
      this.handleClearAll(ids);
    },
    // 清空单个选中项 public API */
    clearCheckedNodes(keys) {
      keys.forEach(key => {
        this.setCheckedNode(key, false, false);
      });
      this.getCheckedData();
    },
    // 获取平级数据
    getFlattenData(level) {
      return this.flattenData.filter(v => v.level == level);
    },
    // 监听滚动事件处理
    privateHandleScroll() {
      let el = document.querySelector(".columns-panel__content_right");
      let top = el.scrollTop;
      let tmp = [...this.headerTopList];
      tmp.push(el.scrollTop);
      tmp = tmp.sort(function (a, b) {
        return a - b;
      });
      let index = tmp.findIndex(function (a) {
        return a == top;
      });
      if (tmp[index] == this.headerTopList[index]) {
        this.activeLi = index;
      } else {
        this.activeLi = index - 1;
      }
    }
  },
  mounted() {
    this.privateGeneratePosition();
    document
      .querySelector(".columns-panel__content_right")
      .addEventListener("scroll", this.privateHandleScroll);
  },
  beforeDestroy: function () {
    let domContent = document.querySelector(".columns-panel__content_right");
    domContent && domContent.removeEventListener("scroll", this.privateHandleScroll);
  }
};
</script>
<style lang="less" scoped>
@prefix: columns-panel;
@baseH: 445px;
@headerC: #f9fafd;
@headerPaddingV: 8px;
@headerLineH: 22px;
.@{prefix} {
  height: @baseH;
  display: flex;
  .@{prefix}__select {
    height: @baseH;
    flex: 5;
    .@{prefix}__header {
      background-color: @headerC;
      border: #e4e9ed 1px solid;
      box-sizing: border-box;
      line-height: @headerLineH;
      padding: @headerPaddingV 12px;
    }

    .@{prefix}__content {
      border: #e4e9ed 1px solid;
      border-top: 0;
      box-sizing: border-box;
      height: calc(@baseH - @headerPaddingV * 2 - @headerLineH - 2px);
      padding: 0;
      overflow: hidden;
      .@{prefix}__content_left {
        width: 20%;
        min-width: 160px;
        float: left;
        border-right: #e4e9ed 1px solid;
        overflow-y: auto;
        padding: 12px 16px;
        box-sizing: border-box;
        min-height: calc(@baseH - @headerPaddingV * 2 - @headerLineH - 2px);
      }
      .@{prefix}__content_right {
        float: left;
        width: 80%;
        max-width: calc(100% - 160px);
        height: calc(@baseH - @headerPaddingV * 2 - @headerLineH - 2px);
        overflow-y: auto;
        .@{prefix}__content_box_wrap {
          .@{prefix}__content_box {
            background-color: #fff;
            border-bottom: 1px solid #dddee1;
            .@{prefix}__content_box_header {
              color: #1c2438;
              letter-spacing: 0;
              border-bottom: 1px solid #dee4f5;
              background-color: #fafbfe;
              font-size: 14px;
              padding: 0 12px;
              line-height: 36px;
            }
          }
        }
      }
    }
  }
  .@{prefix}__choosen {
    width: calc(30% - 2px);
    flex: 2;
  }
}
</style>
