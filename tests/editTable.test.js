import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import EditTable from '../src/views/tool/gen/editTable.vue'

// Mock API functions
const mockGetGenTable = vi.fn()
const mockUpdateGenTable = vi.fn()

vi.mock('@/api/tool/gen', () => ({
  getGenTable: mockGetGenTable,
  updateGenTable: mockUpdateGenTable
}))

// Mock child components
vi.mock('../src/views/tool/gen/basicInfoForm.vue', () => ({
  default: {
    template: '<div>Basic Info Form</div>',
    props: ['info']
  }
}))

vi.mock('../src/views/tool/gen/genInfoForm.vue', () => ({
  default: {
    template: '<div>Gen Info Form</div>',
    props: ['info', 'tables'],
    methods: {
      getSubTableConfigs: vi.fn()
    }
  }
}))

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElCard: {
    template: '<div><slot></slot></div>'
  },
  ElTabs: {
    template: '<div><slot></slot></div>',
    props: ['modelValue']
  },
  ElTabPane: {
    template: '<div><slot></slot></div>',
    props: ['label', 'name']
  },
  ElButton: {
    template: '<button><slot></slot></button>',
    props: ['type']
  },
  ElTable: {
    template: '<table><slot></slot></table>',
    props: ['data', 'rowKey', 'maxHeight']
  },
  ElTableColumn: {
    template: '<td><slot></slot></td>',
    props: ['label', 'prop', 'minWidth']
  },
  ElInput: {
    template: '<input />'
  },
  ElSelect: {
    template: '<select><slot></slot></select>'
  },
  ElOption: {
    template: '<option><slot></slot></option>',
    props: ['label', 'value']
  },
  ElCheckbox: {
    template: '<input type="checkbox" />',
    props: ['trueValue', 'falseValue', 'modelValue']
  }
}))

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      tableId: '1'
    },
    query: {}
  })
}))

describe('EditTable.vue', () => {
  // Mock data
  const mockTableData = {
    data: {
      rows: [
        {
          columnId: '1',
          columnName: 'user_id',
          columnComment: '用户ID',
          columnType: 'int',
          javaType: 'Long',
          javaField: 'userId',
          isInsert: '1',
          isEdit: '1',
          isList: '1',
          isQuery: '1',
          queryType: 'EQ',
          isRequired: '1',
          htmlType: 'input',
          dictType: '',
          sort: 1
        }
      ],
      info: {
        tableId: '1',
        tableName: 'sys_user',
        tableComment: '用户表',
        subTableName: '',
        subTableFkName: '',
        subTableNames: '',
        subTableFkNames: '',
        className: 'SysUser',
        tplCategory: 'sub',
        tplWebType: 'element-plus',
        packageName: 'com.ruoyi.system',
        moduleName: 'system',
        businessName: 'user',
        functionName: '用户',
        functionAuthor: 'ruoyi',
        genType: '0',
        genPath: '/',
        treeCode: '',
        treeParentCode: '',
        treeName: '',
        parentMenuId: null,
        parentMenuName: ''
      },
      tables: [
        {
          tableName: 'sys_user',
          tableComment: '用户表',
          columns: [
            { columnName: 'user_id', columnComment: '用户ID' },
            { columnName: 'username', columnComment: '用户名' }
          ]
        },
        {
          tableName: 'sys_role',
          tableComment: '角色表',
          columns: [
            { columnName: 'role_id', columnComment: '角色ID' },
            { columnName: 'role_name', columnComment: '角色名' }
          ]
        }
      ]
    }
  }

  let wrapper

  beforeEach(() => {
    // Reset mocks
    mockGetGenTable.mockReset()
    mockUpdateGenTable.mockReset()
    
    // Mock API responses
    mockGetGenTable.mockResolvedValue(mockTableData)
    mockUpdateGenTable.mockResolvedValue({ code: 200, msg: '操作成功' })
  })

  it('fetches table data on mount', async () => {
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $tab: {
            closeOpenPage: vi.fn()
          },
          $modal: {
            msgSuccess: vi.fn(),
            msgError: vi.fn()
          }
        }
      }
    })

    await nextTick()

    expect(mockGetGenTable).toHaveBeenCalledWith('1')
  })

  it('initializes subTableNames and subTableFkNames if not present', async () => {
    const mockDataWithoutSubFields = {
      data: {
        rows: [],
        info: {
          tableId: '1',
          tableName: 'sys_user',
          tableComment: '用户表'
          // subTableNames and subTableFkNames are missing
        },
        tables: []
      }
    }

    mockGetGenTable.mockResolvedValueOnce(mockDataWithoutSubFields)

    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $tab: {
            closeOpenPage: vi.fn()
          },
          $modal: {
            msgSuccess: vi.fn(),
            msgError: vi.fn()
          }
        }
      }
    })

    await nextTick()

    expect(wrapper.vm.info.subTableNames).toBe('')
    expect(wrapper.vm.info.subTableFkNames).toBe('')
  })

  it('submits form with multi-sub-table configuration', async () => {
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $tab: {
            closeOpenPage: vi.fn()
          },
          $modal: {
            msgSuccess: vi.fn(),
            msgError: vi.fn()
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

    // Wait for data to load
    await nextTick()

    // Submit form
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()

    // Check if updateGenTable was called with correct data
    expect(mockUpdateGenTable).toHaveBeenCalled()
    
    const calledWith = mockUpdateGenTable.mock.calls[0][0]
    expect(calledWith.subTableNames).toBe('sys_user,sys_role')
    expect(calledWith.subTableFkNames).toBe('user_id,role_id')
    expect(calledWith.subTableName).toBe('sys_user') // First table for backward compatibility
    expect(calledWith.subTableFkName).toBe('user_id') // First fk for backward compatibility
  })

  it('submits form with single sub table configuration', async () => {
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $tab: {
            closeOpenPage: vi.fn()
          },
          $modal: {
            msgSuccess: vi.fn(),
            msgError: vi.fn()
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
              getSubTableConfigs: () => [] // Empty configs indicate single mode
            }
          }
        }
      }
    })

    // Wait for data to load and set single sub table data
    await nextTick()
    wrapper.vm.info.subTableName = 'sys_user'
    wrapper.vm.info.subTableFkName = 'user_id'

    // Submit form
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()

    // Check if updateGenTable was called with correct data
    expect(mockUpdateGenTable).toHaveBeenCalled()
    
    const calledWith = mockUpdateGenTable.mock.calls[0][0]
    expect(calledWith.subTableNames).toBe('sys_user') // Should match subTableName
    expect(calledWith.subTableFkNames).toBe('user_id') // Should match subTableFkName
    expect(calledWith.subTableName).toBe('sys_user')
    expect(calledWith.subTableFkName).toBe('user_id')
  })

  it('submits form with empty sub table configs', async () => {
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $tab: {
            closeOpenPage: vi.fn()
          },
          $modal: {
            msgSuccess: vi.fn(),
            msgError: vi.fn()
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
              getSubTableConfigs: () => []
            }
          }
        }
      }
    })

    // Wait for data to load
    await nextTick()

    // Submit form
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()

    // Check if updateGenTable was called
    expect(mockUpdateGenTable).toHaveBeenCalled()
    
    const calledWith = mockUpdateGenTable.mock.calls[0][0]
    expect(calledWith.subTableNames).toBe('') // Should be empty
    expect(calledWith.subTableFkNames).toBe('') // Should be empty
  })

  it('shows error message when form validation fails', async () => {
    const mockMsgError = vi.fn()
    
    wrapper = mount(EditTable, {
      global: {
        mocks: {
          $tab: {
            closeOpenPage: vi.fn()
          },
          $modal: {
            msgSuccess: vi.fn(),
            msgError: mockMsgError
          },
          $refs: {
            basicInfo: {
              $refs: {
                basicInfoForm: {
                  validate: (callback) => callback(false) // Validation fails
                }
              }
            },
            genInfo: {
              $refs: {
                genInfoForm: {
                  validate: (callback) => callback(true)
                }
              }
            }
          }
        }
      }
    })

    // Wait for data to load
    await nextTick()

    // Submit form
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()

    // Check if error message is shown
    expect(mockMsgError).toHaveBeenCalledWith('表单校验未通过，请重新检查提交内容')
  })
})