<template>
  <div class="home-container">
    <!-- 网络错误提示 -->
    <div v-if="hasNetworkError" class="network-warning">
      <div class="warning-content">
        <i class="el-icon-warning warning-icon"></i>
        <p class="warning-text">🔍 网络连接不稳定，部分数据可能不是最新的，但页面功能正常</p>
      </div>
    </div>

    <!-- 主要内容 (确保内容始终显示) -->
    <div class="main-content">
      <!-- 用户信息和欢迎区域 -->
      <div class="user-info-area">
        <div class="user-details">
          <div class="user-avatar">
            {{ userInfo.avatar ? "" : userInfo.name ? userInfo.name.charAt(0) : "U" }}
          </div>
          <div class="user-text">
            <div class="user-info-grid">
              <div class="info-label">姓名：</div>
              <div class="info-value">{{ userInfo.name }}</div>
            </div>
          </div>
        </div>

        <div class="welcome-section">
          <h1 class="welcome-title">欢迎进入九素工作台</h1>
          <div class="date-info">
            <p class="date-text">
              {{ getDate }} <span class="time-text">{{ getTime }}</span>
            </p>
            <p class="lunar-text">{{ getLunarDate }} {{ getWeekday }}</p>
          </div>
        </div>
        <div class="todo-reminder" @click="handleTodoReminderClick">
          <i class="el-icon-time reminder-icon"></i>
          请及时录入工作进度
        </div>
      </div>

      <!-- 通知和待办区域 -->
      <div class="notification-area">
        <el-carousel :interval="4000" type="card" height="130px" class="notification-carousel">
          <el-carousel-item
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item-container">
            <div
              class="notification-item"
              :class="notification.type">
              <i
                class="notification-icon"
                :class="notification.iconColor"
                ></i>
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
          :class="card.bgColor">
          <i class="el-icon-document card-icon"></i>
          <h3 class="card-title">今日待处理事件<span class="card-unit">条</span></h3>
        </div>
        <div class="button-container">
          <el-button type="primary" size="medium" @click="handleButtonClick">录入新进度</el-button>
        </div>
      </div>

      <!-- 数据表格区域 -->
      <div class="data-tables">
        <!-- 待处理事件表格 -->
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">{{ data1.title || "本人待处理的所有事项" }}</h3>
          </div>
          <!-- 表格 -->
          <div class="table-wrapper">
            <el-table
              :data="data1.data"
              style="width: 100%"
              stripe
              border
              :default-sort="{ prop: 'id', order: 'descending' }"
              @sort-change="sortBy"
              class="data-table">
              <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
              <el-table-column prop="details" label="详情"></el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 与本人关联事项表格 -->
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">{{ data2.title || "与本人关联的所有事项" }}</h3>
          </div>
          <!-- 表格 -->
          <div class="table-wrapper">
            <el-table
              :data="data2.data"
              style="width: 100%"
              stripe
              border
              :default-sort="{ prop: 'id', order: 'descending' }"
              @sort-change="sortBy"
              class="data-table">
              <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
              <el-table-column prop="details" label="详情"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { ElMessage } from "element-plus"
import useUserStore from "@/store/modules/user"
import { parseTime } from "@/utils/ruoyi"

// 组件状态管理
const hasNetworkError = ref(false)
const notifications = ref([
  {
    id: 1,
    title: "系统通知",
    content: "请注意，系统将在今晚进行维护",
    time: "2023-06-01 09:30",
    type: "notification-info",
    iconColor: "icon-info",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    id: 2,
    title: "任务提醒",
    content: "您有一个任务即将到期",
    time: "2023-06-01 10:15",
    type: "notification-warning",
    iconColor: "icon-warning",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  }
])

// 初始化状态管理实例
const userStore = useUserStore()

// 组件挂载后初始化逻辑
onMounted(async () => {
  try {
    // 有Token时尝试获取用户信息，失败则提示网络问题
    if (userStore.token) {
      try {
        await userStore.getInfo()
        console.log("用户信息获取成功:", userStore.$state)
      } catch (error) {
        console.warn("🔍 获取用户信息失败，使用本地数据:", error)
        hasNetworkError.value = true
      }
    }
  } catch (error) {
    console.error("🚨 初始化失败:", error)
    hasNetworkError.value = true
  }
})

// 计算属性：用户信息（从状态管理获取，无数据时显示默认值）
const userInfo = computed(() => {
  const userDetail = userStore.$state
  return {
    name: userDetail.nickName || userDetail.name || "未设置",
    position: "未设置",
    department: "未设置",
    avatar: userDetail.avatar || ""
  }
})

// 计算属性：日期、时间、农历、星期（使用parseTime生成）
const getDate = computed(() => parseTime(new Date(), "{y}-{m}-{d}"))
const getLunarDate = computed(() => "农历日期")
const getWeekday = computed(() => parseTime(new Date(), "星期{a}"))
const getTime = computed(() => parseTime(new Date(), "{h}:{i}:{s}"))

// 表格数据
const data1 = ref({
  title: "本人待处理的所有事项",
  data: [
    { id: 1, name: "示例任务1", count: "任务描述1", details: "2023-03-24" },
    { id: 2, name: "示例任务2", count: "任务描述2", details: "详细信息" }
  ]
})

const data2 = ref({
  title: "与本人关联的所有事项",
  data: [
    { id: 1, name: "关联任务1", count: "关联描述1", details: "2023-03-24" },
    { id: 2, name: "关联任务2", count: "关联描述2", details: "详细信息" }
  ]
})

// 快捷信息卡片数据
const quickInfoCards = ref([
  { bgColor: "card-blue" },
  { bgColor: "card-green" },
  { bgColor: "card-yellow" }
])

// 处理按钮点击事件
const handleButtonClick = () => {
  ElMessage.info("录入新进度功能待实现")
}

// 处理待办提醒点击事件
const handleTodoReminderClick = () => {
  ElMessage.info("请及时录入工作进度")
}

// 表格排序处理
const sortBy = (column) => {
  console.log("排序字段:", column)
}
</script>

<style scoped>
.home-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
  width: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
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
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
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
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #bfdbfe;
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.notification-info {
  /* 信息类通知样式 */
}

.notification-warning {
  /* 警告类通知样式 */
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
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  transform: translateY(0);
  padding: 16px;
}

.info-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
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

.card-title {
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 0 8px;
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
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
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
</style>