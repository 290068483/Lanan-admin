import request from '@/utils/request'

// 查询客户信息（存储客户核心基础信息）列表
export function listInfo(query) {
  return request({
    url: '/custom_info/info/list',
    method: 'get',
    params: query
  })
}

// 查询客户信息（存储客户核心基础信息）详细
export function getInfo(id) {
  return request({
    url: '/custom_info/info/' + id,
    method: 'get'
  })
}

// 新增客户信息（存储客户核心基础信息）
export function addInfo(data) {
  return request({
    url: '/custom_info/info',
    method: 'post',
    data: data
  })
}

// 修改客户信息（存储客户核心基础信息）
export function updateInfo(data) {
  return request({
    url: '/custom_info/info',
    method: 'put',
    data: data
  })
}

// 删除客户信息（存储客户核心基础信息）
export function delInfo(id) {
  return request({
    url: '/custom_info/info/' + id,
    method: 'delete'
  })
}
