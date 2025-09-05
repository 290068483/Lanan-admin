<template>
  <div class="pending-events-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <div class="header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        :style="{ width: '100%', ...tableStyle }"
        :stripe="stripe"
        :border="border"
        :default-sort="defaultSort"
        @sort-change="handleSortChange"
        @table-click="handleClick"
        class="data-table"
        v-bind="$attrs"
      >
        <!-- 默认插槽，用于自定义基础表格列 -->
        <slot></slot>

        <!-- 今日待办插槽 -->
        <template v-if="tableType === 'pending-events'">
          <slot name="today-events" :data="tableData"></slot>
        </template>

        <!-- 未读信息插槽 -->
        <template v-else-if="tableType === 'messages'">
          <slot name="unread-messages" :data="tableData"></slot>
        </template>

        <!-- 未完工客户单插槽 -->
        <template v-else-if="tableType === 'customers'">
          <slot name="unfinished-customers" :data="tableData"></slot>
        </template>

        <!-- 未完工任务单插槽 -->
        <template v-else-if="tableType === 'tasks'">
          <slot name="unfinished-tasks" :data="tableData"></slot>
        </template>
      </el-table>
    </div>

    <!-- 表格底部操作区域 -->
    <div class="table-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'

// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: '所有待处理事项',
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  tableType: {
    type: String,
    default: 'default', // default, today, messages, customers, tasks
  },
  defaultSort: {
    type: Object,
    default: () => ({ prop: 'id', order: 'descending' }),
  },
  stripe: {
    type: Boolean,
    default: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
  tableStyle: {
    type: Object,
    default: () => ({}),
  },
})

// 定义事件
const emit = defineEmits(['sort-change'])

// 使用attrs透传属性
const attrs = useAttrs()

// 处理排序变化
function handleSortChange(column) {
  emit('sort-change', column)
}

// 表格的点击事件
function handleClick(row) {
  emit('table-click', row)
}
</script>

<style scoped>
.pending-events-table {
  background-color: white;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.pending-events-table:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.table-header {
  background-color: #dbeafe;
  padding: 8px 16px;
  border-bottom: 1px solid #bfdbfe;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
}

.table-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>
