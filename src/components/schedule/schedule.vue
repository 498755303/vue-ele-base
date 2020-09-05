<template>
  <div class="schedule">
    <div class="schedule-container">
      <div class="schedule-header row">
        <div class="head-total">星期/时间</div>
        <div class="head-time">
          <div class="time-total row">
            <p class="border-right">上午(00:00-12:00)</p>
            <p>下午(12:00-24:00)</p>
          </div>
          <ol class="time-part row">
            <li v-for="(n,index) in 24"
                :key="index">{{n-1}}</li>
          </ol>
        </div>
      </div>
      <div class="schedule-body row">
        <ol class="schedule-body-week">
          <li v-for="(item,index) in weekArr"
              :key="index">星期{{item}}</li>
        </ol>
        <div class="schedule-body-time row">
          <div class="time-pos"
               ref="time"
               @mousemove.capture="timemove($event)"
               @mouseleave.stop="timeleave">
            <div class="time-mask"
                 ref="timemask"
                 v-show="maskshow"
                 :style="{left:maskPos.left,top:maskPos.top,width:maskPos.width,height:maskPos.height}"></div>
            <p class="time-tip"
               :style="{left:timeInfoPos.left,top:timeInfoPos.top}"
               v-html="timeInfo"
               v-show="timeTipShow"></p>
            <!-- <p id="lineX" :style="{top:timeInfoPos.top}"></p>
            <p id="lineY" :style="{left:timeInfoPos.left}"></p> -->
            <div class="row time-section"
                 ref="timeSection">
              <li v-for="(item,index) in scheduleTime"
                  :key="index"
                  :class="item==1?'selected':''"
                  :data-index="index"
                  :data-item="item"
                  @click.stop="change(item,index)"
                  @mousemove.prevent.stop.self="move(item,index,$event)"
                  @mouseenter.prevent.stop="enter(item,index)"
                  @mousedown.prevent.stop="down(item,index,$event)"
                  @mouseup.prevent.stop="up(item,index,$event)"
                  @mouseleave.prevent.stop="timeout()"></li>
            </div>
          </div>
        </div>
      </div>
      <div class="schedule-info"
           v-if="showSelected">
        <div class="row schedule-info-tip">
          <p v-if="scheduleTime==clearData">可拖动鼠标选择时间段</p>
          <p v-else>已选择时间段</p>
          <el-button type="danger"
                     @click="clear"
                     size="small">清空所有选择</el-button>
        </div>
        <ol class="info-ul">
          <template v-for="(item,index) in selected">
            <li class="info-li"
                :key="index"
                v-if="item.length">
              <span class="info-li-week">星期{{weekArr[index]}}</span>
              <span class="info-li-time"
                    v-for="(v,i) in item"
                    :key="i">{{v.start}}--{{v.end}}</span>
            </li>
          </template>

        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekArr: ['一', '二', '三', '四', '五', '六', '日'],
      cacheTime: {}, // 一开始 准备每一个单元小格子 对应的信息  （状态 ，起始时间）
      selectTime: {}, // 选中时间 (未处理完)
      selected: {}, // 最后显示选中时间 格式： {星期：[{start:开始时间，end:结束时间}，{start:开始时间，end:结束时间}]}
      timeInfo: '', // 鼠标悬浮 显示当前时间信息
      timeTipShow: false, // 是否显示鼠标悬浮信息
      moving: false, // 鼠标拖动标识符
      pos: {}, // 鼠标拖动 需要改的位置
      posNum: [], // 拖动时 需要改变的值
      timeSection: {},
      startIndex: 0,
      maskshow: false,
      timer: null,
      limit: false, // 边界
      maskPos: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      timeInfoPos: {
        left: 0,
        top: 0
      },
      clearData: '', // 清空的数据值
      scheduleTime: this.originTime
    };
  },
  props: {
    originTime: {
      type: String,
      default:
          '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    },
    showSelected: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    change(item, index) {
      let updateValue = item == 0 ? 1 : 0;
      this.scheduleTime = this.replacePos(
        this.scheduleTime,
        index,
        updateValue
      );
    },
    enter(item, index) {
      let that = this;
      // this.timeout();
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        let weekIndex = ~~(index / 48);
        let separatorIndex = ~~(index % 48);
        let weekName = '星期' + that.weekArr[weekIndex];
        let showInfo = that.cacheTime[weekIndex][separatorIndex];
        that.timeInfo =
            '<span>' +
            weekName +
            '</span><span>' +
            showInfo.startTime +
            '--' +
            showInfo.endTime +
            '</span>';
        that.timeTipShow = true;
      }, 800);
    },
    down(item, index, e) {
      this.limit = false;
      this.maskshow = true;
      this.timeout();
      // 最外层盒子的位置 获取元素的相对位置
      Object.assign(this.$data.maskPos, this.$options.data().maskPos);
      this.timeSection = this.$refs.time;
      this.moving = true; // 移动标识
      this.startIndex = index; // 开始的数值
      this.posNum = []; // 清空要改变的值
      this.pos = {
        start_x: e.pageX - this.offset2(this.timeSection).left,
        start_y: e.pageY - this.offset2(this.timeSection).top,
        li_width: e.target.getBoundingClientRect().width,
        li_height: e.target.getBoundingClientRect().height
      };
      this.maskPos.left = this.pos.start_x + 'px';
      this.maskPos.top = this.pos.start_y + 'px';
    },
    timeout() {
      this.timeTipShow = false;
      this.timeInfo = '';
    },
    timeleave() {
      clearTimeout(this.timer);
      this.timeout();
    },
    timemove(e) {
      this.timeout();
      if (!this.timeSection) {
        this.pos.end_x = e.pageX - this.offset2(this.timeSection).left;
        this.pos.end_y = e.pageY - this.offset2(this.timeSection).top;
      } else {
        this.pos.end_x = e.pageX - this.offset2(this.$refs.time).left;
        this.pos.end_y = e.pageY - this.offset2(this.$refs.time).top;
      }
      this.timeInfoPos.left = this.pos.end_x + 'px';
      this.timeInfoPos.top = this.pos.end_y + 'px';
      if (this.moving) {
        if (this.pos.end_x > this.pos.start_x) {
          this.maskPos.width =
              Math.abs(this.pos.end_x - this.pos.start_x) + 'px';
        }
        if (this.pos.end_y > this.pos.start_y) {
          this.maskPos.height =
              Math.abs(this.pos.end_y - this.pos.start_y) + 'px';
        }
      }
    },
    move(item, index, e) {
      // li move 容易监听不到up  上面层主要解决
      if (this.moving) {
        this.pos.end_x = e.pageX - this.offset2(this.timeSection).left;
        this.pos.end_y = e.pageY - this.offset2(this.timeSection).top;
        if (this.pos.end_x >= this.pos.li_width * 47.7) {
          this.pos.end_x = this.pos.li_width * 48;
          Object.assign(this.$data.maskPos, this.$options.data().maskPos);
          this.moving = false;
          this.up(item, index, e);
          this.limit = true;
        }
        if (this.pos.end_y >= this.pos.li_height * 6.8) {
          this.pos.end_y = this.pos.li_height * 7;
          Object.assign(this.$data.maskPos, this.$options.data().maskPos);
          this.moving = false;
          this.up(item, index, e);
          this.limit = true;
        }
        if (this.pos.end_x > this.pos.start_x) {
          this.maskPos.width =
              Math.abs(this.pos.end_x - this.pos.start_x) + 'px';
        }
        if (this.pos.end_y > this.pos.start_y) {
          this.maskPos.height =
              Math.abs(this.pos.end_y - this.pos.start_y) + 'px';
        }
      }
    },
    up(item, index, e) {
      if (!this.limit) {
        this.limit = false;
        this.maskshow = false;
        Object.assign(this.$data.maskPos, this.$options.data().maskPos);
        this.moving = false;
        // 最后一个值比第一个值大 右下
        var widthLen = (index % 48) - (this.startIndex % 48);
        // var heightLen = ~~(index / 48) - ~~(this.startIndex / 48);
        if (this.startIndex < index) {
          let posIndex = 0;
          for (var i = this.startIndex; i <= this.startIndex + widthLen; i++) {
            this.posNum[posIndex++] = {
              on: this.scheduleTime.substr(i, 1),
              num: i
            };
            for (var j = i; j <= index; j = j + 48) {
              if (j != i) {
                this.posNum[posIndex++] = {
                  on: this.scheduleTime.substr(j, 1),
                  num: j
                };
              }
            }
            for (var z = i; z >= index; z = z - 48) {
              if (z != i) {
                this.posNum[posIndex++] = {
                  on: this.scheduleTime.substr(z, 1),
                  num: z
                };
              }
            }
          }
        }
        // 更改值
        for (var k in this.posNum) {
          this.change(this.posNum[k].on, this.posNum[k].num);
        }
        Object.assign(this.$data.maskPos, this.$options.data().maskPos);
      }
    },
    replacePos(strObj, pos, replacetext) {
      var str = strObj.substr(0, pos) + replacetext + strObj.substring(pos + 1);
      return str;
    },
    // 1为分隔  {星期:[{start:**,end:**},{start:**,end:**}]}
    posCache(scheduleTime) {
      var week = -1; // 初始化 第一个分组
      var startHour;
      var startMin;
      var endHour;
      var endMin;
      var startTime;
      var endTime;
      // 1.按星期 拆分数组7*48  每个单元设置  状态，开始时间，结束时间
      for (var i in scheduleTime) {
        // 7组 7天
        let separator = i % 48;
        if (separator == 0) {
          week++;
          this.cacheTime[week] = this.cacheTime[week] || [];
        }
        // 时间处理 每个时间段对应的起始时间
        if (separator % 2 == 0) {
          startHour = ~~(separator / 2);
          endHour = ~~(separator / 2);
          startMin = '00';
          endMin = '30';
        } else {
          startHour = ~~(separator / 2);
          endHour = ~~(separator / 2) + 1;
          startMin = '30';
          endMin = '00';
        }
        startTime = startHour + ':' + startMin;
        endTime = endHour + ':' + endMin;
        this.cacheTime[week][separator] = {
          on: this.scheduleTime[i],
          startTime: startTime,
          endTime: endTime
        };
      }
    },
    // 2.将连续时间 每天 状态为1，时间连续  数组弄到一块
    selectData() {
      this.selectTime = {};
      for (var i in this.cacheTime) {
        let day = this.cacheTime[i];
        let slot = 0;
        this.selectTime[i] = this.selectTime[i] || [];
        for (var t in day) {
          let timeslot = day[t];
          if (timeslot.on == 1) {
            // 只要是选中1 就继续往里面插入
            this.selectTime[i][slot] = this.selectTime[i][slot] || [];
            this.selectTime[i][slot].push(this.cacheTime[i][t]);
          } else {
            // 不是1  断开
            slot++;
          }
        }
      }
    },
    // 3.再次处理数组 最后返回下边所需格式
    returnData() {
      this.selected = {};
      for (var week in this.selectTime) {
        this.selected[week] = this.selected[week] || [];
        for (var separator in this.selectTime[week]) {
          let len = this.selectTime[week][separator].length - 1;
          this.selected[week].push({
            start: this.selectTime[week][separator][0].startTime,
            end: this.selectTime[week][separator][len].endTime
          });
        }
      }
    },
    clearTime() {
      let tmp = '';
      for (var i = 0; i < 336; i++) {
        tmp += '0';
      }
      return tmp;
    },
    clear() {
      this.scheduleTime = this.clearData;
    },
    returnSelect(timeString, timeJson) {
      return {
        scheduleTime: this.scheduleTime,
        selected: this.selected
      };
    },
    offset2(curEle) {
      var totalLeft = null;
      var totalTop = null;
      var par = curEle.offsetParent;
      // 首先把自己本身的相加
      totalLeft += curEle.offsetLeft;
      totalTop += curEle.offsetTop;
      // 现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
      while (par) {
        if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
          // 不是IE8我们才进行累加父级参照物的边框
          totalTop += par.clientTop;
          totalLeft += par.clientLeft;
        }
        // 把父级参照物的偏移相加
        totalTop += par.offsetTop;
        totalLeft += par.offsetLeft;
        par = par.offsetParent;
      }
      return { left: totalLeft, top: totalTop };
      // 返回一个数组，方便我们使用哦。
    }
  },
  created() {
    this.clearData = this.clearTime();
  },
  watch: {
    scheduleTime: {
      handler(nv, ov) {
        this.posCache(nv);
        this.selectData();
        this.returnData();
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
@border: 1px solid #ddd;
.border-right {
  border-right: @border;
}
.schedule {
  width: 700px;
  justify-content: flex-start !important;
  background-color: #fff;
  .schedule-container {
    border: @border;
    .schedule-header {
      width: 100%;
      justify-content: flex-start !important;
      border-bottom: @border;
      align-items: center;
      text-align: center;
      .head-total {
        flex: 0 0 100px;
      }
      .head-time {
        width: calc(100% - 100px);
        flex: 0 0 1;
        border-left: @border;
        .time-total {
          border-bottom: @border;

          p {
            color: #fff;
            background-color: #5996ff;
            width: 50%;
            line-height: 1.4em;
            border-radius: 0 10px 10px 0;
            &:first-child {
              border-radius: 10px 0 0 10px;
            }
          }
        }
        .time-part {
          li {
            width: calc(100% / 24);
            border-right: @border;
            &:nth-last-of-type(1) {
              border-right: none;
            }
          }
        }
      }
    }
    .schedule-body {
      text-align: center;
      justify-content: flex-start;
      border-bottom: @border;
      .schedule-body-week {
        flex: 0 0 100px;
        width: 100px;
        li {
          background-color: #f6f6f6;
          border-bottom: @border;
          line-height: 29px;
          &:last-child {
            border: none;
          }
        }
      }
      .schedule-body-time {
        width: calc(100% - 100px);
        flex: 0 0 1;
        flex-wrap: wrap;
        flex-direction: flex-start;
        border-left: @border;
        .time-pos {
          position: relative;
          width: 100%;
          .time-mask {
            position: absolute;
            background-color: rgba(9, 228, 27, 0.4);
            transition: all 4ms ease;
          }
          .time-tip {
            position: absolute;
            padding: 0 10px;
            font: 500 13px/1.8em "microsoft-yahei";
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            min-width: 140px;
          }
          #lineX {
            position: absolute;
            left: 0;
            width: 100%;
            border-top: 1px dotted #939393;
            opacity: 0;
          }
          #lineY {
            position: absolute;
            top: 0;
            height: 100%;
            border-left: 1px dotted #939393;
            opacity: 0;
          }
          .time-section {
            width: 100%;
            flex-wrap: wrap;
            flex-direction: flex-start;
            li {
              height: 30px;
              width: calc(100% / 48);
              border-right: @border;
              border-bottom: @border;
              border-radius: 5px;
              &.selected {
                background-color: #82bae3;
              }
            }
          }
        }
      }
    }
    .schedule-info {
      padding: 10px 20px;
      .schedule-info-tip {
        justify-content: space-between !important;
      }
      .info-ul {
        .info-li {
          padding: 2px 0;
          font: 13px/2em "microsoft-yahei";
          .info-li-week {
            width: 80px;
            margin-right: 10px;
          }
          .info-li-time {
            color: #818181;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
