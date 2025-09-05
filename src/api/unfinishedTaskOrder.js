import request from '@/utils/request'

// 查询未完工任务单列表
export function listUnfinishedTaskOrders(query) {
  return request({
    url: '/unfinishedTaskOrder/list',
    method: 'get',
    params: query,
  })
}

// 查询未完工任务单详细
export function getUnfinishedTaskOrder(taskId) {
  return request({
    url: '/unfinishedTaskOrder/' + taskId,
    method: 'get',
  })
}

// 新增未完工任务单
export function addUnfinishedTaskOrder(data) {
  return request({
    url: '/unfinishedTaskOrder',
    method: 'post',
    data: data,
  })
}

// 修改未完工任务单
export function updateUnfinishedTaskOrder(data) {
  return request({
    url: '/unfinishedTaskOrder',
    method: 'put',
    data: data,
  })
}

// 删除未完工任务单
export function delUnfinishedTaskOrder(taskId) {
  return request({
    url: '/unfinishedTaskOrder/' + taskId,
    method: 'delete',
  })
}

// 导出未完工任务单
export function exportUnfinishedTaskOrder(query) {
  return request({
    url: '/unfinishedTaskOrder/export',
    method: 'get',
    params: query,
  })
}
