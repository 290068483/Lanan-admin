<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户ID" prop="customId">
        <el-input
          v-model="queryParams.customId"
          placeholder="请输入客户ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户定金" prop="deposit">
        <el-input
          v-model="queryParams.deposit"
          placeholder="请输入客户定金"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户电话" prop="customerPhone">
        <el-input
          v-model="queryParams.customerPhone"
          placeholder="请输入客户电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备用电话" prop="backupPhone">
        <el-input
          v-model="queryParams.backupPhone"
          placeholder="请输入备用电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入客户地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详情创建时间" prop="createdTime">
        <el-date-picker clearable
          v-model="queryParams.createdTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择详情创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="详情更新时间" prop="updatedTime">
        <el-date-picker clearable
          v-model="queryParams.updatedTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择详情更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="逻辑删除标识" prop="isDeleted">
        <el-input
          v-model="queryParams.isDeleted"
          placeholder="请输入逻辑删除标识"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['custom_detail:detail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['custom_detail:detail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['custom_detail:detail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['custom_detail:detail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户详情ID" align="center" prop="id" />
      <el-table-column label="客户ID" align="center" prop="customId" />
      <el-table-column label="客户定金" align="center" prop="deposit" />
      <el-table-column label="客户电话" align="center" prop="customerPhone" />
      <el-table-column label="备用电话" align="center" prop="backupPhone" />
      <el-table-column label="客户地址" align="center" prop="address" />
      <el-table-column label="详情创建时间" align="center" prop="createdTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情更新时间" align="center" prop="updatedTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逻辑删除标识" align="center" prop="isDeleted" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['custom_detail:detail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['custom_detail:detail:remove']">删除</el-button>
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

    <!-- 添加或修改客户详情（存储客户补充信息）对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="detailRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户ID" prop="customId">
          <el-input v-model="form.customId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户定金" prop="deposit">
          <el-input v-model="form.deposit" placeholder="请输入客户定金" />
        </el-form-item>
        <el-form-item label="客户电话" prop="customerPhone">
          <el-input v-model="form.customerPhone" placeholder="请输入客户电话" />
        </el-form-item>
        <el-form-item label="备用电话" prop="backupPhone">
          <el-input v-model="form.backupPhone" placeholder="请输入备用电话" />
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入客户地址" />
        </el-form-item>
        <el-form-item label="详情创建时间" prop="createdTime">
          <el-date-picker clearable
            v-model="form.createdTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择详情创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="详情更新时间" prop="updatedTime">
          <el-date-picker clearable
            v-model="form.updatedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择详情更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="逻辑删除标识" prop="isDeleted">
          <el-input v-model="form.isDeleted" placeholder="请输入逻辑删除标识" />
        </el-form-item>
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

<script setup name="Detail">
import { listDetail, getDetail, delDetail, addDetail, updateDetail } from "@/api/custom_detail/detail"

const { proxy } = getCurrentInstance()

const detailList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customId: null,
    deposit: null,
    customerPhone: null,
    backupPhone: null,
    address: null,
    createdTime: null,
    updatedTime: null,
    isDeleted: null
  },
  rules: {
    customId: [
      { required: true, message: "客户ID不能为空", trigger: "blur" }
    ],
    deposit: [
      { required: true, message: "客户定金不能为空", trigger: "blur" }
    ],
    customerPhone: [
      { required: true, message: "客户电话不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "客户地址不能为空", trigger: "blur" }
    ],
    createdTime: [
      { required: true, message: "详情创建时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询客户详情（存储客户补充信息）列表 */
function getList() {
  loading.value = true
  listDetail(queryParams.value).then(response => {
    detailList.value = response.rows
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
    customId: null,
    deposit: null,
    customerPhone: null,
    backupPhone: null,
    address: null,
    createdTime: null,
    updatedTime: null,
    isDeleted: null
  }
  proxy.resetForm("detailRef")
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
  title.value = "添加客户详情（存储客户补充信息）"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getDetail(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改客户详情（存储客户补充信息）"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["detailRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDetail(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDetail(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除客户详情（存储客户补充信息）编号为"' + _ids + '"的数据项？').then(function() {
    return delDetail(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('custom_detail/detail/export', {
    ...queryParams.value
  }, `detail_${new Date().getTime()}.xlsx`)
}

getList()
</script>
