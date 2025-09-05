import request from '@/utils/request'

// 查询未完工客户单列表
export function listUnfinishedCustomerOrders(query) {
  return request({
    url: '/unfinishedCustomerOrder/list',
    method: 'get',
    params: query,
  })
}

// 查询未完工客户单详细
export function getUnfinishedCustomerOrder(orderId) {
  return request({
    url: '/unfinishedCustomerOrder/' + orderId,
    method: 'get',
  })
}

// 新增未完工客户单
export function addUnfinishedCustomerOrder(data) {
  return request({
    url: '/unfinishedCustomerOrder',
    method: 'post',
    data: data,
  })
}

// 修改未完工客户单
export function updateUnfinishedCustomerOrder(data) {
  return request({
    url: '/unfinishedCustomerOrder',
    method: 'put',
    data: data,
  })
}

// 删除未完工客户单
export function delUnfinishedCustomerOrder(orderId) {
  return request({
    url: '/unfinishedCustomerOrder/' + orderId,
    method: 'delete',
  })
}

// 导出未完工客户单
export function exportUnfinishedCustomerOrder(query) {
  return request({
    url: '/unfinishedCustomerOrder/export',
    method: 'get',
    params: query,
  })
}
