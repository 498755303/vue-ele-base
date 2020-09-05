<template>
  <div class="cn-table">
    <slot name="table-title"></slot>
    <template>
      <el-table :style="`width:100%;${tbset.style}`"
                :ref="tbset.ref"
                v-if="tbset.mouseevent"
                :border="tbset.noBorder?false : true"
                :fit="tbset.fit || true"
                :height="tbset.height"
                :max-height="tbset.maxHeight"
                :show-summary="tbset.showSummary"
                :summary-method="getSummaries"
                :size="tbset.size"
                :data="tbData"
                :empty-text="'暂无数据'"
                :row-key="tbset.rowKey || 'id'"
                :stripe="tbset.stripe"
                :expand-row-keys="expendRowKey"
                :highlight-current-row="tbset.highlight"
                :default-sort="tbset.defaultSort"
                @current-change="handleCurrentChange"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="leaveHandle"
                @cell-click="clickHandle"
                @cell-dblclick="cellDblclick"
                @row-click="rowclickHandle"
                @row-contextmenu="rowContextmenu"
                @header-contextmenu="headerContextmenu"
                @row-dblclick="rowDblclick"
                @header-click="headerClick"
                @sort-change="sorthandle"
                @select="handleSelect"
                @select-all="handleSelectall"
                @selection-change="handleSelectionChange"
                @tableBodyScroll="tableBodyScroll"
                v-loading="tbset.loading"
                :row-class-name="handleRowClass"
                :row-style="tableRowStyleName"
                :cell-style="tableCellStyleName"
                :header-row-style="headerRowStyle"
                :span-method="arraySpanMethod"
                header-row-class-name="elthead"
                element-loading-text="拼命加载中">
        <el-table-column v-if="tbset.index"
                         type="index"
                         :label="tbset.indexLable || '序号'"
                         width="50px"></el-table-column>
        <el-table-column v-if="tbset.selection"
                         type="selection"
                         :width="tbset.selectionWidth || 40"
                         :selectable="selectableHandle"></el-table-column>

        <template v-for="item in tbTitle">
          <el-table-column v-if="item.renderType == 'img'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <!-- 此处需要增加自定义的模板，添加if else -->
            <div slot-scope="props"
                 :title="item.name">
              <img v-if="props.row.headImage"
                   :src="props.row.headImage"
                   style="width:50px;height:50px;border-radius:50%">
              <img v-else-if="props.row.coverurl"
                   :src="props.row.coverurl"
                   style="width:80px;border:1px solid #909090;max-width: 100px;">
              <img v-else-if="props.row.image"
                   :src="props.row.image"
                   style="border: 1px solid #e0e0e0;display: inline-block;margin: 5px;max-width: 100px;box-shadow: 10px 9px 5px 2px #e6e6e6;border-radius: 40px;">
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'html'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :style="item.style"
                           :width="item.width"
                           :show-overflow-tooltip="item.showOverflowTooltip || false"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true">
            <div slot-scope="props"
                 :title="item.name">
              <div v-html="props.row[item.prop]"></div>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'custormedit'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :width="item.width"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true">
            <div slot-scope="props"
                 :title="item.name">
              <el-button type="text"
                         v-for="(value,index) in item.edit"
                         :key="index"
                         @click.excat.stop.prevent="operating(props.row,value.type)"
                         @click.ctrl.excat.stop.prevent="operatingCtrl(props.row,value.type)"
                         size="small"
                         :title="value.title"
                         :disabled="props.row['customer_btn_disabled'+value.type]"
                         :style="props.row['customer_btn_'+value.type] ||''"
                         :icon="value.icon"
                         :class="value.class">{{value.name}}</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'edit'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :width="item.width"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true">
            <div slot-scope="props"
                 :title="item.name">
              <el-button @click="edithandle(props.row)"
                         type="text"
                         :disabled="item.switchStatus"
                         size="small">修改</el-button>
              <el-button @click="delhandle(props.row)"
                         type="text"
                         :disabled="item.switchStatus"
                         size="small">删除</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='onlyedit'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-button @click="edithandle(props.row)"
                         class="modify"
                         title="修改"
                         type="text"
                         :disabled="item.switchStatus"
                         size="small">修改</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'more'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <template>
                <el-button @click.stop.exact="edithandle(props.row)"
                           @click.ctrl.exact="edithandleCtrl(props.row)"
                           type="text"
                           :disabled="item.switchStatus"
                           size="small">查看详情</el-button>
              </template>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='radiogroup'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-radio class="radio"
                        v-model="radio"
                        :label="props.$index"
                        @change="emitRadio"></el-radio>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'switch'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name"
                 @click.stop="stopProgation">
              <el-switch v-model="props.row[item.prop]"
                         :disabled="item.disabled !=null ? item.disabled :(item.switchDisabledKey ? props.row[item.switchDisabledKey] : false)"
                         :active-value="item.activeVal || true"
                         :inactive-value="item.inactiveVal || false"
                         @change="(flag)=>changeSwitch(flag,props.row)"></el-switch>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='configurable'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-button @click="edithandle(props.row)"
                         class="modify"
                         title="修改"
                         :type="item.btntype"
                         :disabled="item.switchStatus"
                         size="small">{{item.btnstatus}}</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='template'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :render-header="item.renderHeader"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <span v-if="item.slotName">
                <slot :name="item.slotName"
                      :row="props.row"
                      :$index="props.$index" />
              </span>
            </div>
          </el-table-column>
          <el-table-column v-else
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :style="item.style"
                           :render-header="item.renderHeader"
                           :show-overflow-tooltip="item.showOverflowTooltip || false"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <div v-if="!!props.row[item.prop] || props.row[item.prop]===0 || props.row[item.prop]==='0'">
                {{props.row[item.prop]}}</div>
              <div v-else>-</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column v-if="tbset.expand"
                         :width="tbset.expendWidth"
                         type="expand">
          <div slot-scope="props">
            <slot name="expand"
                  :row="props.row"
                  :$index="props.$index" />
          </div>
        </el-table-column>
      </el-table>
      <el-table :style="`width:100%;${tbset.style}`"
                :ref="tbset.ref"
                v-else-if="!tbset.mouseevent"
                :fit="tbset.fit || true"
                :border="tbset.noBorder?false : true"
                :show-summary="tbset.showSummary"
                :summary-method="getSummaries"
                :height="tbset.height"
                :max-height="tbset.maxHeight"
                :data="tbData"
                :empty-text="'暂无数据'"
                :size="tbset.size"
                :stripe="tbset.stripe"
                :row-key="tbset.rowKey || 'id'"
                :expand-row-keys="expendRowKey"
                :highlight-current-row="tbset.highlight"
                :default-sort="tbset.defaultSort"
                @current-change="handleCurrentChange"
                @sort-change="sorthandle"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="leaveHandle"
                @cell-click="clickHandle"
                @cell-dblclick="cellDblclick"
                @row-contextmenu="rowContextmenu"
                @header-contextmenu="headerContextmenu"
                @row-dblclick="rowDblclick"
                @header-click="headerClick"
                @row-click="rowclickHandle"
                @select="handleSelect"
                @tableBodyScroll="tableBodyScroll"
                @select-all="handleSelectall"
                @selection-change="handleSelectionChange"
                @mouseenter.native="mouseEnter"
                v-loading="tbset.loading"
                :row-class-name="handleRowClass"
                :row-style="tableRowStyleName"
                :cell-style="tableCellStyleName"
                :header-row-style="headerRowStyle"
                :span-method="arraySpanMethod"
                header-row-class-name="elthead"
                element-loading-text="拼命加载中">
        <el-table-column v-if="tbset.index"
                         type="index"
                         :label="tbset.indexLable || '序号'"
                         width="50px"></el-table-column>
        <el-table-column v-if="tbset.selection"
                         type="selection"
                         :width="tbset.selectionWidth || 40"
                         :selectable="selectableHandle"></el-table-column>

        <template v-for="item in tbTitle">
          <el-table-column v-if="item.renderType == 'img'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :render-header="item.renderHeader"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <!-- 此处需要增加自定义的模板，添加if else -->
            <div slot-scope="props"
                 :title="item.name">
              <img v-if="props.row.headImage"
                   :src="props.row.headImage"
                   style="width:50px;height:50px;border-radius:50%">
              <img v-else-if="props.row.coverurl"
                   :src="props.row.coverurl"
                   style="width:80px;border:1px solid #909090;max-width: 100px;">
              <img v-else-if="props.row.image"
                   :src="props.row.image"
                   style="border: 1px solid #e0e0e0;display: inline-block;margin: 5px;max-width: 100px;box-shadow: 10px 9px 5px 2px #e6e6e6;border-radius: 40px;">
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'html'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :render-header="item.renderHeader"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
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
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :render-header="item.renderHeader"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-button type="text"
                         v-for="(value,index) in item.edit"
                         :key="index"
                         @click.stop.exact.prevent="operating(props.row,value.type)"
                         @click.ctrl.stop.prevent="operatingCtrl(props.row,value.type)"
                         size="small"
                         :title="value.title"
                         :disabled="props.row['customer_btn_disabled'+value.type]"
                         :style="props.row['customer_btn_'+value.type] ||''"
                         :icon="value.icon"
                         :class="value.class">{{value.name}}</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'edit'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :render-header="item.renderHeader"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-button @click="edithandle(props.row)"
                         type="primary"
                         size="mini"
                         title="修改">修改</el-button>
              <el-button @click="delhandle(props.row)"
                         type="primary"
                         plain
                         size="mini"
                         title="删除"
                         style="background:white">删除</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'onlyedit'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :render-header="item.renderHeader"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-button @click="edithandle(props.row)"
                         class="modify"
                         title="修改"
                         type="text"
                         :disabled="item.switchStatus"
                         size="small"
                         icon="el-icon-edit">修改</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'more'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :render-header="item.renderHeader"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <template>
                <el-button @click="edithandle(props.row)"
                           type="text"
                           :disabled="item.switchStatus"
                           size="small">查看详情</el-button>
              </template>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='radiogroup'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :render-header="item.renderHeader"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-radio class="radio"
                        v-model="radio"
                        :label="props.$index"
                        @change="emitRadio"></el-radio>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType == 'switch'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :render-header="item.renderHeader"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name"
                 @click.stop="stopProgation">
              <el-switch v-model="props.row[item.prop]"
                         :disabled="item.disabled !=null ? item.disabled :(item.switchDisabledKey ? props.row[item.switchDisabledKey] : false)"
                         :active-value="item.activeVal || true"
                         :inactive-value="item.inactiveVal || false"
                         @change="(flag)=>changeSwitch(flag,props.row)"></el-switch>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='configurable'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :render-header="item.renderHeader"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-button v-if="item.btnstatus != '不可修改'"
                         @click="edithandle(props.row)"
                         class="modify"
                         title="修改"
                         :type="item.btntype"
                         :disabled="item.switchStatus"
                         size="small">{{item.btnstatus}}</el-button>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='popover'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :render-header="item.renderHeader"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-popover trigger="click"
                          @show="inputcontent = ''"
                          popper-class="bcpopper"
                          width="200px"
                          placement="top">
                <el-input v-model="inputcontent"
                          type="number"
                          :maxlength="10"
                          :min="0"
                          style="width:150px"
                          placeholder="请输入">
                  <template v-if="!item.showPer"
                            slot="append"
                            style="width:10%">%</template>
                </el-input>
                <el-button type="primary"
                           size="mini"
                           @click="saveResult({row:props.row,column:props.column,val:inputcontent})">保存</el-button>
                <div slot="reference"
                     class="name-wrapper"
                     style="cursor:pointer">
                  <div v-html="props.row[item.prop]"></div>
                </div>
              </el-popover>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='progress'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :render-header="item.renderHeader"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <el-progress :text-inside="true"
                           :stroke-width="18"
                           :percentage="props.row[item.prop]"></el-progress>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='tooltip'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :render-header="item.renderHeader"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 style="display:flex;justify-content:space-around"
                 :title="item.name">
              <!-- 显示提示框根据isShow判断是否显示 position:现实的位置，effect:主题，content：内容字段,placement:方向-->
              <el-tooltip v-if="props.row[item.tooltip.isShow]  && item.tooltip.position == 'before'"
                          class="item"
                          :effect="item.tooltip.effect || 'dark'"
                          :placement="item.tooltip.placement || 'top-start'">
                <div slot="content">{{props.row[item.tooltip.content] || '无'}}</div>
                <div v-html="item.tooltip.innerContent"></div>
              </el-tooltip>
              <div v-html="props.row[item.prop]"></div>
              <el-tooltip v-if=" props.row[item.tooltip.isShow]  && item.tooltip.position == 'after'"
                          class="item"
                          :effect="item.tooltip.effect || 'dark'"
                          :placement="item.tooltip.placement || 'top-start'">
                <div slot="content">{{props.row[item.tooltip.content] || '无'}}</div>
                <div v-html="item.tooltip.innerContent"></div>
              </el-tooltip>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='imageList'"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :render-header="item.renderHeader"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <div slot-scope="props"
                 style="display:flex;justify-content:space-around"
                 :title="item.name"
                 class="photo">
              <img :src="props.row.material_url"
                   alt
                   :preview="1">
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='template'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :render-header="item.renderHeader"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width">
            <p>{{item.slotname}}</p>
            <div slot-scope="props"
                 :title="item.name">
              <span v-if="item.slotName">
                <slot :name="item.slotName"
                      :row="props.row"
                      :$index="props.$index" />
              </span>
            </div>
          </el-table-column>
          <el-table-column v-else-if="item.renderType=='accountCost'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :render-header="item.renderHeader"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :width="item.width"
                           :style="item.style">
            <div slot-scope="props"
                 :style="item.style"
                 :title="item.name">
              <div>
                <div>{{props.row.accountCosttrans}}</div>
                <div class="small"
                     v-if="props.row.platformId===7">存入：{{props.row.deposittrans}}</div>
              </div>
            </div>
          </el-table-column>
          <af-table-column v-else-if="item.renderType=='fitWidth'"
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :render-header="item.renderHeader"
                           :resizable="item.resizable===false ?item.resizable: true"
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
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :render-header="item.renderHeader"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
                           :style="item.style"
                           :show-overflow-tooltip="item.showOverflowTooltip || false"
                           :width="item.width">
            <div slot-scope="props"
                 :title="item.name">
              <div v-if="!!props.row[item.prop] || props.row[item.prop]===0 || props.row[item.prop]==='0'">
                {{props.row[item.prop]}}</div>
              <div v-else>-</div>
            </div>
          </el-table-column>
          <el-table-column v-else
                           :fixed="item.fixed || false"
                           :header-align="item.headerAlign || 'center'"
                           :align="item.align || 'center'"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.name"
                           :sortable="item.issort"
                           :min-width="item.minWidth"
                           :resizable="item.resizable===false ?item.resizable: true"
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
                  :$index="props.$index" />
          </div>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
// 父组件传值需:固定列单独单出来写
import afTableColumn from './afTableColumn/afTableColumn';
export default {
  name: 'adeskTable',
  components: { afTableColumn },
  props: {
    tbData: {
      required: true
    }, // 表格内容数组
    tbTitle: {
      type: Array,
      required: true
    }, // 表头文字
    tbset: {
      type: Object
    },
    // 当前展开行的key数组
    expendRowKeys: {
      default: function () {
        return [];
      },
      type: Array
    },
    handleRowClass: {
      type: Function
    },
    tableRowStyleName: {
      type: Function
    },
    tableCellStyleName: {
      type: Function
    },
    headerRowStyle: {
      type: Function
    },
    getSummaries: {
      type: Function
    },
    arraySpanMethod: {},
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
      radio: '',
      expendRowKey: [],
      tableNumList: null
    };
  },
  methods: {
    clickHeader() {
      this.$emit('clickHeader')
    },
    edithandle(row) {
      this.$emit('handleedit', row);
    },
    edithandleCtrl(row) {
      this.$emit('handleeditCtrl', row);
    },
    delhandle(row) {
      this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('handledel', row);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 自定义按钮
    operating(row, num) {
      this.$emit('handleoperating', {
        row: row,
        type: num
      });
    },
    // ctrl自定义按钮
    operatingCtrl(row, num) {
      this.$emit('operatingCtrl', {
        row: row,
        type: num
      });
    },
    // 点击事件触发
    clickHandle(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event);
    },
    // 行点击事件触发
    rowclickHandle(row, event, column) {
      this.$emit('rowClick', row, event, column);
    },
    // 排序事件
    sorthandle({ column, prop, order }) {
      // prop是当前排序的字段名
      this.$emit('sortHandle', prop, order);
    },
    // hover单元格事件
    cellMouseEnter(row, column, cell, event) {
      if (this.tbset.canHover) {
        this.$emit('cellMouseEnter', row, column, cell, event);
      } else {
        return false;
      }
    },
    // 离开单元格事件
    leaveHandle(row, column, cell, event) {
      if (this.tbset.canHover) {
        this.$emit('leaveHandle', row, column, cell, event);
      } else {
        return false;
      }
    },
    handleSelect(selection, row) {
      this.tbset.selection &&
        this.$emit('selectHandle', {
          selection,
          row
        });
    },
    handleSelectall(selection) {
      this.tbset.selection && this.$emit('selectallHandle', { selection });
    },
    // 表格选中处理
    handleSelectionChange(val) {
      this.tbset.selection && this.$emit('selectChange', val);
    },
    // 表格中单选组的处理
    emitRadio(labelval) {
      this.$emit('radiogroupHandle', labelval);
    },
    changeSwitch(...arg) {
      this.$emit('switchHandle', { e: arg[0], data: arg[1] });
    },
    openMessage() {
      this.$message({
        message: '数据加载完成',
        center: true,
        type: 'success', // success/warning/info/error
        duration: 2000 // 默认3000ms关闭
      });
    },
    // switch阻止点击
    stopProgation() {
      return false;
    },
    // 单元格双击
    cellDblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event);
    },
    // 行右键
    rowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event);
    },
    // 表头右键
    headerContextmenu(column, event) {
      this.$emit('headerContextmenu', column, event);
    },
    // 行双击
    rowDblclick(row, column, event) {
      this.$emit('rowDblClick', row, column, event);
    },
    // 表头点击
    headerClick(column, event) {
      this.$emit('headerClick', column, event);
    },
    tableBodyScroll(vm, e) {
      this.$emit("scroll", vm, e);
    },
    mouseEnter(e) {
      this.$emit("mouseEnter", e);
    },
    // 单选行
    handleCurrentChange(row) {
      if (this.tbset.highlight) {
        this.$emit("currentChange", row);
      }
    }
  },
  mounted() {
    this.$previewRefresh();
  },
  watch: {
    expendRowKeys: {
      handler: function (nv, ov) {
        this.expendRowKey = nv;
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.small {
  font-size: 10px;
  color: #999;
}
.photo {
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  img {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
