<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :modal="modal"
    :lock-scroll="lockScroll"
    :show-close="showClose"
    :before-close="handleBeforeClose"
    :destroy-on-close="destroyOnClose"
    :append-to-body="appendToBody"
    :center="center"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <div class="common-dialog-content">
      <div v-if="showHeaderIcon" class="dialog-header">
        <el-icon :class="['dialog-icon', headerIconClass]" :size="headerIconSize">
          <component :is="headerIcon" />
        </el-icon>
        <span class="dialog-title">{{ title }}</span>
      </div>
      <slot></slot>
    </div>
    <template #footer v-if="showFooter">
      <div class="dialog-footer">
        <slot name="footer">
          <el-button 
            v-if="showCancelButton" 
            :type="cancelButtonType"
            :size="buttonSize"
            :loading="cancelLoading"
            :disabled="cancelDisabled"
            @click="handleCancel"
          >
            {{ cancelText }}
          </el-button>
          <el-button 
            v-if="showConfirmButton" 
            :type="confirmButtonType"
            :size="buttonSize"
            :loading="confirmLoading"
            :disabled="confirmDisabled"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
  // 基础属性
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: [String, Number],
    default: '500px'
  },
  
  // 对话框行为属性
  fullscreen: {
    type: Boolean,
    default: false
  },
  modal: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: false
  },
  
  // 头部属性
  showHeaderIcon: {
    type: Boolean,
    default: false
  },
  headerIcon: {
    type: String,
    default: 'InfoFilled'
  },
  headerIconClass: {
    type: String,
    default: 'info'
  },
  headerIconSize: {
    type: [String, Number],
    default: 20
  },
  
  // 底部属性
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  
  // 按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  
  // 按钮类型
  cancelButtonType: {
    type: String,
    default: 'info'
  },
  confirmButtonType: {
    type: String,
    default: 'primary'
  },
  
  // 按钮大小
  buttonSize: {
    type: String,
    default: 'default'
  },
  
  // 按钮状态
  confirmLoading: {
    type: Boolean,
    default: false
  },
  cancelLoading: {
    type: Boolean,
    default: false
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  cancelDisabled: {
    type: Boolean,
    default: false
  },
  
  // 其他属性
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  appendToBody: {
    type: Boolean,
    default: true
  },
  beforeClose: {
    type: Function,
    default: null
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed', 'confirm', 'cancel'])

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})

// 处理打开前的回调
function handleBeforeClose(done) {
  if (props.beforeClose) {
    props.beforeClose(done)
  } else {
    done()
  }
}

// 处理打开事件
function handleOpen() {
  emit('open')
}

// 处理打开完成事件
function handleOpened() {
  emit('opened')
}

// 处理关闭事件
function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}

// 处理关闭完成事件
function handleClosed() {
  emit('closed')
}

// 处理确认事件
function handleConfirm() {
  emit('confirm')
}

// 处理取消事件
function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<style scoped>
.common-dialog-content {
  padding: 20px 0;
}

.dialog-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.dialog-icon {
  margin-right: 10px;
}

.dialog-icon.info {
  color: #909399;
}

.dialog-icon.success {
  color: #67c23a;
}

.dialog-icon.warning {
  color: #e6a23c;
}

.dialog-icon.danger {
  color: #f56c6c;
}

.dialog-title {
  flex: 1;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  margin-left: 10px;
}
</style>