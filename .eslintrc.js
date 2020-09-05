/*
 * @Description: eslint规则
 * @LastEditors: HL
 * @LastEditTime: 2020-04-26 14:07:07
 */
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],//定义文件继承的子规范
  rules: {
    "no-extend-native": 0,
    "no-control-regex": 0,
    "no-console": process.env.NODE_ENV === "production" ? 2 : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : "off",
    // 禁止修改const声明的变量
    "no-const-assign": 2,
    "max-params": [0, 5], // 函数最多只能有5个参数
    // 禁止 function 定义中出现重名参数
    "no-dupe-args": 2,
    // 禁止对象字面量中出现重复的 key
    "no-dupe-keys": 2,
    // 禁止出现重复的 case 标签
    "no-duplicate-case": 2,
    // 禁止出现空语句块
    "no-empty": 2,
    // 强制 getter 和 setter 在对象中成对出现
    "accessor-pairs": 2,
    // 要求 switch 语句中有 default 分支
    "default-case": 2,
    // 禁止出现空函数
    "no-empty-function": 2,
    // 禁用不必要的标签
    "no-extra-label": 2,
    // 不允许标签与变量同名
    "no-label-var": 2,
    // 禁止将标识符定义为受限的名字
    "no-shadow-restricted-names": 2,
    // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    "no-undef": 2,
    // 禁止出现未使用过的变量
    "no-unused-vars": 2,
    // 强制使用骆驼拼写法命名约定
    camelcase: 0,
    // 禁用不必要的转义字符
    "no-useless-escape": 0,
    // 要求使用 Error 对象作为 Promise 拒绝的原因
    "prefer-promise-reject-errors": 1,
    // 单引号
    quotes: 0,
    // ===代替==关闭
    eqeqeq: 0,
    // 不允许使用逗号表达式
    "no-sequences": 0,
    // 禁止使用 new 以避免产生副作用
    "no-new": 0,
    // 要求构造函数首字母大写
    "new-cap": 0,
    "space-after-function-paren": [0],
    "space-before-function-paren": [0],
    indent: [1, 2],
    semi: [0, "always"],
    "standard/computed-property-even-spacing": [0, "even"],
    "vue/valid-v-on": 0,
    "vue/require-prop-types": "true",
    "vue/require-v-for-key": "error",
    "vue/v-bind-style": ["error", "shorthand"],
    "vue/v-on-style": ["error", "shorthand"],
    "vue/no-side-effects-in-computed-properties": 1,
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }]
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: {
      "legacyDecorators": true
    }
  }
};
