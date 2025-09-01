<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同款时间" prop="contractPaymentTime">
        <el-date-picker clearable
          v-model="queryParams.contractPaymentTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择合同款时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker clearable
          v-model="queryParams.deliveryDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择交货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="尾款金额" prop="balancePayment">
        <el-input
          v-model="queryParams.balancePayment"
          placeholder="请输入尾款金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售员" prop="salesman">
        <el-input
          v-model="queryParams.salesman"
          placeholder="请输入销售员"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker clearable
          v-model="queryParams.createdTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['custom_info:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['custom_info:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['custom_info:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['custom_info:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="合同款时间" align="center" prop="contractPaymentTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.contractPaymentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同总金额" align="center" prop="contractTotalAmount" />
      <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="尾款金额" align="center" prop="balancePayment" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="销售员" align="center" prop="salesman" />
      <el-table-column label="设计师" align="center" prop="designer" />
      <el-table-column label="出货进度" align="center" prop="shipmentProgress" />
      <el-table-column label="详情说明" align="center" prop="details" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['custom_info:info:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['custom_info:info:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户信息（存储客户核心基础信息）对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="infoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="合同款时间" prop="contractPaymentTime">
          <el-date-picker clearable
            v-model="form.contractPaymentTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择合同款时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同总金额" prop="contractTotalAmount">
          <el-input v-model="form.contractTotalAmount" placeholder="请输入合同总金额" />
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
            v-model="form.deliveryDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择交货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="尾款金额" prop="balancePayment">
          <el-input v-model="form.balancePayment" placeholder="请输入尾款金额" />
        </el-form-item>
        <el-form-item label="销售员" prop="salesman">
          <el-input v-model="form.salesman" placeholder="请输入销售员" />
        </el-form-item>
        <el-form-item label="设计师" prop="designer">
          <el-input v-model="form.designer" placeholder="请输入设计师" />
        </el-form-item>
        <el-form-item label="详情说明" prop="details">
          <el-input v-model="form.details" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker clearable
            v-model="form.createdTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedTime">
          <el-date-picker clearable
            v-model="form.updatedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择更新时间">
          </el-date-picker>
        </el-form-item>
        <el-divider content-position="center">客户详情（存储客户补充信息）信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddCustomerDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteCustomerDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="customerDetailList" :row-class-name="rowCustomerDetailIndex" @selection-change="handleCustomerDetailSelectionChange" ref="customerDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="客户定金" prop="deposit" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.deposit" placeholder="请输入客户定金" />
            </template>
          </el-table-column>
          <el-table-column label="客户电话" prop="customerPhone" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.customerPhone" placeholder="请输入客户电话" />
            </template>
          </el-table-column>
          <el-table-column label="备用电话" prop="backupPhone" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.backupPhone" placeholder="请输入备用电话" />
            </template>
          </el-table-column>
          <el-table-column label="客户地址" prop="address" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.address" placeholder="请输入客户地址" />
            </template>
          </el-table-column>
          <el-table-column label="详情创建时间" prop="createdTime" width="240">
            <template #default="scope">
              <el-date-picker clearable
                v-model="scope.row.createdTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择详情创建时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="详情更新时间" prop="updatedTime" width="240">
            <template #default="scope">
              <el-date-picker clearable
                v-model="scope.row.updatedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择详情更新时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="逻辑删除标识" prop="isDeleted" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.isDeleted" placeholder="请输入逻辑删除标识" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info">
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/custom_info/info"

const { proxy } = getCurrentInstance()

const infoList = ref([])
const customerDetailList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const checkedCustomerDetail = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerName: null,
    contractPaymentTime: null,
    deliveryDate: null,
    balancePayment: null,
    status: null,
    salesman: null,
    shipmentProgress: null,
    createdTime: null,
  },
  rules: {
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    contractPaymentTime: [
      { required: true, message: "合同款时间不能为空", trigger: "blur" }
    ],
    contractTotalAmount: [
      { required: true, message: "合同总金额不能为空", trigger: "blur" }
    ],
    deliveryDate: [
      { required: true, message: "交货日期不能为空", trigger: "blur" }
    ],
    balancePayment: [
      { required: true, message: "尾款金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    salesman: [
      { required: true, message: "销售员不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询客户信息（存储客户核心基础信息）列表 */
function getList() {
  loading.value = true
  listInfo(queryParams.value).then(response => {
    infoList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    customerName: null,
    contractPaymentTime: null,
    contractTotalAmount: null,
    deliveryDate: null,
    balancePayment: null,
    status: null,
    salesman: null,
    designer: null,
    shipmentProgress: null,
    details: null,
    createdTime: null,
    updatedTime: null
  }
  customerDetailList.value = []
  proxy.resetForm("infoRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加客户信息（存储客户核心基础信息）"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getInfo(_id).then(response => {
    form.value = response.data
    customerDetailList.value = response.data.customerDetailList
    open.value = true
    title.value = "修改客户信息（存储客户核心基础信息）"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["infoRef"].validate(valid => {
    if (valid) {
      form.value.customerDetailList = customerDetailList.value
      if (form.value.id != null) {
        updateInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除客户信息（存储客户核心基础信息）编号为"' + _ids + '"的数据项？').then(function() {
    return delInfo(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 客户详情（存储客户补充信息）序号 */
function rowCustomerDetailIndex({ row, rowIndex }) {
  row.index = rowIndex + 1
}

/** 客户详情（存储客户补充信息）添加按钮操作 */
function handleAddCustomerDetail() {
  let obj = {}
  obj.deposit = ""
  obj.customerPhone = ""
  obj.backupPhone = ""
  obj.address = ""
  obj.createdTime = ""
  obj.updatedTime = ""
  obj.isDeleted = ""
  customerDetailList.value.push(obj)
}

/** 客户详情（存储客户补充信息）删除按钮操作 */
function handleDeleteCustomerDetail() {
  if (checkedCustomerDetail.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的客户详情（存储客户补充信息）数据")
  } else {
    const customerDetails = customerDetailList.value
    const checkedCustomerDetails = checkedCustomerDetail.value
    customerDetailList.value = customerDetails.filter(function(item) {
      return checkedCustomerDetails.indexOf(item.index) == -1
    })
  }
}

/** 复选框选中数据 */
function handleCustomerDetailSelectionChange(selection) {
  checkedCustomerDetail.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('custom_info/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}

getList()
</script>
