<!--
 * @Description:
 * @LastEditors: HL
 * @LastEditTime: 2020-03-30 15:15:12
 -->
<template>

  <div>
    <el-button type="primary"
               @click="open">打开</el-button>
    <columns-dialog ref="columnsDia"
                    :defaultProp="param.columnDefaultProp"
                    :defaultProps="param.columnsDefaultProps"
                    :dragable="true"
                    :canSearch="true"
                    :columns="param.columns"
                    @sure="sureColumns"></columns-dialog>
  </div>
</template>
<script>
import ColumnsDialog from "@/components/columns/v4/index";
export default {
  data() {
    return {
      param: {
        columnDefaultProp: {
          key: 'name',
          label: 'displayName'
        },
        columnsDefaultProps: {
          key: 'name',
          label: 'displayName',
          children: "list",
          must: "required",
          hidden: 'hide',
          initChecked: "selected",
          columnsType: "columnsName"
        },
        columns: [
          {
            name: "系统指标",
            list: [
              {
                "displayName": "维度",
                "list": [
                  {
                    "displayName": "设置数据",
                    "list": [
                      {
                        "name": "thirdAccountName",
                        "displayName": "账户名称",
                        "required": true,
                        "selected": true,
                        "hide": false,
                        "fixed": "left",
                        "align": "left",
                        "width": "200px",
                        "third": false
                      },
                      {
                        "name": "accountAlias",
                        "displayName": "账户别名",
                        "required": false,
                        // "selected": true,
                        "hide": false,
                        "align": "left",
                        "third": false
                      },
                      {
                        "name": "thirdAccountId",
                        "displayName": "账户ID",
                        // "required": false,
                        // "selected": true,
                        "hide": false,
                        "align": "left",
                        "width": "150px",
                        "third": false
                      },
                      {
                        "name": "productName",
                        "displayName": "产品名称",
                        "required": false,
                        // "selected": false,
                        "hide": false,
                        "align": "left",
                        "third": false
                      },
                      {
                        "name": "product_property",
                        "displayName": "产品属性",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "width": "80px",
                        "third": false
                      },
                      {
                        "name": "first_industry_name",
                        "displayName": "一级行业",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "third": false
                      },
                      {
                        "name": "second_industry_name",
                        "displayName": "二级行业",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "width": "80px",
                        "third": false
                      },
                      {
                        "name": "department_name",
                        "displayName": "部门",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "width": "100px",
                        "third": false
                      },
                      {
                        "name": "leader_name",
                        "displayName": "优化组长",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "width": "80px",
                        "third": false
                      },
                      {
                        "name": "operatorName",
                        "displayName": "优化师",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "third": false
                      },
                      {
                        "name": "businessName",
                        "displayName": "商务",
                        "required": false,
                        "selected": false,
                        "hide": false,
                        "align": "left",
                        "third": false
                      }
                    ]
                  }
                ]
              },
              {
                "displayName": "指标",
                "list": [
                  {
                    "displayName": "展示数据",
                    "list": [
                      {
                        "name": "clickCount",
                        "displayName": "点击量",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "showCount",
                        "displayName": "展现量",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "ctr",
                        "displayName": "点击率",
                        "sortable": false,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "cpc",
                        "displayName": "点击单价",
                        "sortable": false,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "cpm",
                        "displayName": "千次展现均价",
                        "sortable": false,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "cost",
                        "displayName": "花费",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "cash_cost",
                        "displayName": "现金花费",
                        "sortable": false,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "reward_cost",
                        "displayName": "赠款花费",
                        "sortable": false,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  },
                  {
                    "displayName": "转化数据",
                    "list": [
                      {
                        "name": "convert_cost",
                        "displayName": "转化成本",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "convert_rate",
                        "displayName": "转化率",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "convert_count",
                        "displayName": "转化数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  },
                  {
                    "displayName": "应用下载广告数据",
                    "list": [
                      {
                        "name": "app_download_finish",
                        "displayName": "安卓下载完成",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_active",
                        "displayName": "激活",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "next_day_open_rate",
                        "displayName": "次留率",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "next_day_open_cost",
                        "displayName": "次留成本",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_click_install",
                        "displayName": "点击安装数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_download_start",
                        "displayName": "安卓下载开始",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_in_app_cart",
                        "displayName": "加入购物车",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_in_app_detail_uv",
                        "displayName": "详情页到站uv",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_in_app_order",
                        "displayName": "提交订单",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_in_app_pay",
                        "displayName": "付费",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_in_app_uv",
                        "displayName": "到达uv",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_install_finish",
                        "displayName": "安卓安装完成",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_pay_count",
                        "displayName": "付费数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "app_register",
                        "displayName": "注册",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "next_day_open",
                        "displayName": "次留数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  },
                  {
                    "displayName": "落地页及门店数据",
                    "list": [
                      {
                        "name": "web_button",
                        "displayName": "按钮button",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_wechat",
                        "displayName": "微信",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_view",
                        "displayName": "关键页面浏览",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_consult",
                        "displayName": "在线咨询",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_consult_effective",
                        "displayName": "智能电话有效咨询",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_form",
                        "displayName": "表单提交",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_lottery",
                        "displayName": "抽奖",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_map_search",
                        "displayName": "地图搜索",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_phone",
                        "displayName": "电话拨打数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_phone_confirm",
                        "displayName": "智能电话确认拨打",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_phone_connect",
                        "displayName": "智能电话确认接通",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_qq",
                        "displayName": "QQ咨询数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_redirect",
                        "displayName": "页面跳转",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_shopping",
                        "displayName": "商品购买",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "web_vote",
                        "displayName": "投票",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  },
                  {
                    "displayName": "附加创意",
                    "list": [
                      {
                        "name": "advanced_creative_counsel_click",
                        "displayName": "在线咨询",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "advanced_creative_form_click",
                        "displayName": "表单提交",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "advanced_creative_phone_click",
                        "displayName": "电话按钮",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  },
                  {
                    "displayName": "视频数据",
                    "list": [
                      {
                        "name": "video_play_25_feed_break",
                        "displayName": "播放25%进度总数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_valid_play",
                        "displayName": "有效播放数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_total_play",
                        "displayName": "播放数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_play_100_feed_break",
                        "displayName": "播放100%进度总数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_play_75_feed_break",
                        "displayName": "播放75%进度总数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_play_50_feed_break",
                        "displayName": "播放50%进度总数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_wifi_play",
                        "displayName": "wifi播放数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "video_play_duration_sum",
                        "displayName": "平均单次播放时长(秒)",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  },
                  {
                    "displayName": "互动数据",
                    "list": [
                      {
                        "name": "interact_share",
                        "displayName": "分享数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_per_cost",
                        "displayName": "单次互动成本",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_music_click",
                        "displayName": "音乐查看数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_like",
                        "displayName": "点赞数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_home_visited",
                        "displayName": "主页访问量",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_follow",
                        "displayName": "关注数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_comment",
                        "displayName": "评论数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      },
                      {
                        "name": "interact_challenge_click",
                        "displayName": "挑战赛查看数",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": false
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "三方指标",
            list: [
              {
                "displayName": "自定义维度",
                "list": [
                  {
                    "displayName": "设置数据",
                    "list": [
                      {
                        "name": "dimension_001",
                        "displayName": "三方渠道",
                        "required": true,
                        "selected": true,
                        "hide": false,
                        "align": "left",
                        "width": "200px",
                        "third": true
                      }
                    ]
                  }
                ]
              },
              {
                "displayName": "自定义指标",
                "list": [
                  {
                    "displayName": "展示数据",
                    "list": [
                      {
                        "name": "counter_001",
                        "displayName": "总线索",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "120px",
                        "third": true
                      },
                      {
                        "name": "counter002",
                        "displayName": "空搜线索",
                        "sortable": true,
                        "selected": false,
                        "align": "right",
                        "width": "200px",
                        "third": true
                      }
                    ]
                  }
                ]
              }
            ]
          }

        ]
      }
    };
  },
  methods: {
    // 自定义列的确认
    sureColumns(columns) {
      console.log(columns)
    },
    open() {
      this.$refs.columnsDia.openDialog();
    }
  },
  components: {
    ColumnsDialog
  },
};
</script>
<style scoped lang="less">
</style>
