/** 嵌套表单 校验类
 * 包含动态嵌套表单
 * 使用方法：
 * 1. 最外层需要先new FormControl对象,并传给需要校验的表单
 * 2. 子层created中 register, destroyed 销毁,注意 不同子表单需要注册不同的name相同name 会覆盖
 * 3. 可以通过provide传入子组件表单控制类实例
 * 对外  校验方法  获取表单生成参数方法  初始化方法 对应子表单中 validate(返回promise)  updateParam   initData
 */
export class FormControl {
  components: Object;

  constructor(init: Object = {}) {
    this.components = init;
  }

  // 注册组件
  register(name: string, value: any): void {
    this.components[name] = value;
  }

  // 销毁组件
  remove(name: string): void {
    if (name in this.components) {
      delete this.components[name];
    }
  }

  // 销毁所有组件
  removeAll(): void {
    this.components = {};
  }

  // 校验方法
  validate() {
    return new Promise((resolve, reject) => {
      let validateList = [];
      for (var k in this.components) {
        if (this.components[k].validate) {
          validateList.push(this.components[k].validate());
        }
      }
      Promise.all(validateList)
        .then(item => {
          resolve(item);
        })
        .catch(err => {
          console.log(err)
          reject(new Error(err));
        });
    });
  }

  // 获取参数
  updateParam(name = "") {
    let res = [];
    for (var k in this.components) {
      if (k.indexOf(name) > -1) {
        if (this.components[k].updateParam) {
          let childResult = this.components[k].updateParam();
          res.push(childResult);
        }
      }
    }
    return res;
  }

  // 初始化方法
  initChild(param: Object[], name = "") {
    const componentKeys = Object.keys(this.components).filter(
      v => v.indexOf(name) > -1
    );
    let initDataFn;
    if (param && param.length) {
      param.forEach((item, index) => {
        initDataFn = this.components[componentKeys[index]].initData;
        initDataFn && initDataFn(item);
      });
    } else {
      return false;
    }
  }

  // 重置方法
  resetChild(name = "") {
    const componentKeys = Object.keys(this.components).filter(
      v => v.indexOf(name) > -1
    );

    componentKeys.forEach(key => {
      const resetDataFn = this.components[key].resetData;
      resetDataFn && resetDataFn()
    })
  }
}
