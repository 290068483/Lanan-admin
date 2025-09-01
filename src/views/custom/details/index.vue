<template>
  <div class="customer-detail-container">
    <el-card class="customer-info-card">
      <template #header>
        <div class="card-header">
          <span>客户基本信息</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <span class="label">客户姓名：</span>
            <span class="value">张三</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">联系电话：</span>
            <span class="value">13800138000</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">客户等级：</span>
            <span class="value">VIP</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-4">
        <el-col :span="8">
          <div class="info-item">
            <span class="label">所属区域：</span>
            <span class="value">重庆市</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">详细地址：</span>
            <span class="value">重庆市九龙坡区某某街道</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <span class="label">客户来源：</span>
            <span class="value">线上推广</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="customer-orders-card mt-4">
      <template #header>
        <div class="card-header">
          <span>客户订单信息</span>
        </div>
      </template>
      <el-table :data="orderData" border stripe>
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="orderDate" label="下单时间" width="180" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="amount" label="订单金额" width="120" />
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewOrder(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="customer-interaction-card mt-4">
      <template #header>
        <div class="card-header">
          <span>客户互动记录</span>
        </div>
      </template>
      <el-table :data="interactionData" border stripe>
        <el-table-column prop="date" label="互动时间" width="180" />
        <el-table-column prop="type" label="互动类型" width="120" />
        <el-table-column prop="content" label="互动内容" />
        <el-table-column prop="operator" label="操作人" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "CustomerDetail",
  setup() {
    // 订单数据
    const orderData = ref([
      {
        orderNo: "ORD2023001",
        orderDate: "2023-01-15",
        productName: "定制衣柜",
        amount: "8500.00",
        status: "已完成",
      },
      {
        orderNo: "ORD2023002",
        orderDate: "2023-02-20",
        productName: "定制书桌",
        amount: "3200.00",
        status: "进行中",
      },
      {
        orderNo: "ORD2023003",
        orderDate: "2023-03-10",
        productName: "定制床头柜",
        amount: "1800.00",
        status: "已取消",
      },
    ]);

    // 互动记录数据
    const interactionData = ref([
      {
        date: "2023-03-15 14:30",
        type: "电话咨询",
        content: "客户咨询产品细节和价格",
        operator: "销售顾问A",
      },
      {
        date: "2023-03-10 10:15",
        type: "上门测量",
        content: "上门为客户测量尺寸，确定设计方案",
        operator: "设计师B",
      },
      {
        date: "2023-03-05 09:45",
        type: "在线沟通",
        content: "通过微信沟通产品需求和预算",
        operator: "销售顾问A",
      },
    ]);

    // 获取订单状态标签类型
    const getStatusType = (status) => {
      switch (status) {
        case "已完成":
          return "success";
        case "进行中":
          return "warning";
        case "已取消":
          return "danger";
        default:
          return "info";
      }
    };

    // 查看订单详情
    const viewOrder = (row) => {
      console.log("查看订单详情:", row);
      // 这里可以跳转到订单详情页面
    };

    return {
      orderData,
      interactionData,
      getStatusType,
      viewOrder,
    };
  },
};
</script>

<style scoped>
.customer-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.customer-detail-container .card-header {
  font-weight: bold;
  font-size: 16px;
  color: #303133;
}

.customer-detail-container .info-item {
  display: flex;
  margin-bottom: 15px;
}

.customer-detail-container .label {
  font-weight: bold;
  color: #606266;
  width: 100px;
  flex-shrink: 0;
}

.customer-detail-container .value {
  color: #303133;
  flex: 1;
}

.customer-detail-container .mt-4 {
  margin-top: 16px;
}

.customer-detail-container :deep(.el-card) {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.customer-detail-container :deep(.el-table) {
  border-radius: 4px;
}
</style>