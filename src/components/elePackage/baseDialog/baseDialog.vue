<!--
 * @Description: 批量修改基础dialog
 * @LastEditors: HL
 * @LastEditTime: 2020-06-30 17:23:47
-->
<template>
  <el-dialog :visible.sync="visibleDialog"
             v-bind="$attrs"
             v-on="$listeners">
    <slot></slot>
    <template #footer>
      <slot name="footer">
        <span>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary"
                     class="dialog_sure-button"
                     @click="sure">
            {{sureLabel}}
          </el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sureLabel: {
      type: String,
      default: "确 认"
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit("update:visible");
      }
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    sure() {
      this.$emit("confirm");
    }
  }
};
</script>
