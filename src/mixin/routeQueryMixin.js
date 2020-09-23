import { Validate } from '@/util/tools/validate.ts';
import { CopyPropertyUtil } from "@/util/tools/CopyPropertyUtil.ts";
import { ObjectUtil } from "@/util/expand/ObjectUtil.ts";

/**
 * 观察路由变化请求数据或对应处理的mixin,只有query中参数变化才会做对应处理(浅比较)
 * 使用该Mixin注意:所有需要回退监听的参数change事件或查询方法需要对应改为mixFilter2Route
 * 建议仅把需要监听的参数放入query
 * 混入组件所需方法:
 * _route2Form 路由参数解析初始化页面筛选条件方法
 * getAllData 页面获取数据方法 或 路由变更的回调方法
 * 对外提供方法
 * mixFilter2Route: 需要change查询数据的调用方法:push路由
 */
export default {
  methods: {
    // 初始化路由参数
    _mixinQuery() {
      this._route2Form();
    },
    /**
     * 路由参数变更回调
     * 路由query参数是否一致(有变更) y:切换页面dom+请求数据 n:无操作
     * @param nv 新路由
     * @param ov 就路由
     * @private
     */
    _mixinRouteChangeEvent(nv, ov) {
      const hasNvQuery = nv && Validate.isNotEmpty(nv.query);
      const hasOvQuery = ov && Validate.isNotEmpty(ov.query);
      let isEqual = true;
      if (hasNvQuery && hasOvQuery) {
        isEqual = ObjectUtil.equal(nv.query, ov.query);
      } else {
        isEqual = false;
      }
      if (!isEqual) {
        this._mixinQuery();
        this.getAllData();
      }
    },
    /**
     * push路由操作,需要查询的change事件做push路由
     * @param key query对应的key
     * @param value query对应的value
     */
    mixFilter2Route(key, value) {
      const tmp = CopyPropertyUtil.objDeepCopy(this.$route.query);
      tmp[key] = value;
      const isEqual = ObjectUtil.equal(tmp, this.$route.query);
      if (isEqual) {
        this.getAllData(true);
      } else {
        this.$router.push({
          path: this.$route.path,
          query: tmp
        });
      }
    }
  },
  watch: {
    "$route": {
      handler(nv, ov) {
        this._mixinRouteChangeEvent(nv, ov);
      },
      deep: true,
      immediate: true
    }
  }
};
