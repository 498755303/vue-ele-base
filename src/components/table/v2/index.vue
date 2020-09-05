<template>
  <div class="adesk-table"
       v-loading="tbset.fixHeader && tbset.loading">
    <slot name="table-title"></slot>
    <scroll-line ref="scrollRef"
                 @scroll="scrollHandleTable"
                 @mouseEnter="e=>_mouseEnterNative(e,'scroll')"></scroll-line>
    <el-table :ref="fixTableRef"
              :class="classes"
              :style="styles"
              :data="fixTbData || []"
              :emptyHidden="true"
              :noCalcScrollX="true"
              v-show="showFixTable"
              :stripe="tbset.stripe"
              :border="tbset.noBorder ? false : true"
              :size="tbset.size"
              :fit="tbset.fit || true"
              :row-class-name="handleRowClass"
              :row-style="tableRowStyleName"
              :cell-class-name="handleCellClass"
              :cell-style="tableCellStyleName"
              :header-row-class-name="headerRowClassName"
              :header-row-style="headerRowStyle"
              :header-cell-class-name="headerCellClassName"
              :header-cell-style="headerCellStyle"
              :row-key="tbset.rowKey || 'id'"
              :empty-text="tbset.emptyText || '暂无数据'"
              :default-sort="tbset.defaultSort"
              :tooltip-effect="tbset.tooltipEffect"
              :span-method="arraySpanMethod"
              :select-on-indeterminate="tbset.selectOnIndeterminate"
              @select-all="_fixSelectAll"
              @sort-change="_sortHandleFixHeader"
              @header-dragend="_headerDragend"
              @tableBodyScroll="_fixTableBodyScroll"
              @mouseenter.native="e=>_mouseEnterNative(e,'fixTableHeader')"
              v-loading="!tbset.fixHeader && tbset.loading"
              element-loading-text="拼命加载中">

      <el-table-column v-if="tbset.index"
                       :resizable="tbset.resizable || false"
                       type="index"
                       :label="tbset.indexLable || '序号'"
                       width="50px"></el-table-column>
      <el-table-column v-if="tbset.selection"
                       :resizable="tbset.resizable || false"
                       type="selection"
                       :width="tbset.selectionWidth || 40"
                       :selectable="selectableHandle"
                       :reserve-selection="tbset.reserveSelection || false"></el-table-column>
      <template v-for="item in tbTitle">
        <el-table-column v-if="item.renderType == 'html'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :render-header="item.renderHeader"
                         :resizable="_canResize(item)"
                         :style="item.style"
                         :show-overflow-tooltip="item.showOverflowTooltip || false"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <div v-html="props.row[item.prop]"></div>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType == 'custormedit'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :render-header="item.renderHeader"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <el-button type="text"
                       v-for="(value,index) in item.edit"
                       :key="index"
                       @click.stop.exact.prevent="_operating(props.row,value.type)"
                       @click.ctrl.stop.prevent="_operatingCtrl(props.row,value.type)"
                       size="small"
                       :title="value.title"
                       :disabled="props.row['customer_btn_disabled'+value.type]"
                       :style="props.row['customer_btn_'+value.type] ||''"
                       :icon="value.icon"
                       :class="value.class">{{value.name}}
            </el-button>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType == 'edit'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :render-header="item.renderHeader"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <el-button @click="edithandle(props.row)"
                       type="primary"
                       size="mini"
                       title="修改">修改
            </el-button>
            <el-button @click="delhandle(props.row)"
                       type="primary"
                       plain
                       size="mini"
                       title="删除"
                       style="background:white">删除
            </el-button>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType == 'switch'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :render-header="item.renderHeader"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name"
               @click.stop="stopProgation">
            <el-switch v-model="props.row[item.prop]"
                       :disabled="item.disabled !=null ? item.disabled :(item.switchDisabledKey ? props.row[item.switchDisabledKey] : false)"
                       :active-value="item.activeVal || true"
                       :inactive-value="item.inactiveVal || false"
                       @change="(flag)=>_changeSwitch(flag,props.row)"></el-switch>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType=='template'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :render-header="item.renderHeader"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <p>{{item.slotname}}</p>
          <div slot-scope="props"
               :title="item.name">
            <span v-if="item.slotName">
              <slot :name="item.slotName"
                    :row="props.row"
                    :$index="props.$index"/>
            </span>
          </div>
        </el-table-column>
        <af-table-column v-else-if="item.renderType=='fitWidth'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :render-header="item.renderHeader"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :style="item.style"
                         :show-overflow-tooltip="item.showOverflowTooltip || false"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <div v-if="!!props.row[item.prop]">{{props.row[item.prop]}}</div>
            <div v-else>-</div>
          </div>
        </af-table-column>
        <el-table-column v-else-if="item.renderType=='default'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :render-header="item.renderHeader"
                         :resizable="_canResize(item)"
                         :style="item.style"
                         :show-overflow-tooltip="item.showOverflowTooltip || false"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <div v-if="!!props.row[item.prop] || props.row[item.prop]===0 || props.row[item.prop]==='0'">
              {{props.row[item.prop]}}
            </div>
            <div v-else>-</div>
          </div>
        </el-table-column>
        <el-table-column v-else
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width"
                         :style="item.style">
          <div slot-scope="props"
               :style="item.style"
               :title="item.name">
            <div v-if="item.name!='销售合同'">{{props.row[item.prop]}}</div>
            <div v-else>
              <div>{{props.row.contractCode}}</div>
              <div class="small">{{props.row.contractType}}</div>
              <div class="small">{{props.row.settlementType}}</div>
            </div>
          </div>
        </el-table-column>
      </template>
      <el-table-column v-if="tbset.expand"
                       :width="tbset.expendWidth"
                       type="expand">
        <div slot-scope="props">
          <slot name="expand"
                :row="props.row"
                :$index="props.$index"/>
        </div>
      </el-table-column>
    </el-table>
    <el-table :data="tbData"
              :height="tbset.height"
              :max-height="tbset.maxHeight"
              :stripe="tbset.stripe"
              :border="tbset.noBorder ? false : true"
              :size="tbset.size"
              :fit="tbset.fit || true"
              :show-header="tbset.showHeader"
              :highlight-current-row="tbset.highlight"
              :row-class-name="handleRowClass"
              :row-style="tableRowStyleName"
              :cell-class-name="handleCellClass"
              :cell-style="tableCellStyleName"
              :header-row-class-name="headerRowClassName"
              :header-row-style="headerRowStyle"
              :header-cell-class-name="headerCellClassName"
              :header-cell-style="headerCellStyle"
              :row-key="tbset.rowKey || 'id'"
              :empty-text="tbset.emptyText || '暂无数据'"
              :default-expand-all="tbset.expandAll || false"
              :expand-row-keys="expendRowKey"
              :default-sort="tbset.defaultSort"
              :tooltip-effect="tbset.tooltipEffect"
              :show-summary="tbset.showSummary || false"
              :sum-text="tbset.sumText || '合计'"
              :summary-method="getSummaries"
              :span-method="arraySpanMethod"
              :select-on-indeterminate="tbset.selectOnIndeterminate"
              :indent="tbset.indent || 16"
              :lazy="tbset.lazy"
              :load="lazyLoadHandle"
              :tree-props="tbset.treeProps"
              :style="`width:100%;${tbset.style}`"
              :ref="tabelRef"
              @select="_selectHandle"
              @select-all="_selectAllHandle"
              @selection-change="_selectionChangeHandle"
              @cell-mouse-enter="_cellMouseEnter"
              @cell-mouse-leave="_cellMouseLeave"
              @cell-click="_cellClick"
              @cell-dblclick="_cellDblClick"
              @row-click="_rowClick"
              @row-contextmenu="_rowContextMenu"
              @row-dblclick="_rowDblClick"
              @header-click="_headerClick"
              @header-contextmenu="_headerContextmenu"
              @sort-change="_sortHandleTable"
              @filter-change="_filterChange"
              @current-change="_currentChange"
              @header-dragend="_headerDragend"
              @expand-change="_expendChange"
              @mouseenter.native="e=>_mouseEnterNative(e,'table')"
              v-loading="!tbset.fixHeader && tbset.loading"
              @tableBodyScroll="_tableBodyScroll"
              element-loading-text="拼命加载中">
      <el-table-column v-if="tbset.index"
                       type="index"
                       :label="tbset.indexLable || '序号'"
                       :resizable="tbset.resizable || false"
                       width="50px"></el-table-column>
      <el-table-column v-if="tbset.selection"
                       type="selection"
                       :width="tbset.selectionWidth || 40"
                       :resizable="tbset.resizable || false"
                       :selectable="selectableHandle"
                       :reserve-selection="tbset.reserveSelection || false"></el-table-column>
      <template v-for="item in tbTitle">
        <el-table-column v-if="item.renderType == 'html'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :render-header="item.renderHeader"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :style="item.style"
                         :show-overflow-tooltip="item.showOverflowTooltip || false"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <div v-html="props.row[item.prop]"></div>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType == 'custormedit'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :render-header="item.renderHeader"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <el-button type="text"
                       v-for="(value,index) in item.edit"
                       :key="index"
                       @click.stop.exact.prevent="_operating(props.row,value.type)"
                       @click.ctrl.stop.prevent="_operatingCtrl(props.row,value.type)"
                       size="small"
                       :title="value.title"
                       :disabled="props.row['customer_btn_disabled'+value.type]"
                       :style="props.row['customer_btn_'+value.type] ||''"
                       :icon="value.icon"
                       :class="value.class">{{value.name}}
            </el-button>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType == 'edit'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :render-header="item.renderHeader"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <el-button @click="edithandle(props.row)"
                       type="primary"
                       size="mini"
                       title="修改">修改
            </el-button>
            <el-button @click="delhandle(props.row)"
                       type="primary"
                       plain
                       size="mini"
                       title="删除"
                       style="background:white">删除
            </el-button>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType == 'switch'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :render-header="item.renderHeader"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name"
               @click.stop="stopProgation">
            <el-switch v-model="props.row[item.prop]"
                       :disabled="item.disabled !=null ? item.disabled :(item.switchDisabledKey ? props.row[item.switchDisabledKey] : false)"
                       :active-value="item.activeVal || true"
                       :inactive-value="item.inactiveVal || false"
                       @change="(flag)=>_changeSwitch(flag,props.row)"></el-switch>
          </div>
        </el-table-column>
        <el-table-column v-else-if="item.renderType=='template'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :render-header="item.renderHeader"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width">
          <p>{{item.slotname}}</p>
          <div slot-scope="props"
               :title="item.name">
            <span v-if="item.slotName">
              <slot :name="item.slotName"
                    :row="props.row"
                    :$index="props.$index"/>
            </span>
          </div>
        </el-table-column>
        <af-table-column v-else-if="item.renderType=='fitWidth'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :render-header="item.renderHeader"
                         :resizable="_canResize(item)"
                         :style="item.style"
                         :show-overflow-tooltip="item.showOverflowTooltip || false"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <div v-if="!!props.row[item.prop]">{{props.row[item.prop]}}</div>
            <div v-else>-</div>
          </div>
        </af-table-column>
        <el-table-column v-else-if="item.renderType=='default'"
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :render-header="item.renderHeader"
                         :resizable="_canResize(item)"
                         :style="item.style"
                         :show-overflow-tooltip="item.showOverflowTooltip || false"
                         :width="item.width">
          <div slot-scope="props"
               :title="item.name">
            <div v-if="!!props.row[item.prop] || props.row[item.prop]===0 || props.row[item.prop]==='0'">
              {{props.row[item.prop]}}
            </div>
            <div v-else>-</div>
          </div>
        </el-table-column>
        <el-table-column v-else
                         :fixed="item.fixed || false"
                         :header-align="item.headerAlign || 'left'"
                         :align="item.align || 'left'"
                         :key="item.prop"
                         :prop="item.prop"
                         :label="item.name"
                         :sortable="item.issort"
                         :min-width="item.minWidth"
                         :resizable="_canResize(item)"
                         :width="item.width"
                         :style="item.style">
          <div slot-scope="props"
               :style="item.style"
               :title="item.name">
            <div v-if="item.name!='销售合同'">{{props.row[item.prop]}}</div>
            <div v-else>
              <div>{{props.row.contractCode}}</div>
              <div class="small">{{props.row.contractType}}</div>
              <div class="small">{{props.row.settlementType}}</div>
            </div>
          </div>
        </el-table-column>
      </template>
      <el-table-column v-if="tbset.expand"
                       :width="tbset.expendWidth"
                       type="expand">
        <div slot-scope="props">
          <slot name="expand"
                :row="props.row"
                :$index="props.$index"/>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import afTableColumn from '../afTableColumn/afTableColumn';
import FixHeaderMixin from "./fixed";
import ScrollLine from "./scrollbar/index";
import elTableMixin from "./scrollbar/observe_new";

export default {
  mixins: [FixHeaderMixin, elTableMixin],
  props: {
    // 数据
    tbData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 固定表头数据
    fixTbData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 基本设置
    tbset: {
      type: Object
    },
    // 表头列表
    tbTitle: {
      type: Array,
      default() {
        return [];
      }
    },
    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
    handleRowClass: {
      type: Function
    },
    // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
    tableRowStyleName: {
      type: Function
    },
    // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
    tableCellStyleName: {
      type: Function
    },
    // 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
    handleCellClass: {
      type: Function
    },
    // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
    headerRowClassName: {
      type: Function
    },
    // 表头行的style的回调方法，也可以使用一个固定的Object为所有表头行设置一样的Style。
    headerRowStyle: {
      type: Function
    },
    // 表头单元格的className的回调方法也可以使用字符串为所有表头单元格设置一个固定的className。
    headerCellClassName: {
      type: Function
    },
    // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object为所有表头单元格设置一样的Style
    headerCellStyle: {
      type: Function
    },
    // 当前展开项
    expendRowKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 自定义合计计算方法
    getSummaries: {
      type: Function
    },
    // 合并行列
    arraySpanMethod: {
      type: Function
    },
    // 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
    lazyLoadHandle: {
      type: Function
    },
    // 是否可选
    selectableHandle: {
      type: Function,
      default: function () {
        return true;
      }
    }
  },
  data() {
    return {
      tableHeaderWrapper: null,
      tableBodyWrapper: null,
      fixTableBodyWrapper: null,
      fixTableHeaderWrapper: null,
      curThead: {},
      // 当前展开行,需指定row-key
      expendRowKey: []
    };
  },
  computed: {
    tabelRef() {
      return this.tbset.ref || 'adeskTableRef';
    },
    fixTableRef() {
      return this.tbset.fixRef || 'adeskFixTableRef';
    },
    // 是否展示固定表头
    showFixTable() {
      return this.tbset.fixHeader && this.slot;
    }
  },
  methods: {
    // switch阻止点击
    stopProgation() {
      return false;
    },
    _canResize(item) {
      if (item.resizable != undefined) {
        return item.resizable;
      } else {
        if (this.tbset.resizable) {
          return this.tbset.resizable;
        } else {
          if (this.tbset.resizable != undefined) {
            return this.tbset.resizable;
          } else {
            return true;
          }
        }
      }
    },
    // 获取表格体,返回位置
    _getTableBody() {
      if (!this.tableHeaderWrapper) {
        if (this.$refs[this.tabelRef]) {
          this.tableHeaderWrapper = this.$refs[
            this.tabelRef
          ].$el.querySelector(".adesk_table-header");
        }
      }
      if (!this.tableBodyWrapper) {
        this.tableBodyWrapper = this.$refs[this.tabelRef].$el.querySelector(
          ".scrolling_adesk"
        );
      }
      return this.tableBodyWrapper.scrollLeft;
    },
    // 获取固定表头体
    _getFixTableBody() {
      if (!this.fixTableHeaderWrapper) {
        if (this.$refs[this.fixTableRef]) {
          this.fixTableHeaderWrapper = this.$refs[
            this.fixTableRef
          ].$el.querySelector(".adesk_table-header");
        }
      }
      if (!this.fixTableBodyWrapper) {
        if (this.$refs[this.fixTableRef]) {
          this.fixTableBodyWrapper = this.$refs[
            this.fixTableRef
          ].$el.querySelector(".scrolling_adesk");
        }
      }
      return this.fixTableBodyWrapper.scrollLeft;
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    _selectHandle(selection, row) {
      this.tbset.selection &&
      this.$emit('selectHandle', {
        selection,
        row
      });
    },
    // 当用户手动勾选全选Checkbox时触发的事件
    _selectAllHandle(selection) {
      this.tbset.selection && this.$emit('selectAllHandle', { selection });
    },
    // 当选择项发生变化时会触发该事件
    _selectionChangeHandle(selection) {
      this.tbset.selection && this.$emit('selectChange', selection);
    },
    // 当单元格 hover 进入时会触发该事件
    _cellMouseEnter(row, column, cell, event) {
      if (this.tbset.dealHover) {
        this.$emit('cellMouseEnter', row, column, cell, event);
      } else {
        return false;
      }
    },
    // 当单元格 hover 退出时会触发该事件
    _cellMouseLeave(row, column, cell, event) {
      if (this.tbset.dealHover) {
        this.$emit('cellMouseLeave', row, column, cell, event);
      } else {
        return false;
      }
    },
    // 当某个单元格被点击时会触发该事件
    _cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event);
    },
    // 当某个单元格被双击击时会触发该事件
    _cellDblClick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event);
    },
    // 当某一行被点击时会触发该事件
    _rowClick(row, event, column) {
      this.$emit('rowClick', row, event, column);
    },
    // 当某一行被鼠标右键点击时会触发该事件
    _rowContextMenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event);
    },
    // 当某一行被双击时会触发该事件
    _rowDblClick(row, column, event) {
      this.$emit('rowDblClick', row, column, event);
    },
    // 当某一列的表头被点击时会触发该事件
    _headerClick(column, event) {
      this.$emit('headerClick', column, event);
    },
    // 当某一列的表头被鼠标右键点击时触发该事件
    _headerContextmenu(column, event) {
      this.$emit('headerContextmenu', column, event);
    },
    // 表头表格排序变化
    _sortHandleFixHeader({ column, prop, order }) {
      const cols = ["_columns", "originColumns", "columns", "fixedColumns", "rightFixedColumns", "leafColumns", "fixedLeafColumns", "rightFixedLeafColumns", "leafColumnsLength", "fixedLeafColumnsLength", "rightFixedLeafColumnsLength", "sortingColumn", "sortProp", "sortOrder"];
      cols.forEach(v => {
        this.$refs[this.tabelRef].store.states[v] = this.$refs[this.fixTableRef].store.states[v];
      });
      this.$emit('sortHandle', prop, order);
    },
    // 当表格表体的排序条件发生变化的时候会触发该事件
    _sortHandleTable({ column, prop, order }) {
      const cols = ["_columns", "originColumns", "columns", "fixedColumns", "rightFixedColumns", "leafColumns", "fixedLeafColumns", "rightFixedLeafColumns", "leafColumnsLength", "fixedLeafColumnsLength", "rightFixedLeafColumnsLength", "sortingColumn", "sortProp", "sortOrder"];
      cols.forEach(v => {
        this.$refs[this.fixTableRef].store.states[v] = this.$refs[this.tabelRef].store.states[v];
      });
      this.$emit('sortHandle', prop, order);
    },
    // 当表格的筛选条件发生变化的时候会触发该事件
    _filterChange(filters) {
      this.$emit('filterChange', filters);
    },
    // 当表格的当前行发生变化的时候会触发该事件
    _currentChange(currentRow, oldCurrentRow) {
      this.$emit("currentChange", currentRow, oldCurrentRow);
    },
    // 当拖动表头改变了列的宽度的时候会触发该事件
    _headerDragend(newWidth, oldWidth, column, event) {
      this.$emit('headerDragend', newWidth, oldWidth, column, event);
    },
    // 当用户对某一行展开或者关闭的时候会触发该事件
    _expendChange(row, expanded) {
      this.$emit("expendChange", row, expanded);
    },
    // 滚动表头
    scrollFixTable(left) {
      console.log(this.fixTableBodyWrapper, this.fixTableHeaderWrapper);
      if (this.fixTableBodyWrapper) {
        this.fixTableBodyWrapper.scrollLeft = left;
      }
      if (this.fixTableHeaderWrapper) {
        this.fixTableHeaderWrapper.scrollLeft = left;
      }
    },
    // 滚动表体
    scrollTable(left) {
      this.tableHeaderWrapper.scrollLeft = left;
      this.tableBodyWrapper.scrollLeft = left;
    },
    // 表格体滚动触发
    _tableBodyScroll(vm, e) {
      console.log(vm, e);
      this.scrollFixTable(vm.bodyWrapper.scrollLeft);
      this.scrollLinear && this.scrollLinear(vm, e);
      this.$emit("scroll", vm, e);
    },
    _fixTableBodyScroll(vm, e) {
      this.scrollTable(vm.bodyWrapper.scrollLeft);
      this.scrollLinear && this.scrollLinear(vm, e);
      this.$emit("scrollFixTable", vm, e);
    },
    // 自定义按钮
    _operating(row, num) {
      this.$emit('handleoperating', {
        row: row,
        type: num
      });
    },
    // ctrl自定义按钮
    _operatingCtrl(row, num) {
      this.$emit('_operatingCtrl', {
        row: row,
        type: num
      });
    },
    _changeSwitch(...arg) {
      this.$emit('switchHandle', { e: arg[0], data: arg[1] });
    },
    // 固定表头的全选事件
    _fixSelectAll(selection) {
      this.$refs[this.tabelRef].toggleAllSelection();
      this.$emit("fixSelectAll", selection);
    }
  },
  components: {
    afTableColumn,
    ScrollLine
  },
  watch: {
    expendRowKeys: {
      handler: function (nv) {
        this.expendRowKey = nv;
      },
      deep: true
    },
    "tbset.defaultSort"(nv) {
      // console.log(nv);
    }
  }
};
</script>
<style scoped lang="less">
  @deep: ~">>>";
  .adesk-fixed-table_header {
    position: fixed;
    z-index: 10;
  }

  .adesk-table {
    .adesk-fixed-table_header {
      .scrolling_adesk {
        overflow-x: hidden !important;
        display: block;
      }
    }
  }
</style>
