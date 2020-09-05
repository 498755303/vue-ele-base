# vue-ele-ts-base说明











## 项目启动及发布见package.json

### 发布sentry的操作
#### sentry 对应stage,创建指令如下:
sentry-cli releases -o orgName -p projectName new staging@stagingName
#### sentry 相关需要清理老版本文件,指令如下:
sentry-cli 先删除 release 中的文件
sentry-cli releases -o orgName -p projectName files staging@stagingName delete --all


...
##### git提交代码请按照提交规范，否则无法提交
```
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
```

## 项目结构
### 根目录 包含各种配置文件
* env环境文件: .env.deploy 测试发布版本 .env.test 测试环境 
* gitHook lint文件 .commitlintrc
* lint配置文件 
* sentry配置文件
* setting.json vscode格式化文件
### 项目文件结构见 tree.md
* 生成项目文件结构 src目录下
```
treee -L 3 -I "node_modules|.idea|objects|.git" -a --dirs-first > tree1.md
```

## 常见问题
##### 
git rm --cached \*\*
##### 自动发布提示无权限:
chmod -R 777 /project-dir


