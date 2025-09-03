import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import GenInfoForm from '../src/views/tool/gen/genInfoForm.vue'

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElForm: {
    template: '<form><slot></slot></form>'
  },
  ElRow: {
    template: '<div><slot></slot></div>'
  },
  ElCol: {
    template: '<div><slot></slot></div>'
  },
  ElFormItem: {
    template: '<div><slot></slot></div>'
  },
  ElSelect: {
    template: '<select><slot></slot></select>'
  },
  ElOption: {
    template: '<option><slot></slot></option>',
    props: ['label', 'value']
  },
  ElInput: {
    template: '<input />'
  },
  ElButton: {
    template: '<button><slot></slot></button>',
    props: ['type']
  },
  ElTable: {
    template: '<table><slot></slot></table>',
    props: ['data']
  },
  ElTableColumn: {
    template: '<td><slot></slot></td>',
    props: ['label', 'prop']
  },
  ElDivider: {
    template: '<hr />'
  },
  ElRadioGroup: {
    template: '<div><slot></slot></div>',
    props: ['modelValue']
  },
  ElRadio: {
    template: '<label><input type="radio" /><slot></slot></label>',
    props: ['label']
  }
}))

// Mock Element Plus icons
vi.mock('@element-plus/icons-vue', () => ({
  Delete: {
    template: '<span>Delete</span>'
  },
  QuestionFilled: {
    template: '<span>?</span>'
  }
}))

describe('GenInfoForm.vue', () => {
  // Mock data
  const mockInfo = {
    tplCategory: 'sub',
    subTableName: '',
    subTableFkName: '',
    subTableNames: '',
    subTableFkNames: ''
  }

  const mockTables = [
    {
      tableName: 'sys_user',
      tableComment: '用户表',
      columns: [
        { columnName: 'user_id', columnComment: '用户ID' }
      ]
    },
    {
      tableName: 'sys_role',
      tableComment: '角色表',
      columns: [
        { columnName: 'role_id', columnComment: '角色ID' }
      ]
    }
  ]

  let wrapper

  beforeEach(() => {
    wrapper = mount(GenInfoForm, {
      props: {
        info: mockInfo,
        tables: mockTables
      },
      global: {
        mocks: {
          $refs: {}
        }
      }
    })
  })

  it('renders correctly when tplCategory is "sub"', () => {
    expect(wrapper.find('.form-header').text()).toBe('关联信息')
  })

  it('renders sub table mode switch', () => {
    const radioGroup = wrapper.findComponent({ name: 'ElRadioGroup' })
    expect(radioGroup.exists()).toBe(true)
    
    const radios = wrapper.findAllComponents({ name: 'ElRadio' })
    expect(radios.length).toBe(2)
    
    expect(radios[0].text()).toContain('单子表(1对1)')
    expect(radios[1].text()).toContain('多子表(1对多)')
  })

  it('defaults to single sub table mode', () => {
    expect(wrapper.vm.subTableMode).toBe(1)
  })

  it('switches to multi sub table mode', async () => {
    const radioGroup = wrapper.findComponent({ name: 'ElRadioGroup' })
    await radioGroup.setValue(2)
    
    expect(wrapper.vm.subTableMode).toBe(2)
  })

  it('shows single sub table config when mode is 1', async () => {
    // Mode 1 is default, so single sub table config should be visible
    const selects = wrapper.findAllComponents({ name: 'ElSelect' })
    // Should have at least the sub table name and fk name selects
    expect(selects.length).toBeGreaterThanOrEqual(2)
  })

  it('shows multi sub table config when mode is 2', async () => {
    // Switch to multi mode
    wrapper.vm.subTableMode = 2
    await nextTick()
    
    // Add a sub table config
    const addButton = wrapper.find('button[type="primary"]')
    await addButton.trigger('click')
    
    // Check if table is rendered
    const table = wrapper.findComponent({ name: 'ElTable' })
    expect(table.exists()).toBe(true)
  })

  it('adds sub table config when add button is clicked in multi mode', async () => {
    // Switch to multi mode
    wrapper.vm.subTableMode = 2
    await nextTick()
    
    const addButton = wrapper.find('button[type="primary"]')
    expect(addButton.text()).toBe('添加子表')
    
    await addButton.trigger('click')
    
    // Check if subTableConfigs array has one item
    const vm = wrapper.vm
    expect(vm.subTableConfigs.length).toBe(1)
    expect(vm.subTableConfigs[0]).toEqual({
      tableName: '',
      fkName: '',
      columns: []
    })
  })

  it('removes sub table config when remove button is clicked', async () => {
    // Switch to multi mode
    wrapper.vm.subTableMode = 2
    await nextTick()
    
    // Add one item first
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()
    
    // Add another item
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()
    
    expect(wrapper.vm.subTableConfigs.length).toBe(2)
    
    // Remove the first item
    const removeButton = wrapper.findAll('button[type="danger"]')[0]
    await removeButton.trigger('click')
    
    expect(wrapper.vm.subTableConfigs.length).toBe(1)
  })

  it('updates subTableNames and subTableFkNames when subTableConfigs change in multi mode', async () => {
    // Switch to multi mode
    wrapper.vm.subTableMode = 2
    await nextTick()
    
    // Add a sub table config
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()
    
    // Set values for the config
    wrapper.vm.subTableConfigs[0].tableName = 'sys_user'
    wrapper.vm.subTableConfigs[0].fkName = 'user_id'
    
    // Trigger watch
    await nextTick()
    
    // Check if info is updated
    expect(wrapper.props().info.subTableNames).toBe('sys_user')
    expect(wrapper.props().info.subTableFkNames).toBe('user_id')
  })

  it('does not update subTableNames and subTableFkNames when in single mode', async () => {
    // Ensure we're in single mode (default)
    expect(wrapper.vm.subTableMode).toBe(1)
    
    // Mock subTableConfigs change (should not happen in single mode, but let's test)
    wrapper.vm.subTableConfigs = [{
      tableName: 'sys_user',
      fkName: 'user_id'
    }]
    
    // Trigger watch
    await nextTick()
    
    // Check if info is NOT updated in single mode
    expect(wrapper.props().info.subTableNames).toBe('')
    expect(wrapper.props().info.subTableFkNames).toBe('')
  })

  it('initializes subTableConfigs from info props with single sub table', async () => {
    const infoWithSingleConfig = {
      tplCategory: 'sub',
      subTableName: 'sys_user',
      subTableFkName: 'user_id',
      subTableNames: 'sys_user',
      subTableFkNames: 'user_id'
    }

    const wrapperWithSingleConfig = mount(GenInfoForm, {
      props: {
        info: infoWithSingleConfig,
        tables: mockTables
      }
    })

    // Wait for initialization
    await nextTick()

    // Should default to single mode when only one sub table exists
    expect(wrapperWithSingleConfig.vm.subTableMode).toBe(1)
  })

  it('initializes subTableConfigs from info props with multiple sub tables', async () => {
    const infoWithConfigs = {
      tplCategory: 'sub',
      subTableName: '',
      subTableFkName: '',
      subTableNames: 'sys_user,sys_role',
      subTableFkNames: 'user_id,role_id'
    }

    const wrapperWithConfigs = mount(GenInfoForm, {
      props: {
        info: infoWithConfigs,
        tables: mockTables
      }
    })

    // Wait for initialization
    await nextTick()

    // Should default to multi mode when multiple sub tables exist
    expect(wrapperWithConfigs.vm.subTableMode).toBe(2)
    
    // Check if subTableConfigs is initialized correctly
    expect(wrapperWithConfigs.vm.subTableConfigs.length).toBe(2)
    expect(wrapperWithConfigs.vm.subTableConfigs[0]).toEqual({
      tableName: 'sys_user',
      fkName: 'user_id',
      columns: mockTables[0].columns
    })
    expect(wrapperWithConfigs.vm.subTableConfigs[1]).toEqual({
      tableName: 'sys_role',
      fkName: 'role_id',
      columns: mockTables[1].columns
    })
  })

  it('initializes subTableConfigs correctly when info data changes', async () => {
    const wrapperWithData = mount(GenInfoForm, {
      props: {
        info: {
          tplCategory: 'sub'
        },
        tables: mockTables
      }
    })

    // Initially should be in single mode
    expect(wrapperWithData.vm.subTableMode).toBe(1)
    
    // Update info with multi table data
    await wrapperWithData.setProps({
      info: {
        tplCategory: 'sub',
        subTableNames: 'sys_user,sys_role',
        subTableFkNames: 'user_id,role_id'
      }
    })
    
    // Wait for reactivity
    await nextTick()
    
    // Should now be in multi mode
    expect(wrapperWithData.vm.subTableMode).toBe(2)
    
    // Check if subTableConfigs is initialized correctly
    // We need to wait a bit more for the nextTick in the watch
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(wrapperWithData.vm.subTableConfigs.length).toBe(2)
  })

  it('clears subTableConfigs when template category changes to non-sub', async () => {
    // Switch to multi mode
    wrapper.vm.subTableMode = 2
    await nextTick()
    
    // Add a sub table config
    await wrapper.find('button[type="primary"]').trigger('click')
    await nextTick()
    
    expect(wrapper.vm.subTableConfigs.length).toBe(1)
    
    // Change template category
    wrapper.setProps({
      info: {
        ...mockInfo,
        tplCategory: 'crud'
      }
    })
    
    await nextTick()
    
    // Check if subTableConfigs is cleared
    expect(wrapper.vm.subTableConfigs.length).toBe(0)
  })

  it('converts from multi to single mode correctly', async () => {
    // Set up multi mode with data
    const infoWithMultiConfigs = {
      tplCategory: 'sub',
      subTableName: '',
      subTableFkName: '',
      subTableNames: 'sys_user,sys_role',
      subTableFkNames: 'user_id,role_id'
    }

    const wrapperWithMultiConfigs = mount(GenInfoForm, {
      props: {
        info: infoWithMultiConfigs,
        tables: mockTables
      }
    })

    // Wait for initialization
    await nextTick()

    // Should be in multi mode
    expect(wrapperWithMultiConfigs.vm.subTableMode).toBe(2)
    
    // Switch to single mode
    wrapperWithMultiConfigs.vm.subTableMode = 1
    await wrapperWithMultiConfigs.vm.handleSubTableModeChange(1)
    await nextTick()
    
    // Check if first sub table data is populated
    expect(wrapperWithMultiConfigs.props().info.subTableName).toBe('sys_user')
    expect(wrapperWithMultiConfigs.props().info.subTableFkName).toBe('user_id')
    expect(wrapperWithMultiConfigs.vm.subTableConfigs.length).toBe(0)
  })

  it('converts from single to multi mode correctly', async () => {
    // Set up single mode with data
    const infoWithSingleConfig = {
      tplCategory: 'sub',
      subTableName: 'sys_user',
      subTableFkName: 'user_id',
      subTableNames: 'sys_user',
      subTableFkNames: 'user_id'
    }

    const wrapperWithSingleConfig = mount(GenInfoForm, {
      props: {
        info: infoWithSingleConfig,
        tables: mockTables
      }
    })

    // Wait for initialization
    await nextTick()

    // Should be in single mode
    expect(wrapperWithSingleConfig.vm.subTableMode).toBe(1)
    
    // Switch to multi mode
    wrapperWithSingleConfig.vm.subTableMode = 2
    await wrapperWithSingleConfig.vm.handleSubTableModeChange(2)
    await nextTick()
    
    // Check if subTableConfigs is initialized with single config
    expect(wrapperWithSingleConfig.vm.subTableConfigs.length).toBe(1)
    expect(wrapperWithSingleConfig.vm.subTableConfigs[0]).toEqual({
      tableName: 'sys_user',
      fkName: 'user_id',
      columns: mockTables[0].columns
    })
  })

  it('handles empty subTableNames and subTableFkNames correctly', async () => {
    const infoWithEmptyConfigs = {
      tplCategory: 'sub',
      subTableName: '',
      subTableFkName: '',
      subTableNames: '',
      subTableFkNames: ''
    }

    const wrapperWithEmptyConfigs = mount(GenInfoForm, {
      props: {
        info: infoWithEmptyConfigs,
        tables: mockTables
      }
    })

    // Wait for initialization
    await nextTick()

    // Should default to single mode when no sub table data exists
    expect(wrapperWithEmptyConfigs.vm.subTableMode).toBe(1)
  })

  it('handles partially empty subTableNames and subTableFkNames correctly', async () => {
    const infoWithPartialConfigs = {
      tplCategory: 'sub',
      subTableName: '',
      subTableFkName: '',
      subTableNames: 'sys_user,',
      subTableFkNames: 'user_id,'
    }

    const wrapperWithPartialConfigs = mount(GenInfoForm, {
      props: {
        info: infoWithPartialConfigs,
        tables: mockTables
      }
    })

    // Wait for initialization
    await nextTick()

    // Should default to single mode when only one valid sub table exists
    expect(wrapperWithPartialConfigs.vm.subTableMode).toBe(1)
  })
})