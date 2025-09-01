<template>
  <div class="customer-progress-container">
    <!-- 导航栏 -->
    <div class="header">
      <h2 class="header-title">陆泰-重庆市万科蓝岸三期</h2>
      <div class="header-search">
        <el-input
          v-model="searchText"
          placeholder="搜索..."
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button icon="Search" @click="handleSearch"></el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="order-panel">
      <div class="left-box">
        <div class="left-cell">
          <div>
            <span class="text-gray-700 mr-2">订单日期:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">合同日期:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>

        <div class="left-cell">
          <div>
            <span class="text-gray-700 mr-2">定&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">合同金额:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>
        <div class="left-cell">
          <div>
            <span class="text-gray-700 mr-2">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">备用电话:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>
        <div class="left-cell">
          <div>
            <span class="text-gray-700 mr-2">销售顾问:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">设&nbsp;计&nbsp;&nbsp;师:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="right-cell">
          <div class="">
            <span>区域：</span>
            <span>重庆是冉家坝</span>
          </div>
          <div>
            <span>id:</span>
            <span>123456</span>
          </div>
        </div>
        <div class="right-cell">
          <div class="last-right"><span>地址：</span><span>重庆市冉家坝重庆市冉家坝重庆市冉家坝重庆市冉家坝</span></div>
        </div>
      </div>
    </div>

    <!-- 左右并排的表格布局 -->
    <div class="table-layout">
      <!-- 左侧：进度列表 -->
      <div class="table-container left-table">
        <div class="table-header">
          <h3 class="table-title">进度列表</h3>
          <span class="table-subtitle">详情</span>
        </div>
        <div class="table-wrapper">
          <el-table :data="progressList" class="progress-table">
            <el-table-column prop="date" label="日期" width="120"></el-table-column>
            <el-table-column prop="eventName" label="事件名" width="100"></el-table-column>
            <el-table-column prop="details" label="详情"></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 右侧：待办列表 -->
      <div class="table-container right-table">
        <div class="table-header">
          <h3 class="table-title">待办列表</h3>
        </div>
        <div class="table-wrapper">
          <el-table :data="todoList" class="todo-table">
            <el-table-column prop="todoDate" label="待办日期" width="120"></el-table-column>
            <el-table-column prop="task" label="事项" width="100"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="assignee" label="待办人" width="100"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "CustomerProgress",
  setup() {
    const searchText = ref("");

    // 进度列表数据
    const progressList = ref([
      {
        date: "2019/12/28",
        eventName: "合同",
        details: "合同金额258264元，签合同时客户来现场沟通生产周期问题"
      },
      {
        date: "2019/12/28",
        eventName: "咨询",
        details: "客户沟通确认方案细节，沟通未来订单意向合同办理"
      },
      {
        date: "2019/12/28",
        eventName: "咨询",
        details: "客户咨询定制方案，电话沟通未能解答，需上门复尺"
      },
      {
        date: "2019/12/26",
        eventName: "通知",
        details: "客户通知方案调整，增加门楣尺寸，墙面未刷"
      },
      {
        date: "2019/11/22",
        eventName: "测量",
        details: "客户江门测量尺寸，墙面未刷，不能上门复尺，谭敬江已处理"
      },
      {
        date: "2019/11/05",
        eventName: "咨询",
        details: "客户询问方案细节，电子图发送客户确认"
      },
      {
        date: "2019/11/01",
        eventName: "出图",
        details: "客户确认方案图纸，约定下次测量时间"
      }
    ]);

    // 待办列表数据
    const todoList = ref([
      {
        todoDate: "2019/01/23",
        task: "待合同",
        content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
        assignee: "待办人"
      },
      {
        todoDate: "2019/01/23",
        task: "待咨询",
        content: "客户沟通确认方案细节，沟通未来订单意向合同办理",
        assignee: "待办人"
      },
      {
        todoDate: "2019/01/23",
        task: "待合同",
        content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
        assignee: "待办人"
      },
      {
        todoDate: "2019/01/23",
        task: "待合同",
        content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
        assignee: "待办人"
      },
      {
        todoDate: "2019/01/23",
        task: "待合同",
        content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
        assignee: "待办人"
      }
    ]);

    // 搜索处理
    const handleSearch = () => {
      console.log("搜索内容:", searchText.value);
    };

    return {
      searchText,
      progressList,
      todoList,
      handleSearch
    };
  }
};
</script>

<style scoped>
.customer-progress-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.header-search {
  width: 300px;
}

.order-panel {
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.left-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 60%;
}

.left-cell {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.left-cell div {
  margin-bottom: 10px;
}

.right-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 40%;
}

.right-cell {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.right-cell div {
  margin-bottom: 10px;
}

.last-right {
  display: flex;
}

.last-right span:first-child {
  margin-right: 5px;
}

.table-layout {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.table-container {
  flex: 1;
  min-width: 300px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.table-subtitle {
  font-size: 12px;
  color: #909399;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.progress-table,
.todo-table {
  width: 100%;
}

.mr-2 {
  margin-right: 8px;
}

.font-medium {
  font-weight: 500;
}

.text-gray-700 {
  color: #606266;
}
</style>