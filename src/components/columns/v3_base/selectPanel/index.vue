<template>
  <div class="cas-select-panel">
    <div class="cas-select-panel__header">
      <div class="cas-select-panel__title">{{ title }}</div>
      <div class="cas-select-panel__clear"
           @click="handleClearAll">清空全部
      </div>
    </div>
    <div class="cas-select-panel__content">
      <template v-for="item in must">
        <div class="cas-select-panel__item"
             :key="item[mustProps.key]"
             v-if="!item[mustProps.hidden]">
          <span class="cas-select-panel__item-text">{{ item[mustProps.label] }}</span>
        </div>
      </template>
      <draggable v-if="dragable"
                 v-model="checkedData"
                 draggable=".cas-select-panel__item"
                 @end="endDrag">
        <transition-group>
          <div class="cas-select-panel__item dragable"
               v-for="item in checkedData"
               :key="item.id">
            <i class="fa fa-bars"></i>
            <span class="cas-select-panel__item-text">{{ item[setting.label] }}</span>
            <span class="cas-select-panel__item-remove"
                  @click="handleRemove(item[setting.key])">x</span>
          </div>
        </transition-group>
      </draggable>
      <div v-else>
        <div class="cas-select-panel__item"
             v-for="item in checkedData"
             :key="item.id">
          <span class="cas-select-panel__item-text">{{ item[setting.label] }}</span>
          <span class="cas-select-panel__item-remove"
                @click="handleRemove(item[setting.key])">x</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  name: 'CasSelectPanel',
  props: {
    data: {
      type: Array
    },
    must: {
      type: Array,
      default: () => {
        return [];
      }
    },
    title: {
      type: String,
      default: '已选'
    },
    mustProps: {
      default: function () {
        return {
          label: 'text',
          key: 'id',
          hidden: "hide"
        };
      }
    },
    setting: {
      default: function () {
        return {
          label: 'text',
          key: 'id'
        };
      }
    },
    dragable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedData: this.data || []
    };
  },
  methods: {
    handleClearAll() {
      this.$emit('clear-all', this.checkedData.map(item => item.id));
    },
    handleRemove(id) {
      this.$emit('remove', id);
    },
    endDrag(evt) {
      this.$emit('update', this.checkedData);
    }
  },
  components: {
    draggable
  },
  watch: {
    data: {
      handler(nv, ov) {
        console.log(nv);
        this.checkedData = nv;
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
@prefix: cas-select-panel;
.@{prefix} {
  background-color: #fff;
  border: 1px solid #dee4f5;
  border-radius: 2px;
}

.@{prefix}__header {
  display: flex;
  justify-content: space-between;
  color: #1c2438;
  letter-spacing: 0;
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  font-size: 14px;
  padding: 0 12px;
  line-height: 36px;
}

.@{prefix}__clear {
  color: blue;
  cursor: pointer;
}

.@{prefix}__content {
  padding: 5px;
  overflow: scroll;
  height: calc(100% - 50px);
}

.@{prefix}__item {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  padding: 5px;
  background: #f8f8f8;
  margin: 5px 0;
  font-size: 14px;

  &.dragable {
    cursor: move;
  }

  i {
    flex: 1;
  }

  .@{prefix}__item-text {
    flex: 8;
  }

  .@{prefix}__item-remove {
    flex: 1;
  }
}

.@{prefix}__item-remove {
  cursor: pointer;
}
</style>
