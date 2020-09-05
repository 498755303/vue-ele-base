<template>
  <div class="crop">
    <el-upload class="upload-demo"
               :action="action"
               :limit="1"
               :auto-upload="true"
               :show-file-list="false"
               :file-list="fileList"
               :http-request="upload">
      <el-button type="primary"
                 plain
                 size="mini">本地上传
      </el-button>
    </el-upload>
    <el-button type="primary"
               size="mini"
               @click="openCrop">测试
    </el-button>
    <img :src="imgUrl"
         style="width:100px;height:100px;"
         alt="">
    <crop-dialog ref="cropper"
                 :fileOption="fileOption"
                 outputType="file"
                 wrapClass="crop-content-wrap-self"
                 @cropSuccess="_cropSuccess"></crop-dialog>

  </div>
</template>
<script>
import { upFileCoverToutiao, uploadAdCoverLocal } from "@/api";
import cropDialog from "@/components/elePackage/cropdialog";
import { MaterialInfoUtil } from '@/util/tools/materialInfoUtil.ts';

export default {
  data() {
    return {
      options: {
        autoCropHeight: null,
        canScale: false,
        fixed: true,
        fixedNumber: [9, 16],
        fixedBox: true,
        canMove: false,
        canMoveBox: true,
        original: false,
        autoCrop: true,
        autoCropWidth: "100%",
        centerBox: true,
        mode: "contain",
        outputType: "png",
        enlarge: 5
      },
      action: upFileCoverToutiao,
      fileList: [],
      fileOption: {},
      resSize: {
        key: "width",
        value: 0
      },
      imgUrl: "https://tpc.googlesyndication.com/simgad/17955358767017347840?sqp=4sqPyQQ7QjkqNxABHQAAtEIgASgBMAk4A0DwkwlYAWBfcAKAAQGIAQGdAQAAgD-oAQGwAYCt4gS4AV_FAS2ynT4&rs=AOga4ql7j96pXG8i7q5C_6pUV4DC4Y2EEg",
    };
  },
  methods: {
    async upload(fileData) {
      this.fileOption = fileData.file;
      this.file2Blob(fileData.file).then(res => {
        this.imgUrl = res.src;
        this.options.mode = res.width > res.height ? "500px auto" : "auto 500px";
        this.openCrop();
      });
    },
    file2Blob(file) {
      return new Promise((resolve, reject) => {
        try {
          var reader = new FileReader();
          reader.onloadend = (e) => {
            MaterialInfoUtil.calcWh(e.target.result).then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          };
          reader.readAsDataURL(file);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    },
    openCrop() {
      if (this.options.fixedNumber[0] > this.options.fixedNumber[1]) {
        this.options.autoCropWidth = 500;
        this.options.autoCropHeight = 0;
        if (this.imgInfo.w < 720) {
          this.resSize.key = "width";
          this.resSize.value = this.imgInfo.w;
        } else {
          this.resSize.key = "width";
          this.resSize.value = 720;
        }
      } else {
        this.options.autoCropWidth = 0;
        this.options.autoCropHeight = 500;
        if (this.imgInfo.h < 720) {
          this.resSize.key = "height";
          this.resSize.value = this.imgInfo.h;
        } else {
          this.resSize.key = "height";
          this.resSize.value = 720;
        }
      }

      this.$refs.cropper.openDialog({
        imgUrl: this.imgUrl,
        options: this.options,
        resultSize: this.resSize
      });
    },
    _cropSuccess(data) {      
      this.uploadFile(data)
    },
    uploadFile(file) {
      this.file2Blob(file).then(res => { console.log(res) })
      let formData = new FormData();
      formData.append('thirdAccountId', 94345838310);
      formData.append('uploadedFile', file);
      formData.append('uploadMaterialType', 3);

      uploadAdCoverLocal(formData).then(res => {
        console.log(res)
      })
    }
  },
  components: {
    cropDialog
  },
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .crop-content-wrap-self {
  width: 500px;
  height: 500px;
}
</style>
