import request from '@/utils/request'

// 查询客户详情（存储客户补充信息）列表
export function listDetail(query) {
  return request({
    url: '/custom_detail/detail/list',
    method: 'get',
    params: query
  })
}

// 查询客户详情（存储客户补充信息）详细
export function getDetail(id) {
  return request({
    url: '/custom_detail/detail/' + id,
    method: 'get'
  })
}

// 新增客户详情（存储客户补充信息）
export function addDetail(data) {
  return request({
    url: '/custom_detail/detail',
    method: 'post',
    data: data
  })
}

// 修改客户详情（存储客户补充信息）
export function updateDetail(data) {
  return request({
    url: '/custom_detail/detail',
    method: 'put',
    data: data
  })
}

// 删除客户详情（存储客户补充信息）
export function delDetail(id) {
  return request({
    url: '/custom_detail/detail/' + id,
    method: 'delete'
  })
}
