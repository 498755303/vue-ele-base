<template>
  <div class="cropper-dialog">
    <el-dialog title="图片裁切"
               :visible.sync="visible"
               top="2vh"
               width="60%"
               @opened="_generateRate"
               :show-close="true">
      <div :class="'cropper-content-wrap '+ wrapClass">
        <vueCropper ref="cropper"
                    v-if="visible"
                    :img="imgUrl"
                    :outputSize="options.outputSize"
                    :outputType="options.outputType"
                    :info="options.info"
                    :canScale="options.canScale"
                    :autoCrop="options.autoCrop"
                    :autoCropWidth="options.autoCropWidth"
                    :autoCropHeight="options.autoCropHeight"
                    :fixed="options.fixed"
                    :fixedNumber="options.fixedNumber"
                    :full="options.full"
                    :fixedBox="options.fixedBox"
                    :canMove="options.canMove"
                    :canMoveBox="options.canMoveBox"
                    :original="options.original"
                    :centerBox="options.centerBox"
                    :high="options.high"
                    :infoTrue="options.infoTrue"
                    :maxImgSize="options.maxImgSize"
                    :mode="options.mode"
                    :enlarge="options.enlarge"
                    v-on="$listeners"></vueCropper>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="_handleCancel">取 消</el-button>
        <el-button type="primary"
                   @click="_handleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { VueCropper } from '@/components/vue-cropper';

export default {
  props: {
    wrapClass: {
      type: String
    },
    // 返回类型
    outputType: {
      type: String,
      default: "base64",
      validator: function (value) {
        return [
          'file',
          'blob',
          'base64'
        ].indexOf(value) !== -1;
      }
    },
    // 返回为文件类型时的参数
    fileOption: {}
  },
  data() {
    return {
      visible: false,
      imgUrl: "",
      resultOpt: {},
      options: {
        infoTrue: true
      },
      index: 0// 裁切索引,非必要
    };
  },
  methods: {
    openDialog(o) {
      this.imgUrl = o.imgUrl;
      this.resultOpt = o.resultSize;
      this.options = o.options;
      this.index = o.index;
      this.visible = true;
    },
    // blob转file
    _blob2File(blob, fileParam) {
      return new File([blob], fileParam.name, {
        type: fileParam.type,
        lastModified: fileParam.lastModified
      });
    },
    // 取消处理
    _handleCancel() {
      this.visible = false;
    },
    // 根据原图尺寸计算生成尺寸
    _generateRate() {
      let rate;
      if (this.resultOpt.key === "width") {
        rate = this.resultOpt.value / this.$refs.cropper.cropW;
      } else {
        rate = this.resultOpt.value / this.$refs.cropper.cropH;
      }
      console.log(this.resultOpt, this.$refs.cropper.cropW, this.$refs.cropper.cropH, rate);
      this.$set(this.options, "enlarge", rate);
    },
    // 确定处理
    _handleSure() {
      this.$nextTick(() => {
        switch (this.outputType) {
        case "file":
          this.$refs.cropper.getCropBlob((data) => {
            let fileObj = this._blob2File(data, this.fileOption);
            this.$emit("cropSuccess", fileObj, this.index);
          });
          break;
        case "blob":
          // 获取截图的blob数据
          this.$refs.cropper.getCropBlob((data) => {
            this.$emit("cropSuccess", data, this.index);
          });
          break;
        case "base64":
          this.$refs.cropper.getCropData((data) => {
            this.$emit("cropSuccess", data, this.index);
          });
          break;
        default:
          break;
        }
        this.visible = false;
      });
    }
  },
  components: {
    VueCropper
  }
};
</script>
<style lang="less" scoped>
@baseClass: cropper-content-wrap;
.@{baseClass} {
  width: 500px;
  height: 500px;
}
</style>
