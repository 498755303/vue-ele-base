<template>
  <div :class="wrapClass"
       @click="closeWrap">
    <div class="bg"></div>
    <div class="self-dialog-wrap">
      <div class="title"></div>
      <div class="left">
        <scroll-img :wrapW="widthP"
                    :wrapH="heightP"
                    :adMaterial="adMaterial"></scroll-img>
      </div>
    </div>
  </div>
</template>
<script>
import scrollImg from '@/components/materialchoose/choose.vue';
export default {
  data () {
    return {
      isShow: false,
      widthP: '200px',
      adMaterial: [
        {
          checked: false,
          url:
              'http://e.hiphotos.baidu.com/image/h%3D300/sign=8000a165df1b0ef473e89e5eedc551a1/b151f8198618367afe76969623738bd4b21ce5fa.jpg'
        },
        {
          checked: false,
          url:
              'http://d.hiphotos.baidu.com/image/h%3D300/sign=e6cb69522534349b6b066885f9eb1521/91ef76c6a7efce1b5ef04082a251f3deb58f659b.jpg'
        },
        {
          checked: false,
          url:
              'http://a.hiphotos.baidu.com/image/h%3D300/sign=a284ee4bc595d143c576e22343f18296/0b7b02087bf40ad182fac5ab5a2c11dfa9ecce58.jpg'
        },
        {
          checked: false,
          url:
              'http://a.hiphotos.baidu.com/image/h%3D300/sign=de08a1f093510fb367197197e932c893/b999a9014c086e062550d0020f087bf40bd1cbfb.jpg'
        }
      ]
    };
  },

  computed: {
    wrapClass: function () {
      return this.isShow ? 'self-dialog open' : 'self-dialog';
    },
    heightP: function () {
      return Number(document.body.offsetHeight) + 'px';
    }
  },
  methods: {
    closeWrap () {
      this.isShow = false;
    }
  },
  components: {
    scrollImg
  }
};
</script>

<style lang="less" scoped>
.self-dialog {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  -ms-touch-action: none;
  touch-action: none;
  z-index: 3000;
  -webkit-text-size-adjust: 100%;
  -webkit-backface-visibility: hidden;
  outline: none;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    will-change: opacity;
    -webkit-transition: opacity 1s ease-in-out;
    transition: opacity 1s ease-in-out;
    // -webkit-transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
    // transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
    * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  &.open {
    display: block;
    position: fixed;
    opacity: 1;
    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #000;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      -webkit-transition: opacity 1s ease-in-out;
      transition: opacity 1s ease-in-out;
      will-change: opacity;
      //   -webkit-transition: none;
      //   transition: none;
      opacity: 1;
      * {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
}
</style>
