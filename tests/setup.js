import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Mock global objects
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}

// Mock window and document
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock Element Plus icons
vi.mock('@element-plus/icons-vue', () => ({
  Delete: {
    name: 'Delete',
    render: () => {}
  },
  QuestionFilled: {
    name: 'QuestionFilled',
    render: () => {}
  }
}))

// Set up Pinia for tests
const pinia = createPinia()
setActivePinia(pinia)

// Set global config for Vue Test Utils
config.global.mocks = {
  $t: (msg) => msg,
  $tab: {
    closeOpenPage: vi.fn()
  },
  $modal: {
    msgSuccess: vi.fn(),
    msgError: vi.fn()
  }
}

config.global.plugins = [pinia]

config.global.stubs = {
  'el-form': {
    template: '<form><slot></slot></form>'
  },
  'el-row': {
    template: '<div><slot></slot></div>'
  },
  'el-col': {
    template: '<div><slot></slot></div>'
  },
  'el-form-item': {
    template: '<div><slot></slot></div>'
  },
  'el-select': {
    template: '<select><slot></slot></select>'
  },
  'el-option': {
    template: '<option><slot></slot></option>',
    props: ['label', 'value']
  },
  'el-input': {
    template: '<input />'
  },
  'el-button': {
    template: '<button><slot></slot></button>',
    props: ['type']
  },
  'el-table': {
    template: '<table><slot></slot></table>',
    props: ['data']
  },
  'el-table-column': {
    template: '<td><slot></slot></td>',
    props: ['label', 'prop']
  },
  'el-divider': {
    template: '<hr />'
  },
  'el-radio-group': {
    template: '<div><slot></slot></div>',
    props: ['modelValue']
  },
  'el-radio': {
    template: '<label><input type="radio" /><slot></slot></label>',
    props: ['label']
  }
}