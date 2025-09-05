<template>
  <div class="home-container">
    <!-- 网络错误提示 -->
    <div v-if="hasNetworkError" class="network-warning">
      <div class="warning-content">
        <i class="el-icon-warning warning-icon"></i>
        <p class="warning-text">
          🔍 网络连接不稳定，部分数据可能不是最新的，但页面功能正常
        </p>
      </div>
    </div>

    <!-- 主要内容 (确保内容始终显示) -->
    <div class="main-content">
      <!-- 用户信息和欢迎区域 -->
      <div class="user-info-area">
        <el-row
          :gutter="20"
          justify="center"
          align="middle"
          style="width: 100%"
        >
          <el-col :md="4" :sm="24">
            <div class="user-details">
              <div class="user-avatar">
                <img
                  :src="userStore.avatar || '/default-avatar.png'"
                  alt="用户头像"
                />
              </div>
              <div class="user-text">
                <div class="user-info-grid">
                  <div class="info-label">姓名：</div>
                  <div class="info-value">{{ userStore.name }}</div>
                </div>
                <div class="user-info-grid">
                  <div class="info-label">部门：</div>
                  <div class="info-value">
                    {{ userStore.user?.dept?.deptName || '未设置' }}
                  </div>
                </div>
                <div class="user-info-grid">
                  <div class="info-label">职位：</div>
                  <div class="info-value">
                    {{ userStore.postNames?.join(', ') || '未设置' }}
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="16" :sm="24">
            <div class="welcome-section">
              <h1 class="welcome-title">欢迎进入九素工作台</h1>
              <div class="date-info">
                <p class="date-text">
                  {{ getDate }} <span class="time-text">{{ getTime }}</span>
                </p>
                <p class="lunar-text">{{ getLunarDate }} {{ getWeekday }}</p>
              </div>
            </div>
          </el-col>
          <el-col :sm="24" :md="4" class="last-col-right">
            <div class="todo-reminder" @click="handleTodoReminderClick">
              <i class="el-icon-time reminder-icon"></i>
              请及时录入工作进度
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 部门信息展示区域 -->
      <div class="dept-info-area" v-if="deptList.length > 0">
        <el-card class="dept-info-card">
          <template #header>
            <div class="clearfix">
              <span>{{ userStore?.user?.deptName }}</span>
            </div>
          </template>
          <div class="dept-tree">
            <el-tree
              :data="deptList"
              :props="deptProps"
              node-key="deptId"
              default-expand-all
              :expand-on-click-node="false"
            />
          </div>
        </el-card>
      </div>

      <!-- 通知和待办区域 -->
      <div class="notification-area">
        <el-carousel
          :interval="4000"
          type="card"
          height="130px"
          class="notification-carousel"
        >
          <el-carousel-item
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item-container"
          >
            <div class="notification-item" :class="notification.type">
              <i class="notification-icon" :class="notification.iconColor"></i>
              <div class="notification-content">
                <p class="notification-title">
                  <span class="title-bold">{{ notification.title }}：</span>
                  <span class="content-text">{{ notification.content }}</span>
                </p>
                <p class="notification-time">
                  {{ notification.time }}
                </p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 快捷信息区域 -->
      <div class="quick-info">
        <div
          v-for="(card, index) in quickInfoCards"
          :key="index"
          class="info-card"
          :class="card.bgColor"
          @click="handleCardClick(card, index)"
        >
          <i class="el-icon-document card-icon"></i>
          <h3 class="card-title">
            {{ card.title }}<span class="card-unit">{{ card.count }}条</span>
          </h3>
          <div class="card-count">{{ card.count }}</div>
        </div>
        <div class="button-container">
          <el-button type="primary" size="medium" @click="handleButtonClick"
            >录入新进度</el-button
          >
        </div>
      </div>

      <div class="data-tables">
        <div class="table-container">
          <!-- 表格区域 -->
          <PendingEventsTable
            :title="currentTabTitle[activeTab]"
            :table-data="currentTableData"
            :table-type="activeTab"
            :default-sort="{ prop: 'id', order: 'descending' }"
            @sort-change="handleSortChange"
            :table-style="{ minHeight: '300px' }"
            @table-click="CurHandleClick"
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
              <el-table-column
                prop="description"
                label="描述"
              ></el-table-column>
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
              <el-table-column
                prop="time"
                label="时间"
                width="160"
              ></el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                width="100"
              ></el-table-column>
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
                  <el-progress
                    :percentage="scope.row.progress"
                    :show-text="false"
                  />
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
      </div>

      <!-- 今日待处理事件详情模态框 -->
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
          <el-table-column
            prop="eventId"
            label="ID"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="eventType"
            label="类型"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="eventContent"
            label="内容"
            :width="300"
            align="left"
          ></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间"
            width="160"
            align="center"
          ></el-table-column>
        </el-table>
      </CommonDialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { ElMessage, ElDialog } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { parseTime } from '@/utils/ruoyi'
import PendingEventsTable from '@/components/PendingEventsTable.vue'
import CommonDialog from '@/components/CommonDialog.vue'
// 导入API
import { listUnreadMessages } from '@/api/message'
import { listUnfinishedCustomerOrders } from '@/api/unfinishedCustomerOrder'
import { listUnfinishedTaskOrders } from '@/api/unfinishedTaskOrder'

// 组件状态管理
const hasNetworkError = ref(false)
const notifications = ref([
  {
    id: 1,
    title: '系统通知',
    content: '请注意，系统将在今晚进行维护',
    time: '2023-06-01 09:30',
    type: 'notification-info',
    iconColor: 'icon-info',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 2,
    title: '任务提醒',
    content: '您有一个任务即将到期',
    time: '2023-06-01 10:15',
    type: 'notification-warning',
    iconColor: 'icon-warning',
    iconPath:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
])

// 部门信息相关
const deptList = ref([])
const deptProps = ref({
  children: 'children',
  label: 'deptName',
  value: 'deptId',
})
// 表格当前的插槽名字
const activeTab = ref('')
// 表格数据
const currentTableData = reactive([])
const currentTabTitle = reactive({
  'pending-events': '今日待处理事件',
  'messages': '未读消息',
  'customers': '未完工客户单',
  'tasks': '未完工任务单',
})
// 当前类型
const currentType = {
  0: 'pending-events', // 待处理
  1: 'messages', // 已支付
  2: 'customers', // 已发货
  3: 'tasks', // 已送达
}
// 初始化状态管理实例
const userStore = useUserStore()

// 模态框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('今日待处理事件详情')
const dialogTableData = ref([])

// 在组件挂载时获取岗位信息和代办任务信息
onMounted(() => {
  // 获取岗位信息
  userStore
    .getPostInfo()
    .then(() => {
      console.log('岗位信息获取成功')
    })
    .catch(error => {
      console.error('获取岗位信息失败:', error)
    })

  // 获取代办任务信息
  const query = {
    userId: userStore.id, // 添加用户ID参数
    status: '0', // 默认查询待处理状态的事件
    pageNum: 1,
    pageSize: 10,
  }
  userStore
    .getPendingEvents(query)
    .then(res => {
      console.log('代办任务信息获取成功')
      // 更新表格数据
      data1.value.data = userStore.pendingEvents.list || []
      // 更新快捷信息卡片中的待处理事件条数
      quickInfoCards.value[0].count = userStore.pendingEvents.total || 0
    })
    .catch(error => {
      console.error('获取代办任务信息失败:', error)
    })
})
function CurHandleClick(row, index) {
  console.log('表格插槽名字:', activeTab.value, '行数据:', row, '索引:', index)
  
  // 根据当前激活的表格类型处理不同的详情展示
  switch(activeTab.value) {
    case 'pending-events':
      // 今日待办详情
      dialogTitle.value = '今日待处理事件详情'
      // 确保数据结构与表格列匹配
      dialogTableData.value = userStore.pendingEvents?.list.map(item => ({
        eventId: item.id || '',
        eventType: item.taskName || '',
        eventContent: item.description || '',
        status: item.status || '',
        createTime: item.deadline || '',
      })) || []
      dialogVisible.value = true
      break
      
    case 'messages':
      // 未读消息详情
      dialogTitle.value = '未读消息详情'
      // 这里需要根据实际的消息数据结构来映射
      dialogTableData.value = [{
        eventId: row.id || '',
        eventType: row.type || '',
        eventContent: row.title || '',
        status: row.status || '',
        createTime: row.time || '',
      }]
      dialogVisible.value = true
      break
      
    case 'customers':
      // 未完工客户单详情
      dialogTitle.value = '未完工客户单详情'
      // 这里需要根据实际的客户单数据结构来映射
      dialogTableData.value = [{
        eventId: row.id || '',
        eventType: '客户单',
        eventContent: row.customerName || '',
        status: row.status || '',
        createTime: row.deadline || '',
      }]
      dialogVisible.value = true
      break
      
    case 'tasks':
      // 未完工任务单详情
      dialogTitle.value = '未完工任务单详情'
      // 这里需要根据实际的任务单数据结构来映射
      dialogTableData.value = [{
        eventId: row.id || '',
        eventType: '任务单',
        eventContent: row.taskName || '',
        status: row.status || '',
        createTime: row.projectName || '',
      }]
      dialogVisible.value = true
      break
      
    default:
      // 默认处理
      dialogTitle.value = '详情信息'
      dialogTableData.value = [{
        eventId: row.id || '',
        eventType: '',
        eventContent: row.name || row.title || '',
        status: row.status || '',
        createTime: '',
      }]
      dialogVisible.value = true
  }
}
// 设置表格插槽的数据
function setTableData(index, data) {
  // 设置当前 名字
  activeTab.value = currentType[index]
  //设置当前 插槽数据
  currentTableData.splice(0, currentTableData.length, ...(data || []))
}
// 处理排序变化
function handleSortChange(column) {
  console.log('排序字段:', column)
}
function handleCardClick(row, index) {
  console.log('点击了快捷信息卡片', row, index)
  
  // 根据点击的卡片索引设置对应的表格数据
  switch(index) {
    case 0:
      // 今日待处理事件
      setTableData(index, userStore.pendingEvents.list)
      break
    case 1:
      // 未读消息 - 调用API获取数据
      getUnreadMessages().then(data => {
        setTableData(index, data)
        // 更新快捷信息卡片中的未读消息条数
        quickInfoCards.value[1].count = data.length || 0
      })
      break
    case 2:
      // 未完工客户单 - 调用API获取数据
      getUnfinishedCustomerOrders().then(data => {
        setTableData(index, data)
        // 更新快捷信息卡片中的未完工客户单条数
        quickInfoCards.value[2].count = data.length || 0
      })
      break
    case 3:
      // 未完工任务单 - 调用API获取数据
      getUnfinishedTaskOrders().then(data => {
        setTableData(index, data)
        // 更新快捷信息卡片中的未完工任务单条数
        quickInfoCards.value[3].count = data.length || 0
      })
      break
    default:
      setTableData(0, userStore.pendingEvents.list)
  }
}

// 模态框关闭处理
function handleDialogClose() {
  dialogTableData.value = []
}

// 计算属性：日期、时间、农历、星期（使用parseTime生成）
const getDate = computed(() => parseTime(new Date(), '{y}-{m}-{d}'))
const getLunarDate = computed(() => '农历日期')
const getWeekday = computed(() => parseTime(new Date(), '星期{a}'))
const getTime = computed(() => parseTime(new Date(), '{h}:{i}:{s}'))

// 表格数据
const data1 = ref({
  title: '本人待处理的所有事项',
  data: [
    { id: 1, name: '示例任务1', count: '任务描述1', details: '2023-03-24' },
    { id: 2, name: '示例任务2', count: '任务描述2', details: '详细信息' },
  ],
})

const data2 = ref({
  title: '与本人关联的所有事项',
  data: [
    { id: 1, name: '关联任务1', count: '关联描述1', details: '2023-03-24' },
    { id: 2, name: '关联任务2', count: '关联描述2', details: '详细信息' },
  ],
})

// 快捷信息卡片数据
const quickInfoCards = ref([
  { bgColor: 'card-blue', count: 0, title: '今日待处理事件' },
  { bgColor: 'card-green', count: 0, title: '未读消息' },
  { bgColor: 'card-yellow', count: 0, title: '未完工客户单' },
  { bgColor: 'card-yellow', count: 0, title: '未完工任务单' },
])

// 处理按钮点击事件
const handleButtonClick = () => {
  ElMessage.info('录入新进度功能待实现')
}

// 处理待办提醒点击事件
const handleTodoReminderClick = () => {
  ElMessage.info('请及时录入工作进度')
}

// 表格排序处理
const sortBy = column => {
  console.log('排序字段:', column)
}

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 处理分页大小变化
function handleSizeChange(size) {
  pagination.value.pageSize = size
  console.log('分页大小变化:', size)
  // 这里可以添加重新加载数据的逻辑
}

// 处理当前页变化
function handleCurrentChange(page) {
  pagination.value.currentPage = page
  console.log('当前页变化:', page)
  // 这里可以添加重新加载数据的逻辑
}

// 处理刷新
function handleRefresh() {
  console.log('刷新数据')
  // 模拟刷新数据
  // 这里可以添加重新加载数据的逻辑
}

// 处理导出
function handleExport() {
  console.log('导出数据')
  // 模拟导出数据
  alert('导出数据功能待实现')
}

// 模态框确认处理
function handleDialogConfirm() {
  dialogVisible.value = false
}

// 模态框取消处理
function handleDialogCancel() {
  dialogTableData.value = []
}

// 获取未读消息列表
function getUnreadMessages() {
  const query = {
    pageNum: 1,
    pageSize: 10,
  }
  return listUnreadMessages(query).then(res => {
    return res.rows || []
  }).catch(error => {
    console.error('获取未读消息失败:', error)
    return []
  })
}

// 获取未完工客户单列表
function getUnfinishedCustomerOrders() {
  const query = {
    pageNum: 1,
    pageSize: 10,
  }
  return listUnfinishedCustomerOrders(query).then(res => {
    return res.rows || []
  }).catch(error => {
    console.error('获取未完工客户单失败:', error)
    return []
  })
}

// 获取未完工任务单列表
function getUnfinishedTaskOrders() {
  const query = {
    pageNum: 1,
    pageSize: 10,
  }
  return listUnfinishedTaskOrders(query).then(res => {
    return res.rows || []
  }).catch(error => {
    console.error('获取未完工任务单失败:', error)
    return []
  })
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
</script>

<style scoped>
.home-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
  width: 100%;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial,
    sans-serif;
}

.network-warning {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 12px;
  margin-bottom: 16px;
}

.warning-content {
  display: flex;
  align-items: center;
}

.warning-icon {
  color: #f59e0b;
  margin-right: 8px;
  font-size: 20px;
}
.last-col-right {
  flex: 1;
  margin-left: auto !important;
}
.warning-text {
  color: #92400e;
  font-size: 14px;
  margin: 0;
}

.main-content {
  width: 100%;
  padding: 16px;
}

.user-info-area {
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to right, #dbeafe, #f9fafb);
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.user-details {
  min-width: 300px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  width: 100%;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  background-color: #f3f4f6;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 4px;
}

.info-label {
  font-weight: 500;
}

.welcome-section {
  flex-grow: 1;
  text-align: right;
}

.welcome-title {
  color: #2563eb;
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-align: center;
}

.date-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding-right: 80px;
}

.date-text {
  color: #6b7280;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.time-text {
  color: #dc2626;
}

.lunar-text {
  color: #9ca3af;
  font-size: 12px;
  margin: 0;
}

.todo-reminder {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 4px 12px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: right;
}

.todo-reminder:hover {
  text-decoration: underline;
}

.reminder-icon {
  margin-right: 4px;
  font-size: 16px;
}

.notification-area {
  background-color: white;
  border-top: 1px solid #f3f4f6;
  padding: 8px 16px;
}

.notification-carousel {
  height: 130px;
}

.notification-item {
  border-radius: 6px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  height: 100%;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  width: 100%;
  border: 1px solid #e5e7eb;
}

.notification-item:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 20px;
}

.icon-info {
  color: #3b82f6;
}

.icon-warning {
  color: #f59e0b;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  color: #374151;
  font-size: 12px;
  margin: 0;
}

.title-bold {
  font-weight: 600;
}

.content-text {
  /* 内容文本样式 */
}

.notification-time {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

.quick-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  border-radius: 8px;
  padding: 16px 0;
}

.info-card {
  background-color: #1f2937;
  border-radius: 2px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  transform: translateY(0);
  padding: 16px;
}

.info-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-blue {
  background-color: #3b82f6;
}

.card-green {
  background-color: #10b981;
}

.card-yellow {
  background-color: #f59e0b;
}

.card-icon {
  color: white;
  font-size: 20px;
}

.card-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-title {
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 0 8px;
  position: relative;
}

.card-unit {
  color: #fecaca;
  padding-left: 8px;
}

.button-container {
  display: flex;
  align-items: center;
}

.data-tables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.table-container:hover {
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
  text-align: center;
  flex: 1;
  margin: 0;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
}

@media (max-width: 1024px) {
  .data-tables {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .user-details {
    min-width: 100%;
  }

  .welcome-section {
    text-align: center;
    margin-top: 16px;
  }

  .date-info {
    flex-direction: column;
    gap: 8px;
    padding-right: 0 !important;
  }

  .quick-info {
    justify-content: center;
  }
}

.dept-info-area {
  margin: 16px 0;
}

.dept-info-card {
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.dept-tree {
  padding: 16px 0;
}

.clearfix {
  font-weight: 600;
  color: #374151;
}
</style>
</template>

<script setup>
</script>