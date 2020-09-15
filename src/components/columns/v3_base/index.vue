<template>
  <div class="test">
    <div style="width:300px">
      <search-ipt placeholder="请输入可搜索列名称"
                  size="mini"
                  :data="searchData"
                  :prop="defaultProp"
                  @result-click="resultClick"></search-ipt>
    </div>

    <columns :data="columns"
             ref="test"
             :props="defaultProps"
             :settings="settings"
             :mustColumns="mustColumns"
             :checkedLevel="checkedLevel"
             :zipLevel="zipLevel"
             :isSingle="isSingle"
             :showSelect="showSelect"
             @result-change="resultChange"></columns>

  </div>
</template>
<script>
import searchIpt from '@/components/input/searchinput';
import columns from './cascaderPanel/index';
export default {
  name: "columns-v3",
  data() {
    return {
      searchData: [],
      defaultProp: {
        key: 'id',
        label: 'label'
      },
      mustColumns: [{
        id: 10001,
        key: 'date',
        label: '时间'
      }],
      columns: [
        {
          id: 10000,
          label: '展现数据',
          children: [
            {
              id: 10001,
              key: 'cost',
              label: '总花费',
              subItems: [10002, 10003]
            },
            {
              id: 10002,
              key: 'showCount',
              label: '展示数'

            },
            {
              id: 10003,
              key: 'clickCount',

              label: '点击数'
            },
            {
              id: 10004,
              key: 'clickRate',
              label: '点击率'
            },
            {
              id: 10005,
              key: 'cpc',
              label: '平均点击单价(元)'
            },
            {
              id: 10006,
              key: 'ecpm',
              label: '平均千次展现费用(元)'
            }
          ]
        },
        {
          id: 20000,
          label: '转化数据',
          children: [
            {
              id: 20001,
              key: 'convertCount',
              label: '转化数'
            },
            {
              id: 20002,
              key: 'convertCost',
              label: '转化成本'
            },
            {
              id: 20003,
              key: 'convertRate',
              label: '转化率'
            }
          ]
        },
        {
          id: 30000,
          label: '应用下载广告数据',
          children: [
            {
              id: 30001,
              key: 'appDownloadStart',
              label: '安卓下载开始数'
            },
            {
              id: 30002,
              key: 'appDownloadStartCost',
              label: '应用下载开始成本'
            },
            {
              id: 30003,
              key: 'appDownloadStartRate',
              label: '应用下载开始率'
            },
            {
              id: 30004,
              key: 'appDownloadFinish',
              label: '应用下载完成数'
            },
            {
              id: 30005,
              key: 'appDownloadFinishCost',
              label: '应用下载完成成本'
            },
            {
              id: 30006,
              key: 'appDownloadFinishRate',
              label: '应用下载完成率'
            },
            {
              id: 30007,
              key: 'appInstallFinish',
              label: '应用下载安装完成数'
            },
            {
              id: 30008,
              key: 'appInstallFinishCost',

              label: '应用下载安装完成成本'
            },
            {
              id: 30009,
              key: 'appInstallFinishRate',

              label: '应用下载安装完成率'
            },
            {
              id: 30010,
              key: 'appActive',

              label: '载激活数'
            },
            {
              id: 30011,
              key: 'appActiveCost',

              label: '激活成本'
            },
            {
              id: 30012,
              key: 'messaappActiveRatege',

              label: '激活率'
            }
          ]
        }
      ],
      defaultProps: {
        key: 'id',
        label: 'label',
        children: 'children',
        controlList: 'subItems',
        disabled: 'disabled'
      },
      settings: {
        header: '可添加的列'
      },
      checkedLevel: 3,
      zipLevel: 2,
      isSingle: false,
      showSelect: true
    };
  },
  computed: {
  },
  methods: {
    resultChange(v) {
      console.log(v);
    },
    generateSearchData() {
      if (this.$refs.test) {
        let res = this.$refs.test.getFlattenData(2);
        let dataResult = res.map(val => {
          return val.data;
        });
        this.searchData = dataResult;
      }
    },
    resultClick(row) {
      this.$refs.test.setCheckedNodes([row.data[this.defaultProp.key]]);
    }
  },
  components: {
    columns,
    searchIpt
  },
  mounted() {
    this.generateSearchData();
  }
};
</script>
<style style="less" scoped>
.test {
  width: 800px;
  background-color: #fff;
}
</style>
