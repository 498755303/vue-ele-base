/*
 * @Description: 增加git提交规范
 * @LastEditors: HL
 * @LastEditTime: 2020-05-08 00:04:14
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（feature）
        'fix', // Solves a bug. 修复bug
        'docs', // Adds or alters documentation. 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
        'style', // Improves formatting, white-space. 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
        'refactor', // Rewrites code without feature, performance or bug changes. 代码重构，没有加新功能或者修复bug
        'perf', // Improves performance. 优化相关，比如提升性能、体验
        'test', // Adds or modifies tests. 测试用例，包括单元测试、集成测试等
        'chore', // Other changes that don't modify src or test files. 改变构建流程、或者增加依赖库、工具等
        'revert', // Reverts a previous commit. 回滚到上一个版本
        'build', // 构建
        'ci' // ci
      ]
    ],
    'subject-empty':[0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72]
  }
}
