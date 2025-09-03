import { describe, it, expect, vi } from 'vitest'

// 模拟 Vue 的路由和组件实例
const mockRoute = {
  query: {},
  params: {}
}

const mockProxy = {
  $tab: {
    closeOpenPage: vi.fn()
  }
}

// 模拟 editTable.vue 中的 close 方法逻辑
function closeEditTable(route, proxy) {
  // 优化：确保正确传递所有分页参数，避免重复请求
  // 如果没有分页参数，则使用默认值
  const pageNum = route.query.pageNum ? Number(route.query.pageNum) : 1
  const pageSize = route.query.pageSize ? Number(route.query.pageSize) : 10
  
  const obj = { 
    path: "/tool/gen", 
    query: { 
      t: Date.now(), 
      pageNum: pageNum,
      pageSize: pageSize
    } 
  }
  return proxy.$tab.closeOpenPage(obj)
}

// 模拟 index.vue 中的 handleEditTable 方法逻辑
function handleEditTable(queryParams, proxy) {
  // 修复：确保传递完整的分页参数，如果没有则使用默认值
  const params = { 
    pageNum: queryParams.pageNum || 1,
    pageSize: queryParams.pageSize || 10
  }
  return proxy.$tab.openPage("修改[测试表]生成配置", '/tool/gen-edit/index/1', params)
}

describe('Pagination Parameter Handling', () => {
  it('should use default values when no pagination parameters are provided', () => {
    // 测试 editTable.vue 的 close 方法
    const route = { query: {} }
    const proxy = { $tab: { closeOpenPage: vi.fn() } }
    
    closeEditTable(route, proxy)
    
    expect(proxy.$tab.closeOpenPage).toHaveBeenCalledWith({
      path: "/tool/gen",
      query: {
        t: expect.any(Number),
        pageNum: 1,
        pageSize: 10
      }
    })
  })

  it('should use provided pagination parameters when available', () => {
    // 测试 editTable.vue 的 close 方法
    const route = { query: { pageNum: 2, pageSize: 20 } }
    const proxy = { $tab: { closeOpenPage: vi.fn() } }
    
    closeEditTable(route, proxy)
    
    expect(proxy.$tab.closeOpenPage).toHaveBeenCalledWith({
      path: "/tool/gen",
      query: {
        t: expect.any(Number),
        pageNum: 2,
        pageSize: 20
      }
    })
  })

  it('should handle index.vue handleEditTable with default values', () => {
    // 测试 index.vue 的 handleEditTable 方法
    const queryParams = {}
    const proxy = { $tab: { openPage: vi.fn() } }
    
    handleEditTable(queryParams, proxy)
    
    expect(proxy.$tab.openPage).toHaveBeenCalledWith(
      "修改[测试表]生成配置",
      '/tool/gen-edit/index/1',
      {
        pageNum: 1,
        pageSize: 10
      }
    )
  })

  it('should handle index.vue handleEditTable with provided values', () => {
    // 测试 index.vue 的 handleEditTable 方法
    const queryParams = { pageNum: 3, pageSize: 30 }
    const proxy = { $tab: { openPage: vi.fn() } }
    
    handleEditTable(queryParams, proxy)
    
    expect(proxy.$tab.openPage).toHaveBeenCalledWith(
      "修改[测试表]生成配置",
      '/tool/gen-edit/index/1',
      {
        pageNum: 3,
        pageSize: 30
      }
    )
  })
})