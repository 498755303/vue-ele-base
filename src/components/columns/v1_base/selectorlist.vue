<template>
  <div class="selector-list">
    <el-select v-model="value" size="mini" ref="selector">
      <el-option value="0" label="自定义列" class="selector-select" ref="optionlist" >
        <div class="list">
          <el-tree
            :data="listData"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            @check="getChecked"
            :props="defaultProps"
            class="selector-tree"
            :default-expand-all="defaultExpand"
          ></el-tree>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectData: [], // 选中的值
      value: '0',
      defaultExpand: true
    };
  },
  props: {
    listData: {
      type: Array,
      default: function () {
        return [
          {
            id: 1,
            label: '展现数据',
            children: [
              {
                id: 'cost',
                label: '总花费'
              },
              {
                id: 'showCount',
                label: '展示数'
              },
              {
                id: 'clickCount',
                label: '点击数'
              },
              {
                id: 'clickRate',
                label: '点击率'
              },
              {
                id: 'cpc',
                label: '平均点击单价(元)'
              },
              {
                id: 'ecpm',
                label: '平均千次展现费用(元)'
              }
            ]
          },
          {
            id: 2,
            label: '转化数据',
            children: [
              {
                id: 'convertCount',
                label: '转化数'
              },
              {
                id: 'convertCost',
                label: '转化成本'
              },
              {
                id: 'convertRate',
                label: '转化率'
              }
            ]
          },
          {
            id: 3,
            label: '应用下载广告数据',
            children: [
              {
                id: 'appDownloadStart',
                label: '安卓下载开始数'
              },
              {
                id: 'appDownloadStartCost',
                label: '应用下载开始成本'
              },
              {
                id: 'appDownloadStartRate',
                label: '应用下载开始率'
              },
              {
                id: 'appDownloadFinish',
                label: '应用下载完成数'
              },
              {
                id: 'appDownloadFinishCost',
                label: '应用下载完成成本'
              },
              {
                id: 'appDownloadFinishRate',
                label: '应用下载完成率'
              },
              {
                id: 'appInstallFinish',
                label: '应用下载安装完成数'
              },
              {
                id: 'appInstallFinishCost',
                label: '应用下载安装完成成本'
              },
              {
                id: 'appInstallFinishRate',
                label: '应用下载安装完成率'
              },
              {
                id: 'appActive',
                label: '载激活数'
              },
              {
                id: 'appActiveCost',
                label: '激活成本'
              },
              {
                id: 'messaappActiveRatege',
                label: '激活率'
              },
              {
                id: 'appRegister',
                label: '注册数'
              },
              {
                id: 'appRegisterCost',
                label: '注册成本'
              },
              {
                id: 'appRegisterRate',
                label: '注册率'
              },
              {
                id: 'appPayCount',
                label: '付费数'
              },
              {
                id: 'appPayCountCost',
                label: '付费成本'
              },
              {
                id: 'appPayCountRate',
                label: '付费率'
              },
              {
                id: 'appInAppUv',
                label: '到达uv'
              },
              {
                id: 'appInAppDetailUv',
                label: '详情页到站uv'
              },
              {
                id: 'appInAppCart',
                label: '加入购物车'
              },
              {
                id: 'appInAppOrder',
                label: '提交订单'
              },
              {
                id: 'appInAppPay',
                label: '付费'
              }
            ]
          },
          {
            id: 4,
            label: '落地页转化数据',
            children: [
              {
                id: 'webPhone',
                label: '点击电话按钮'
              },
              {
                id: 'webForm',
                label: '表单提交'
              },
              {
                id: 'webMapSearch',
                label: '地图搜索'
              },
              {
                id: 'webButton',
                label: '按钮button'
              },
              {
                id: 'webView',
                label: '关键页面浏览'
              },
              {
                id: 'webQq',
                label: 'QQ咨询数'
              },
              {
                id: 'webLottery',
                label: '抽奖'
              },
              {
                id: 'webVote',
                label: '投票'
              },
              {
                id: 'webRedirect',
                label: '页面跳转'
              },
              {
                id: 'webShopping',
                label: '商品购买'
              },
              {
                id: 'webConsult',
                label: '在线咨询'
              },
              {
                id: 'webWechat',
                label: '微信'
              },
              {
                id: 'webPhoneConfirm',
                label: '智能电话确认拨打'
              },
              {
                id: 'webPhoneConnect',
                label: '智能电话确认接通'
              },
              {
                id: 'webConsultEffective',
                label: '智能电话有效咨询'
              }
            ]
          },
          {
            id: 6,
            label: '视频数据',
            children: [
              {
                id: 'videoTotalPlay',
                label: '总播放'
              },
              {
                id: 'videoValidPlay',
                label: '有效播放'
              },
              {
                id: 'videoValidPlayRate',
                label: '有效播放率'
              },
              {
                id: 'videoValidPlayCost',
                label: '有效播放成本'
              }
            ]
          },
          {
            id: 7,
            label: '附加创意',
            children: [
              {
                id: 'advancedCreativePhoneClick',
                label: '附加创意电话按钮点击'
              },
              {
                id: 'advancedCreativeCounselClick',
                label: '附加创意在线咨询点击'
              },
              {
                id: 'advancedCreativeFormClick',
                label: '附加创意表单提交点击'
              }
            ]
          },
          {
            id: 8,
            label: '互动数据',
            children: [
              {
                id: 'interactFollow',
                label: '关注数'
              },
              {
                id: 'interactLike',
                label: '点赞数'
              },
              {
                id: 'interactComment',
                label: '评论数'
              },
              {
                id: 'interactShare',
                label: '分享数'
              },
              {
                id: 'interactHomeVisited',
                label: '主页访问量'
              },
              {
                id: 'interactChallengeClick',
                label: '挑战赛查看数'
              },
              {
                id: 'interactMusicClick',
                label: '音乐查看数'
              },
              {
                id: 'interactPerCost',
                label: '单次互动成本'
              }
            ]
          }
        ];
      }
    },
    defaultProps: {
      type: Object,
      default: function () {
        return {
          children: 'children',
          label: 'label'
        };
      }
    }
  },
  methods: {
    // 数据处理
    dataHandler () {
      let tmp = [];
      for (var i in this.listData) {
        if (this.listData[i].children) {
          for (var y in this.listData[i].children) {
            tmp.push(this.listData[i].children[y]);
          }
        }
      }
      return tmp;
    },
    // 初始化自定义列
    setCheckedKeys () {
      let initCheckedData = [
        'cost',
        'showCount',
        'clickCount',
        'cpc',
        'ecpm',
        'campaignBudgetModeTrans',
        'clickRate'
      ];
      this.$refs.tree.setCheckedKeys(initCheckedData);
      this.selectData = initCheckedData;
    },
    getChecked () {
      this.selectData = this.$refs.tree.getCheckedKeys(true); // 获取选中值
    },
    // 选中后 传值给table
    sendData (selectData) {
      let originData = this.dataHandler(); // 需要遍历的数组
      let tableData = []; // 自定义列
      for (var i in originData) {
        let judge = selectData.includes(originData[i].id);
        if (judge) {
          let itemTemp = {
            name: originData[i].label,
            prop: originData[i].id,
            issort: 'custom',
            renderType: 'fitWidth',
            align: 'right'
          };
          tableData.push(itemTemp);
        }
      }
      this.$emit('userlist', tableData);
    }
  },
  mounted () {
    this.setCheckedKeys();
  },
  watch: {
    selectData: {
      handler (nv) {
        this.sendData(nv);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.selector-list {
  width: 100px;
  display: inline-block;
}
.list {
  width: 400px;
  padding: 10px 20px 20px 5px;
  color: #222;
  background-color: #fff;
}
</style>
