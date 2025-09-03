<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <template #label>生成模板</template>
          <el-select v-model="info.tplCategory" @change="tplSelectChange">
            <el-option label="单表（增删改查）" value="crud" />
            <el-option label="树表（增删改查）" value="tree" />
            <el-option label="主子表（增删改查）" value="sub" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="tplWebType">
          <template #label>前端类型</template>
          <el-select v-model="info.tplWebType">
            <el-option label="Vue2 Element UI 模版" value="element-ui" />
            <el-option label="Vue3 Element Plus 模版" value="element-plus" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="packageName">
          <template #label>
            生成包路径
            <el-tooltip content="生成在哪个java包下，例如 com.ruoyi.system" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <template #label>
            生成模块名
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <template #label>
            生成业务名
            <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="info.businessName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <template #label>
            生成功能名
            <el-tooltip content="用作类描述，例如 用户" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="info.functionName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="genType">
          <template #label>
            生成代码方式
            <el-tooltip content="默认为zip压缩包下载，也可以自定义生成路径" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-radio v-model="info.genType" value="0">zip压缩包</el-radio>
          <el-radio v-model="info.genType" value="1">自定义路径</el-radio>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item>
          <template #label>
            上级菜单
            <el-tooltip content="分配到指定菜单下，例如 系统管理" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-tree-select
            v-model="info.parentMenuId"
            :data="menuOptions"
            :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
            value-key="menuId"
            placeholder="请选择系统菜单"
            check-strictly
          />
        </el-form-item>
      </el-col>

      <el-col :span="24" v-if="info.genType == '1'">
        <el-form-item prop="genPath">
          <template #label>
            自定义路径
            <el-tooltip content="填写磁盘绝对路径，若不填写，则生成到当前Web项目下" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="info.genPath">
            <template #append>
              <el-dropdown>
                <el-button type="primary">
                  最近路径快速选择
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="info.genPath = '/'">恢复默认的生成基础路径</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    
    <template v-if="info.tplCategory == 'tree'">
      <h4 class="form-header">其他信息</h4>
      <el-row v-show="info.tplCategory == 'tree'">
        <el-col :span="12">
          <el-form-item>
            <template #label>
              树编码字段
              <el-tooltip content="树显示的编码字段名， 如：dept_id" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select v-model="info.treeCode" placeholder="请选择">
              <el-option
                v-for="(column, index) in info.columns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              树父编码字段
              <el-tooltip content="树显示的父编码字段名， 如：parent_Id" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select v-model="info.treeParentCode" placeholder="请选择">
              <el-option
                v-for="(column, index) in info.columns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              树名称字段
              <el-tooltip content="树节点的显示名称字段名， 如：dept_name" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select v-model="info.treeName" placeholder="请选择">
              <el-option
                v-for="(column, index) in info.columns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <template v-if="info.tplCategory == 'sub'">
      <h4 class="form-header">关联信息</h4>
      <el-row>
        <!-- 添加配置模式开关 -->
        <el-col :span="24">
          <el-form-item label="配置模式">
            <el-radio-group v-model="subTableMode" @change="handleSubTableModeChange">
              <el-radio :label="1">单子表(1对1)</el-radio>
              <el-radio :label="2">多子表(1对多)</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
        <!-- 单子表配置区域 -->
        <template v-if="subTableMode === 1">
          <el-col :span="12">
            <el-form-item>
              <template #label>
                关联子表的表名
                <el-tooltip content="关联子表的表名， 如：sys_user" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
              </template>
              <el-select v-model="info.subTableName" placeholder="请选择" @change="subSelectChange">
                <el-option
                  v-for="(table, index) in tables"
                  :key="index"
                  :label="table.tableName + '：' + table.tableComment"
                  :value="table.tableName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                子表关联的外键名
                <el-tooltip content="子表关联的外键名， 如：user_id" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
              </template>
              <el-select v-model="info.subTableFkName" placeholder="请选择">
                <el-option
                  v-for="(column, index) in subColumns"
                  :key="index"
                  :label="column.columnName + '：' + column.columnComment"
                  :value="column.columnName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        
        <!-- 多子表配置区域 -->
        <template v-if="subTableMode === 2">
          <el-col :span="24">
            <el-divider>多子表配置</el-divider>
            <el-button type="primary" @click="addSubTableConfig">添加子表</el-button>
            <el-table :data="subTableConfigs" style="width: 100%; margin-top: 10px;">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column label="关联子表的表名">
                <template #default="scope">
                  <el-select v-model="scope.row.tableName" placeholder="请选择子表" @change="subTableChange(scope.row)">
                    <el-option
                      v-for="(table, index) in tables"
                      :key="index"
                      :label="table.tableName + '：' + table.tableComment"
                      :value="table.tableName">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="子表关联的外键名">
                <template #default="scope">
                  <el-select v-model="scope.row.fkName" placeholder="请选择外键">
                    <el-option
                      v-for="(column, index) in scope.row.columns"
                      :key="index"
                      :label="column.columnName + '：' + column.columnComment"
                      :value="column.columnName">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button type="danger" :icon="Delete" circle @click="removeSubTableConfig(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </template>
      </el-row>
    </template>

  </el-form>
</template>

<script setup>
import { listMenu } from "@/api/system/menu"
import { Delete } from '@element-plus/icons-vue'
import { nextTick } from 'vue'

const subColumns = ref([])
const menuOptions = ref([])
const subTableConfigs = ref([]) // 多个子表配置
const { proxy } = getCurrentInstance()

const props = defineProps({
  info: {
    type: Object,
    default: null
  },
  tables: {
    type: Array,
    default: null
  }
})

const subTableMode = ref(1) // 1: 单子表模式, 2: 多子表模式

// 表单校验
const rules = ref({
  tplCategory: [{ required: true, message: "请选择生成模板", trigger: "blur" }],
  packageName: [{ required: true, message: "请输入生成包路径", trigger: "blur" }],
  moduleName: [{ required: true, message: "请输入生成模块名", trigger: "blur" }],
  businessName: [{ required: true, message: "请输入生成业务名", trigger: "blur" }],
  functionName: [{ required: true, message: "请输入生成功能名", trigger: "blur" }]
})

function subSelectChange(value) {
  // 清空现有的子表配置
  subTableConfigs.value = []
}

// 处理配置模式切换
function handleSubTableModeChange(value) {
  if (value === 1) {
    // 切换到单子表模式，清空多子表配置
    subTableConfigs.value = []
    // 如果有多子表数据，将第一个子表数据填充到单子表配置中
    if (props.info.subTableNames && props.info.subTableFkNames) {
      const tableNames = props.info.subTableNames.split(',')
      const fkNames = props.info.subTableFkNames.split(',')
      if (tableNames.length > 0 && fkNames.length > 0 && tableNames[0] !== '' && fkNames[0] !== '') {
        props.info.subTableName = tableNames[0]
        props.info.subTableFkName = fkNames[0]
      }
    }
  } else {
    // 切换到多子表模式，清空单子表配置
    props.info.subTableName = ''
    props.info.subTableFkName = ''
    // 初始化多子表配置
    initializeSubTableConfigs()
  }
  
  // 更新subTableType字段
  props.info.subTableType = value
}

// 添加子表配置
function addSubTableConfig() {
  subTableConfigs.value.push({
    tableName: '',
    fkName: '',
    columns: []
  });
}

// 删除子表配置
function removeSubTableConfig(index) {
  subTableConfigs.value.splice(index, 1);
}

// 子表更改时更新列信息
function subTableChange(row) {
  // 清空外键选择
  row.fkName = '';
  
  // 更新列信息
  for (let i = 0; i < props.tables.length; i++) {
    if (props.tables[i].tableName === row.tableName) {
      row.columns = props.tables[i].columns;
      break;
    }
  }
}

// 监听子表配置变化，更新info中的subTableNames和subTableFkNames
watch(subTableConfigs, (newVal) => {
  // 只在多子表模式下更新
  if (subTableMode.value === 2) {
    // 更新info中的subTableNames和subTableFkNames
    let tableNames = [];
    let fkNames = [];
    newVal.forEach(item => {
      if (item.tableName && item.fkName) {
        tableNames.push(item.tableName);
        fkNames.push(item.fkName);
      }
    });
    props.info.subTableNames = tableNames.join(',');
    props.info.subTableFkNames = fkNames.join(',');
  }
}, { deep: true })

function tplSelectChange(value) {
  if (value !== "sub") {
    props.info.subTableName = ""
    props.info.subTableFkName = ""
    // 清理多子表配置
    subTableConfigs.value = []
  }
}

function setSubTableColumns(value) {
  for (var item in props.tables) {
    const name = props.tables[item].tableName
    if (value === name) {
      subColumns.value = props.tables[item].columns
      break
    }
  }
}

/** 查询菜单下拉树结构 */
function getMenuTreeselect() {
  listMenu().then(response => {
    menuOptions.value = proxy.handleTree(response.data, "menuId")
  })
}

onMounted(() => {
  getMenuTreeselect()
  
  // 初始化配置模式
  initializeSubTableMode()
})

// 监听info变化，确保在数据加载后正确初始化
watch(() => props.info, (newInfo) => {
  if (newInfo && newInfo.tplCategory === 'sub') {
    // 延迟执行以确保数据完全加载
    nextTick(() => {
      initializeSubTableMode()
    })
  }
}, { immediate: true, deep: true })

// 初始化配置模式
function initializeSubTableMode() {
  // 确保info数据存在
  if (!props.info || props.info.tplCategory !== 'sub') {
    subTableMode.value = 1
    return
  }
  
  // 根据subTableType字段初始化配置模式（如果存在）
  if (props.info.subTableType !== undefined && props.info.subTableType !== null) {
    subTableMode.value = props.info.subTableType
  } else {
    // 检查是否存在多子表配置数据（多个子表）
    if (props.info.subTableNames && props.info.subTableFkNames) {
      const tableNames = props.info.subTableNames.split(',')
      const fkNames = props.info.subTableFkNames.split(',')
      
      // 如果有多个子表配置，则使用多子表模式
      if (tableNames.length > 1 && fkNames.length > 1 && tableNames[0] !== '' && fkNames[0] !== '') {
        subTableMode.value = 2
      } else {
        // 否则使用单子表模式
        subTableMode.value = 1
      }
    } else {
      // 默认使用单子表模式
      subTableMode.value = 1
    }
  }
  
  // 根据模式初始化子表配置
  if (subTableMode.value === 2) {
    // 初始化多子表配置
    nextTick(() => {
      initializeSubTableConfigs()
    })
  }
  
  // 强制触发响应式更新
  nextTick(() => {
    // 通过触发handleSubTableModeChange来确保界面更新
    handleSubTableModeChange(subTableMode.value)
  })
}

// 初始化多子表配置
function initializeSubTableConfigs() {
  // 确保在多子表模式下且数据存在
  if (subTableMode.value !== 2 || !props.info || !props.tables) {
    return
  }
  
  // 清空现有配置
  subTableConfigs.value = []
  
  // 从逗号分隔的字符串中解析多子表配置
  if (props.info.subTableNames && props.info.subTableFkNames) {
    const tableNames = props.info.subTableNames.split(',')
    const fkNames = props.info.subTableFkNames.split(',')
    
    // 创建配置项
    for (let i = 0; i < tableNames.length; i++) {
      if (tableNames[i] && fkNames[i] && tableNames[i] !== '' && fkNames[i] !== '') {
        // 获取子表的列信息
        const table = props.tables.find(t => t.tableName === tableNames[i])
        if (table) {
          subTableConfigs.value.push({
            tableName: tableNames[i],
            fkName: fkNames[i],
            columns: table.columns || []
          })
        }
      }
    }
  }
}

watch(() => props.info.subTableName, val => {
  setSubTableColumns(val)
})

watch(() => props.info.tplWebType, val => {
  if (val === '') {
    props.info.tplWebType = "element-plus"
  }
})

// 在组件中暴露方法，用于获取多子表配置信息
defineExpose({
  getSubTableConfigs: () => {
    return subTableConfigs.value
  }
})
</script>
