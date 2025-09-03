# 测试说明

## 概述

本目录包含了针对代码生成器多子表配置功能的单元测试。

## 测试文件

1. `genInfoForm.test.js` - 针对 [genInfoForm.vue](file:///e:/res/code/ry-vue/lanan/src/views/tool/gen/genInfoForm.vue) 组件的测试
2. `editTable.test.js` - 针对 [editTable.vue](file:///e:/res/code/ry-vue/lanan/src/views/tool/gen/editTable.vue) 组件的测试

## 运行测试

### 安装依赖

在运行测试之前，请确保已安装所有必要的依赖项：

```bash
pnpm install
```

### 运行所有测试

```bash
pnpm test
```

或

```bash
pnpm test:run
```

### 运行测试并生成覆盖率报告

```bash
pnpm test:coverage
```

## 测试内容

### genInfoForm.test.js

该测试文件验证了以下功能：

1. 组件在选择"主子表"模板时正确渲染
2. 添加子表配置功能
3. 删除子表配置功能
4. 子表配置变化时正确更新 [subTableNames](file:///e:/res/code/ry-vue/lanan/RuoYi-Vue/ruoyi-generator/src/main/java/com/ruoyi/generator/domain/GenTable.java#L38-L38) 和 [subTableFkNames](file:///e:/res/code/ry-vue/lanan/RuoYi-Vue/ruoyi-generator/src/main/java/com/ruoyi/generator/domain/GenTable.java#L38-L38) 字段
5. 从 [info](file:///e:/res/code/ry-vue/lanan/src/views/tool/gen/basicInfoForm.vue#L52-L52) 属性正确初始化子表配置
6. 模板类别更改时正确清理子表配置

### editTable.test.js

该测试文件验证了以下功能：

1. 组件挂载时正确获取表数据
2. 当 [subTableNames](file:///e:/res/code/ry-vue/lanan/RuoYi-Vue/ruoyi-generator/src/main/java/com/ruoyi/generator/domain/GenTable.java#L38-L38) 和 [subTableFkNames](file:///e:/res/code/ry-vue/lanan/RuoYi-Vue/ruoyi-generator/src/main/java/com/ruoyi/generator/domain/GenTable.java#L38-L38) 字段不存在时正确初始化
3. 提交表单时正确处理多子表配置
4. 表单验证失败时显示错误消息

## 测试框架

本项目使用以下测试工具：

- [Vitest](https://vitest.dev/) - Vue.js的极速单元测试框架
- [Vue Test Utils](https://test-utils.vuejs.org/) - Vue.js官方测试工具库
- [JSDOM](https://github.com/jsdom/jsdom) - 用于模拟浏览器环境