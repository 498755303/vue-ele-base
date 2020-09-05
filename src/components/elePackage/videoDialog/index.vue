<template>
  <div class="video-dialog">
    <el-dialog :visible.sync="visible"
               top="2vh"
               width="50%"
               :show-close="true"
               @close="closeDialog">
      <div class="dialog-inner"
           :style="dialogSet.style"
           @contextmenu="stopRightClick">
        <video-player class="video-player-box"
                      ref="videoPlayer"
                      :options="playerOptions"
                      :playsinline="true"
                      customEventName="customstatechangedeventname"
                      v-on="$listeners">
        </video-player>
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
export default {
  data() {
    return {
      visible: false,
      playerOptions: {
        autoplay: true,
        controls: true,
        // videojs options
        muted: false, // 默认情况下将会消除任何音频
        language: "zh-CN",
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        aspectRatio: "16:9",
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        nativeControlsForTouch: true,
        // width: document.documentElement.clientWidth,
        sources: [
          {
            type: "video/mp4",
            src: ""
          }
        ],
        poster: "", // 你的封面地址
        controlBar: {
          PlayToggle: {
            replay: true
          },
          CurrentTimeDisplay: true,
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    };
  },
  props: {
    dialogSet: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    //   打开对话框
    openDialog(opt) {
      console.log(opt);
      this.playerOptions.sources = [
        {
          type: "video/mp4",
          src: opt.src
        }
      ];
      this.playerOptions.poster =
        opt.capture;
      this.visible = true;
      document.querySelector("body").style.overflow = "hidden";
    },
    // 阻止右键菜单
    stopRightClick(e) {
      e.preventDefault();
    },
    // 关闭对话框
    closeDialog() {
      this.player.pause();
      this.visible = false;
      document.querySelector("body").style.overflow = "auto";
    }
  },
  components: {
    videoPlayer
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
@{deep} .video-js {
  max-width: 100%;
  max-height: 80vh;
}
@{deep} .vjs-big-play-button {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
