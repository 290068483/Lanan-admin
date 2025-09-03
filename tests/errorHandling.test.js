import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EditTable from '@/views/tool/gen/editTable.vue'

// 模拟 Element Plus 的消息提示
vi.mock('@/utils/request', () => ({
  default: vi.fn()
}))

vi.mock('@/api/tool/gen', () => ({
  getGenTable: vi.fn(),
  updateGenTable: vi.fn()
}))

vi.mock('@/api/system/dict/type', () => ({
  optionselect: vi.fn()
}))

describe('EditTable Error Handling', () => {
  it('should handle backend validation errors gracefully', async () => {
    // 准备测试数据
    const mockError = new Error('关联子表的表名不能为空')
    
    // 模拟 updateGenTable 方法抛出错误
    const { updateGenTable } = await import('@/api/tool/gen')
    updateGenTable.mockRejectedValue(mockError)
    
    // 创建组件实例
    const wrapper = mount(EditTable, {
      global: {
        mocks: {
          $modal: {
            msgSuccess: vi.fn(),
            msgError: vi.fn()
          },
          $tab: {
            closeOpenPage: vi.fn()
          }
        },
        stubs: {
          'el-card': true,
          'el-tabs': true,
          'el-tab-pane': true,
          'el-table': true,
          'el-table-column': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true,
          'el-form': true,
          'el-form-item': true,
          'el-button': true
        }
      },
      props: {
        route: {
          params: {
            tableId: 1
          },
          query: {}
        }
      }
    })
    
    // 模拟组件数据
    wrapper.vm.info = {
      tplCategory: 'sub',
      subTableName: '',
      subTableFkName: ''
    }
    
    wrapper.vm.columns = []
    wrapper.vm.tables = []
    
    // 调用提交方法
    try {
      await wrapper.vm.submitForm()
    } catch (e) {
      // 忽略这里捕获的错误
    }
    
    // 验证是否显示了错误消息
    expect(wrapper.vm.$modal.msgError).toHaveBeenCalledWith('关联子表的表名不能为空')
  })
})