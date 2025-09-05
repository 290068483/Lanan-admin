<template>
  <div class="complete-pending-events-example">
    <h2>完整的待处理事件表格示例</h2>

    <!-- 按钮切换区域 -->
    <div class="tab-buttons">
      <el-button
        v-for="tab in tabs"
        :key="tab.key"
        :type="activeTab === tab.key ? 'primary' : 'default'"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </el-button>
    </div>

    <!-- 表格区域 -->
    <PendingEventsTable
      :title="currentTabInfo.title"
      :table-data="currentTableData"
      :table-type="activeTab"
      :default-sort="{ prop: 'id', order: 'descending' }"
      @sort-change="handleSortChange"
      :table-style="{ minHeight: '300px' }"
    >
      <!-- 默认插槽 - 当没有使用特定插槽时显示 -->
      <template #default>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
      </template>

      <!-- 今日待办插槽 -->
      <template #today-events="{ data }">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="taskName"
          label="任务名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="assignee"
          label="负责人"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="deadline"
          label="截止时间"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          width="80"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
      </template>

      <!-- 未读信息插槽 -->
      <template #unread-messages="{ data }">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="消息标题"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="sender"
          label="发送人"
          width="100"
        ></el-table-column>
        <el-table-column prop="time" label="时间" width="160"></el-table-column>
        <el-table-column prop="type" label="类型" width="100"></el-table-column>
      </template>

      <!-- 未完工客户单插槽 -->
      <template #unfinished-customers="{ data }">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="orderNumber"
          label="订单编号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="amount" label="金额" width="100" align="right">
          <template #default="scope"> ¥{{ scope.row.amount }} </template>
        </el-table-column>
        <el-table-column
          prop="deadline"
          label="交付时间"
          width="120"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getCustomerOrderTagType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
      </template>

      <!-- 未完工任务单插槽 -->
      <template #unfinished-tasks="{ data }">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="taskCode"
          label="任务编号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="taskName"
          label="任务名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="projectName"
          label="所属项目"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="assignee"
          label="负责人"
          width="100"
        ></el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" :show-text="false" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getTaskOrderTagType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
      </template>

      <!-- 表格头部操作区域 -->
      <template #header-actions>
        <el-button type="primary" size="small" @click="handleRefresh"
          >刷新</el-button
        >
        <el-button type="success" size="small" @click="handleExport"
          >导出</el-button
        >
      </template>

      <!-- 表格底部操作区域 -->
      <template #footer>
        <div class="table-pagination">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>
    </PendingEventsTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PendingEventsTable from './PendingEventsTable.vue'

// 当前激活的标签页
const activeTab = ref('today')

// 标签页配置
const tabs = ref([
  { key: 'today', label: '今日待办' },
  { key: 'messages', label: '未读信息' },
  { key: 'customers', label: '未完工客户单' },
  { key: 'tasks', label: '未完工任务单' },
])

// 当前标签页信息
const currentTabInfo = computed(() => {
  return tabs.value.find(tab => tab.key === activeTab.value) || tabs.value[0]
})

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 今日待办数据
const todayData = ref([
  {
    id: 1,
    taskName: '完成项目报告',
    assignee: '张三',
    deadline: '2023-06-10',
    priority: '高',
    status: '进行中',
  },
  {
    id: 2,
    taskName: '代码审查',
    assignee: '李四',
    deadline: '2023-06-08',
    priority: '中',
    status: '待处理',
  },
  {
    id: 3,
    taskName: '需求分析',
    assignee: '王五',
    deadline: '2023-06-12',
    priority: '低',
    status: '已完成',
  },
  {
    id: 4,
    taskName: '测试用例编写',
    assignee: '赵六',
    deadline: '2023-06-09',
    priority: '高',
    status: '进行中',
  },
])

// 未读信息数据
const messagesData = ref([
  {
    id: 1,
    title: '系统维护通知',
    sender: '系统管理员',
    time: '2023-06-01 09:00',
    type: '系统通知',
  },
  {
    id: 2,
    title: '项目进度更新',
    sender: '项目经理',
    time: '2023-06-01 10:30',
    type: '项目通知',
  },
  {
    id: 3,
    title: '新功能上线',
    sender: '产品经理',
    time: '2023-06-01 14:15',
    type: '产品通知',
  },
  {
    id: 4,
    title: '团队建设活动',
    sender: '人事部',
    time: '2023-06-01 16:00',
    type: '活动通知',
  },
])

// 未完工客户单数据
const customersData = ref([
  {
    id: 1,
    orderNumber: 'ORD20230601001',
    customerName: 'ABC公司',
    amount: 50000,
    deadline: '2023-06-15',
    status: '生产中',
  },
  {
    id: 2,
    orderNumber: 'ORD20230601002',
    customerName: 'XYZ集团',
    amount: 30000,
    deadline: '2023-06-20',
    status: '待生产',
  },
  {
    id: 3,
    orderNumber: 'ORD20230601003',
    customerName: 'DEF企业',
    amount: 80000,
    deadline: '2023-06-10',
    status: '已完成',
  },
])

// 未完工任务单数据
const tasksData = ref([
  {
    id: 1,
    taskCode: 'TSK20230601001',
    taskName: '前端页面开发',
    projectName: '电商平台',
    assignee: '张三',
    progress: 60,
    status: '进行中',
  },
  {
    id: 2,
    taskCode: 'TSK20230601002',
    taskName: '后端接口开发',
    projectName: '电商平台',
    assignee: '李四',
    progress: 30,
    status: '待处理',
  },
  {
    id: 3,
    taskCode: 'TSK20230601003',
    taskName: '数据库设计',
    projectName: '管理系统',
    assignee: '王五',
    progress: 90,
    status: '测试中',
  },
])

// 当前表格数据
const currentTableData = computed(() => {
  switch (activeTab.value) {
    case 'today':
      return todayData.value
    case 'messages':
      return messagesData.value
    case 'customers':
      return customersData.value
    case 'tasks':
      return tasksData.value
    default:
      return todayData.value
  }
})

// 切换标签页
function switchTab(tabKey) {
  activeTab.value = tabKey
  // 重置分页
  pagination.value.currentPage = 1
  pagination.value.total = currentTableData.value.length
}

// 处理排序变化
function handleSortChange(column) {
  console.log('排序字段:', column)
}

// 处理刷新
function handleRefresh() {
  console.log('刷新数据')
  // 模拟刷新数据
  switch (activeTab.value) {
    case 'today':
      todayData.value = [...todayData.value]
      break
    case 'messages':
      messagesData.value = [...messagesData.value]
      break
    case 'customers':
      customersData.value = [...customersData.value]
      break
    case 'tasks':
      tasksData.value = [...tasksData.value]
      break
  }
}

// 处理导出
function handleExport() {
  console.log('导出数据')
  // 模拟导出数据
  alert(`导出${currentTabInfo.value.label}数据`)
}

// 处理分页大小变化
function handleSizeChange(size) {
  pagination.value.pageSize = size
  console.log('分页大小变化:', size)
}

// 处理当前页变化
function handleCurrentChange(page) {
  pagination.value.currentPage = page
  console.log('当前页变化:', page)
}

// 获取状态标签类型
function getTagType(status) {
  const statusMap = {
    待处理: 'info',
    进行中: 'warning',
    已完成: 'success',
    已取消: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取客户订单状态标签类型
function getCustomerOrderTagType(status) {
  const statusMap = {
    待生产: 'info',
    生产中: 'warning',
    已完成: 'success',
    已取消: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取任务单状态标签类型
function getTaskOrderTagType(status) {
  const statusMap = {
    待处理: 'info',
    进行中: 'warning',
    测试中: '',
    已完成: 'success',
    已取消: 'danger',
  }
  return statusMap[status] || 'info'
}

// 初始化分页总数
pagination.value.total = currentTableData.value.length
</script>

<style scoped>
.complete-pending-events-example {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.complete-pending-events-example h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.tab-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab-buttons .el-button {
  flex: 1;
  min-width: 120px;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

@media (max-width: 768px) {
  .tab-buttons {
    flex-direction: column;
  }

  .tab-buttons .el-button {
    width: 100%;
  }
}
</style>
