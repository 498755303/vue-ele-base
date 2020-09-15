<template>
  <div class="demo">
    <casder-view :data="auths"
                 ref="authRef"
                 :props="defaultProps"
                 :settings="settings"
                 :checkedLevel="checkedLevel"
                 :zipLevel="zipLevel"
                 :showIndeterminate="true"
                 :showSelect="true"
                 :selectSetting="selectSetting"
                 @result-change="resultChange"></casder-view>
  </div>
</template>
<script>
import casderView from '@/components/cascaderPanel/v2_horizontal/cascaderPanel/index.js';

export default {
  name: "demo",
  data() {
    return {
      auths: [
        {
          "name": "首页",
          "list": [
            {
              "name": "仪表盘",
              "list": [
                {
                  "authId": 1,
                  "name": "首页-仪表盘-查看",
                  "shortName": "查看"
                }
              ]
            },
            {
              "name": "账户总览",
              "list": [
                {
                  "authId": 2,
                  "name": "首页-账户总览-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 3,
                  "name": "首页-账户总览-修改",
                  "shortName": "修改"
                }
              ]
            }
          ]
        },
        {
          "name": "推广",
          "list": [
            {
              "name": "推广",
              "list": [
                {
                  "authId": 4,
                  "name": "推广-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 5,
                  "name": "推广-新建广告",
                  "shortName": "新建广告"
                },
                {
                  "authId": 6,
                  "name": "推广-修改广告",
                  "shortName": "修改广告"
                },
                {
                  "authId": 7,
                  "name": "推广-删除广告",
                  "shortName": "删除广告"
                }
              ]
            }
          ]
        },
        {
          "name": "报表",
          "list": [
            {
              "name": "账户报表",
              "list": [
                {
                  "authId": 8,
                  "name": "报表-账户报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 9,
                  "name": "报表-账户报表-下载",
                  "shortName": "下载"
                }
              ]
            },
            {
              "name": "策略报表",
              "list": [
                {
                  "authId": 11,
                  "name": "报表-策略报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 12,
                  "name": "报表-策略报表-下载",
                  "shortName": "下载"
                }
              ]
            },
            {
              "name": "广告报表",
              "list": [
                {
                  "authId": 14,
                  "name": "报表-广告报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 15,
                  "name": "报表-广告报表-下载",
                  "shortName": "下载"
                }
              ]
            },
            {
              "name": "创意报表",
              "list": [
                {
                  "authId": 17,
                  "name": "报表-创意报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 18,
                  "name": "报表-创意报表-下载",
                  "shortName": "下载"
                }
              ]
            },
            {
              "name": "渠道报表",
              "list": [
                {
                  "authId": 20,
                  "name": "报表-渠道报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 21,
                  "name": "报表-渠道报表-下载",
                  "shortName": "下载"
                }
              ]
            },
            {
              "name": "优化师报表",
              "list": [
                {
                  "authId": 23,
                  "name": "报表-优化师报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 24,
                  "name": "报表-优化师报表-下载",
                  "shortName": "下载"
                },
                {
                  "authId": 25,
                  "name": "报表-优化师报表-部门数据",
                  "shortName": "部门数据"
                }
              ]
            },
            {
              "name": "设计师报表",
              "list": [
                {
                  "authId": 27,
                  "name": "报表-设计报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 28,
                  "name": "报表-设计报表-下载",
                  "shortName": "下载"
                },
                {
                  "authId": 29,
                  "name": "报表-设计报表-部门数据",
                  "shortName": "部门数据"
                }
              ]
            },
            {
              "name": "素材报表",
              "list": [
                {
                  "authId": 31,
                  "name": "报表-素材报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 32,
                  "name": "报表-素材报表-下载",
                  "shortName": "下载"
                },
                {
                  "authId": 33,
                  "name": "报表-素材报表-部门数据",
                  "shortName": "部门数据"
                }
              ]
            },
            {
              "name": "财务报表",
              "list": [
                {
                  "authId": 35,
                  "name": "报表-财务报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 36,
                  "name": "报表-财务报表-下载",
                  "shortName": "下载"
                }
              ]
            }
          ]
        },
        {
          "name": "素材",
          "list": [
            {
              "name": "素材库",
              "list": [
                {
                  "authId": 40,
                  "name": "素材-素材库-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 41,
                  "name": "素材-素材库-查看全部（谨慎）",
                  "shortName": "查看全部（谨慎）"
                },
                {
                  "authId": 42,
                  "name": "素材-素材库-上传素材",
                  "shortName": "上传素材"
                },
                {
                  "authId": 43,
                  "name": "素材-素材库-删除素材",
                  "shortName": "删除素材"
                },
                {
                  "authId": 44,
                  "name": "素材-素材库-下载水印素材",
                  "shortName": "下载水印素材"
                },
                {
                  "authId": 45,
                  "name": "素材-素材库-下载原始素材",
                  "shortName": "下载原始素材"
                },
                {
                  "authId": 46,
                  "name": "素材-素材库-分享",
                  "shortName": "分享"
                },
                {
                  "authId": 47,
                  "name": "素材-素材库-推送",
                  "shortName": "推送"
                },
                {
                  "authId": 48,
                  "name": "素材-素材库-标签管理",
                  "shortName": "标签管理"
                },
                {
                  "authId": 78,
                  "name": "素材-素材库-编辑素材",
                  "shortName": "编辑素材"
                },
                {
                  "authId": 81,
                  "name": "素材-素材库-创建文件夹",
                  "shortName": "创建文件夹"
                },
                {
                  "authId": 82,
                  "name": "素材-素材库-编辑文件夹",
                  "shortName": "编辑文件夹"
                },
                {
                  "authId": 83,
                  "name": "素材-素材库-删除文件夹",
                  "shortName": "删除文件夹"
                }
              ]
            },
            {
              "name": "素材认领",
              "list": [
                {
                  "authId": 49,
                  "name": "报表-素材认领-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 50,
                  "name": "报表-素材认领-提交认领",
                  "shortName": "提交认领"
                }
              ]
            }
          ]
        },
        {
          "name": "工具",
          "list": [
            {
              "name": "定向包",
              "list": [
                {
                  "authId": 51,
                  "name": "工具-定向包-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 52,
                  "name": "工具-定向包-创建",
                  "shortName": "创建"
                },
                {
                  "authId": 53,
                  "name": "工具-定向包-编辑",
                  "shortName": "编辑"
                },
                {
                  "authId": 54,
                  "name": "工具-定向包-删除",
                  "shortName": "删除"
                }
              ]
            },
            {
              "name": "操作日志",
              "list": [
                {
                  "authId": 55,
                  "name": "工具-操作日志-查看",
                  "shortName": "查看"
                }
              ]
            },
            {
              "name": "自动发送",
              "list": [
                {
                  "authId": 56,
                  "name": "工具-自动报表-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 57,
                  "name": "工具-自动报表-创建",
                  "shortName": "创建"
                },
                {
                  "authId": 58,
                  "name": "工具-自动报表-编辑",
                  "shortName": "编辑"
                },
                {
                  "authId": 59,
                  "name": "工具-自动报表-删除",
                  "shortName": "删除"
                }
              ]
            }
          ]
        },
        {
          "name": "账户管理",
          "list": [
            {
              "name": "账户信息管理",
              "list": [
                {
                  "authId": 60,
                  "name": "账户管理-账户信息-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 61,
                  "name": "账户管理-账户信息-新增",
                  "shortName": "新增"
                },
                {
                  "authId": 62,
                  "name": "账户管理-账户信息-编辑",
                  "shortName": "编辑"
                },
                {
                  "authId": 63,
                  "name": "账户管理-账户信息-删除",
                  "shortName": "删除"
                },
                {
                  "authId": 64,
                  "name": "账户管理-账户信息-分配广告主（已分配）",
                  "shortName": "分配广告主（已分配）"
                },
                {
                  "authId": 65,
                  "name": "账户管理-账户信息-分配广告主（未分配）",
                  "shortName": "分配广告主（未分配）"
                },
                {
                  "authId": 84,
                  "name": "账户管理-账户信息-查看所有账户（谨慎）",
                  "shortName": "查看所有账户（谨慎）"
                }
              ]
            },
            {
              "name": "公司员工管理",
              "list": [
                {
                  "authId": 66,
                  "name": "账户管理-员工管理-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 67,
                  "name": "账户管理-员工管理-新增",
                  "shortName": "新增"
                },
                {
                  "authId": 68,
                  "name": "账户管理-员工管理-编辑",
                  "shortName": "编辑"
                },
                {
                  "authId": 69,
                  "name": "账户管理-员工管理-删除",
                  "shortName": "删除"
                }
              ]
            },
            {
              "name": "部门管理",
              "list": [
                {
                  "authId": 70,
                  "name": "账户管理-部门管理-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 71,
                  "name": "账户管理-部门管理-新增",
                  "shortName": "新增"
                },
                {
                  "authId": 72,
                  "name": "账户管理-部门管理-编辑",
                  "shortName": "编辑"
                },
                {
                  "authId": 73,
                  "name": "账户管理-部门管理-删除",
                  "shortName": "删除"
                }
              ]
            },
            {
              "name": "产品管理",
              "list": [
                {
                  "authId": 74,
                  "name": "账户管理-产品管理-查看",
                  "shortName": "查看"
                },
                {
                  "authId": 75,
                  "name": "账户管理-产品管理-新增",
                  "shortName": "新增"
                },
                {
                  "authId": 76,
                  "name": "账户管理-产品管理-编辑",
                  "shortName": "编辑"
                },
                {
                  "authId": 77,
                  "name": "账户管理-产品管理-删除",
                  "shortName": "删除"
                }
              ]
            }
          ]
        },
        {
          "name": "通用",
          "list": [
            {
              "name": "数据权限",
              "list": [
                {
                  "authId": 79,
                  "name": "通用-数据权限-全部广告数据（谨慎）",
                  "shortName": "全部广告数据（谨慎）"
                },
                {
                  "authId": 80,
                  "name": "通用-数据权限-全部素材数据（谨慎）",
                  "shortName": "全部素材数据（谨慎）"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        key: 'authId',
        label: 'shortName',
        labelSpare: "name",
        children: 'list'
      },
      settings: [
        {
          level: 1, // 列的级别，因为组件内部有一个虚拟的根节点，所以level从1开始
          title: '模块', // 列的标题
          hasAllCheck: true, // 是否展示全选checkbox
          showCheckBox: true // 是否带有checkbox
        },
        {
          level: 2,
          title: '子模块及功能',
          hasAllCheck: true,
          showCheckBox: true
        },
        {
          level: 3,
          title: '',
          hasAllCheck: true,
          showCheckBox: true
        }
      ],
      selectSetting: {
        label: 'name',
        key: 'id',
        returnType: "id",
        disabledKey: "disabled",
        onlyRead: false,
        placeholder: "请输入权限名称"
      },
      checkedLevel: 3,
      zipLevel: 3
    };
  },
  methods: {
    resultChange(v) {
      console.log(v)
    }

  },
  components: {
    casderView
  }
};
</script>
<style scoped lang="less">
</style>
