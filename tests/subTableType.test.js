import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import EditTable from '@/views/tool/gen/editTable.vue'
import GenInfoForm from '@/views/tool/gen/genInfoForm.vue'

// Mock the API functions
jest.mock('@/api/tool/gen', () => ({
  getGenTable: jest.fn(),
  updateGenTable: jest.fn()
}))

jest.mock('@/api/system/dict/type', () => ({
  optionselect: jest.fn()
}))

describe('SubTableType Support', () => {
  let wrapper
  
  const mockTables = [
    { tableName: 'sys_user', tableComment: '用户表', columns: [] },
    { tableName: 'sys_role', tableComment: '角色表', columns: [] }
  ]
  
  const mockInfo = {
    tplCategory: 'sub',
    subTableType: 2, // 1对多模式
    subTableNames: 'sys_user,sys_role',
    subTableFkNames: 'user_id,role_id'
  }
  
  beforeEach(() => {
    // Mock the API responses
    require('@/api/tool/gen').getGenTable.mockResolvedValue({
      data: {
        rows: [],
        info: mockInfo,
        tables: mockTables
      }
    })
    
    require('@/api/system/dict/type').optionselect.mockResolvedValue({
      data: []
    })
  })
  
  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })
  
  it('should initialize subTableType correctly', async () => {
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $route: {
            params: { tableId: 1 }
          },
          $tab: {
            closeOpenPage: jest.fn()
          },
          $modal: {
            msgSuccess: jest.fn(),
            msgError: jest.fn()
          }
        }
      }
    })
    
    // Wait for the component to load data
    await nextTick()
    await nextTick()
    
    // Check if subTableType is correctly initialized
    expect(wrapper.vm.info.subTableType).toBe(2)
  })
  
  it('should submit form with subTableType field', async () => {
    const updateGenTable = require('@/api/tool/gen').updateGenTable
    updateGenTable.mockResolvedValue({ code: 200, msg: 'Success' })
    
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $route: {
            params: { tableId: 1 }
          },
          $tab: {
            closeOpenPage: jest.fn()
          },
          $modal: {
            msgSuccess: jest.fn(),
            msgError: jest.fn()
          },
          $refs: {
            basicInfo: {
              $refs: {
                basicInfoForm: {
                  validate: (callback) => callback(true)
                }
              }
            },
            genInfo: {
              $refs: {
                genInfoForm: {
                  validate: (callback) => callback(true)
                }
              },
              getSubTableConfigs: () => [
                { tableName: 'sys_user', fkName: 'user_id' },
                { tableName: 'sys_role', fkName: 'role_id' }
              ]
            }
          }
        }
      }
    })
    
    // Wait for the component to load data
    await nextTick()
    await nextTick()
    
    // Submit the form
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()
    
    // Check if updateGenTable was called with subTableType
    expect(updateGenTable).toHaveBeenCalled()
    const calledWith = updateGenTable.mock.calls[0][0]
    expect(calledWith.subTableType).toBe(2)
  })
  
  it('should handle subTableType change in genInfoForm', async () => {
    wrapper = mount(GenInfoForm, {
      props: {
        info: { ...mockInfo },
        tables: mockTables
      }
    })
    
    // Wait for initialization
    await nextTick()
    
    // Check initial subTableMode
    expect(wrapper.vm.subTableMode).toBe(2)
    
    // Change to single mode
    wrapper.vm.subTableMode = 1
    await wrapper.vm.handleSubTableModeChange(1)
    await nextTick()
    
    // Check if subTableType is updated
    expect(wrapper.props().info.subTableType).toBe(1)
  })
  
  it('should correctly initialize mode based on subTableType', async () => {
    const infoWithSubTableType = {
      tplCategory: 'sub',
      subTableType: 2,
      subTableNames: 'sys_user,sys_role',
      subTableFkNames: 'user_id,role_id'
    }
    
    wrapper = mount(GenInfoForm, {
      props: {
        info: infoWithSubTableType,
        tables: mockTables
      }
    })
    
    // Wait for initialization
    await nextTick()
    await nextTick()
    
    // Check if mode is correctly initialized based on subTableType
    expect(wrapper.vm.subTableMode).toBe(2)
    
    // Check if subTableConfigs are correctly initialized
    expect(wrapper.vm.subTableConfigs.length).toBe(2)
  })
  
  it('should correctly initialize mode based on subTableNames', async () => {
    const infoWithoutSubTableType = {
      tplCategory: 'sub',
      subTableNames: 'sys_user,sys_role',
      subTableFkNames: 'user_id,role_id'
    }
    
    wrapper = mount(GenInfoForm, {
      props: {
        info: infoWithoutSubTableType,
        tables: mockTables
      }
    })
    
    // Wait for initialization
    await nextTick()
    await nextTick()
    
    // Check if mode is correctly initialized based on subTableNames
    expect(wrapper.vm.subTableMode).toBe(2)
    
    // Check if subTableConfigs are correctly initialized
    expect(wrapper.vm.subTableConfigs.length).toBe(2)
  })
})