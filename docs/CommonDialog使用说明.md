# 全局模态框组件 (CommonDialog) 使用说明

## 简介

CommonDialog 是一个基于 Element Plus 的 `el-dialog` 封装的全局模态框组件，提供了更丰富的配置选项和更便捷的使用方式。

## 安装和注册

组件已在 `main.js` 中全局注册，无需单独引入即可在任何 Vue 组件中使用。

```javascript
// main.js
import CommonDialog from '@/components/CommonDialog'
app.component('CommonDialog', CommonDialog)
```

## 基础用法

```vue
<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">打开模态框</el-button>
    
    <CommonDialog 
      v-model="dialogVisible" 
      title="标题"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <p>模态框内容</p>
    </CommonDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)

const handleConfirm = () => {
  console.log('用户点击了确定')
  // 处理确认逻辑
}

const handleCancel = () => {
  console.log('用户点击了取消')
  // 处理取消逻辑
}
</script>
```

## 属性 (Props)

### 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | Boolean | false | 控制模态框显示/隐藏 |
| title | String | '提示' | 模态框标题 |
| width | String/Number | '500px' | 模态框宽度 |
| fullscreen | Boolean | false | 是否全屏 |
| modal | Boolean | true | 是否需要遮罩层 |
| lockScroll | Boolean | true | 是否在 Dialog 出现时将 body 滚动锁定 |
| showClose | Boolean | true | 是否显示关闭按钮 |

### 行为属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| closeOnClickModal | Boolean | true | 是否可以通过点击 modal 关闭 Dialog |
| closeOnPressEscape | Boolean | true | 是否可以通过按下 ESC 关闭 Dialog |
| center | Boolean | false | 是否对头部和底部居中 |

### 头部图标属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| showHeaderIcon | Boolean | false | 是否显示头部图标 |
| headerIcon | String | 'InfoFilled' | 头部图标名称 |
| headerIconClass | String | 'info' | 头部图标样式类 |
| headerIconSize | String/Number | 20 | 头部图标大小 |

### 底部属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| showFooter | Boolean | true | 是否显示底部 |
| showCancelButton | Boolean | true | 是否显示取消按钮 |
| showConfirmButton | Boolean | true | 是否显示确定按钮 |

### 按钮文本属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| cancelText | String | '取消' | 取消按钮文本 |
| confirmText | String | '确定' | 确定按钮文本 |

### 按钮类型属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| cancelButtonType | String | 'info' | 取消按钮类型 |
| confirmButtonType | String | 'primary' | 确定按钮类型 |

### 按钮大小属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| buttonSize | String | 'default' | 按钮大小 (large / default / small) |

### 按钮状态属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| confirmLoading | Boolean | false | 确定按钮加载状态 |
| cancelLoading | Boolean | false | 取消按钮加载状态 |
| confirmDisabled | Boolean | false | 确定按钮禁用状态 |
| cancelDisabled | Boolean | false | 取消按钮禁用状态 |

### 其他属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| destroyOnClose | Boolean | false | 关闭时销毁 Dialog 中的元素 |
| appendToBody | Boolean | true | Dialog 自身是否插入至 body 元素上 |
| beforeClose | Function | null | 关闭前的回调，会暂停 Dialog 的关闭 |

## 事件 (Events)

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 模态框显示状态改变时触发 | visible (Boolean) |
| open | Dialog 打开的回调 | - |
| opened | Dialog 打开动画结束时的回调 | - |
| close | Dialog 关闭的回调 | - |
| closed | Dialog 关闭动画结束时的回调 | - |
| confirm | 点击确定按钮时触发 | - |
| cancel | 点击取消按钮时触发 | - |

## 插槽 (Slots)

### default

模态框内容区域。

### footer

模态框底部区域，当使用此插槽时，将覆盖默认的底部按钮。

```vue
<CommonDialog v-model="dialogVisible" title="自定义底部">
  <p>内容区域</p>
  <template #footer>
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="success" @click="handleSave">保存</el-button>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </template>
</CommonDialog>
```

## 使用示例

### 1. 基础模态框

```vue
<CommonDialog 
  v-model="visible" 
  title="提示"
  @confirm="handleConfirm"
  @cancel="handleCancel"
>
  <p>这是一段提示信息</p>
</CommonDialog>
```

### 2. 带图标模态框

```vue
<CommonDialog 
  v-model="visible" 
  title="成功"
  show-header-icon
  header-icon="SuccessFilled"
  header-icon-class="success"
  @confirm="handleConfirm"
>
  <p>操作成功！</p>
</CommonDialog>
```

### 3. 自定义底部按钮

```vue
<CommonDialog 
  v-model="visible" 
  title="确认操作"
  :show-footer="false"
>
  <p>确认要执行此操作吗？</p>
  <template #footer>
    <el-button @click="visible = false">放弃</el-button>
    <el-button type="danger" @click="handleDelete">删除</el-button>
  </template>
</CommonDialog>
```

### 4. 加载状态模态框

```vue
<CommonDialog 
  v-model="visible" 
  title="处理中"
  :confirm-loading="loading"
  :confirm-disabled="loading"
  @confirm="handleSubmit"
>
  <p>正在处理您的请求，请稍候...</p>
</CommonDialog>
```

## 在 home.vue 中的使用

在 [home.vue](file:///e:/res/code/ry-vue/lanan/src/views/home.vue) 中，我们使用 CommonDialog 来显示今日待处理事件详情：

```vue
<CommonDialog
  v-model="dialogVisible"
  :title="dialogTitle"
  width="80%"
  :destroy-on-close="true"
  @confirm="handleDialogConfirm"
  @cancel="handleDialogCancel"
>
  <el-table
    :data="dialogTableData"
    style="width: 100%"
    stripe
    border
    max-height="400"
  >
    <!-- 表格列定义 -->
  </el-table>
</CommonDialog>
```

## 注意事项

1. 使用 `v-model` 双向绑定模态框的显示状态
2. 确定和取消按钮的事件处理应在父组件中实现
3. 如需自定义底部按钮，可使用 `footer` 插槽
4. 模态框内容区域可放置任意 HTML 或 Vue 组件
5. 通过 `destroy-on-close` 属性可控制关闭时是否销毁内容