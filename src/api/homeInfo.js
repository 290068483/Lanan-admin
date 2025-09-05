import request from '@/utils/request'

// export const getMyTask = (userId) => {
//   return request({
//     url: '/task/getMyTask',
//     method: 'get',
//     params: {
//       userId: userId
//     }
//   })
// }

// 查询待处理事件列表
export function listPendingEvents(query) {
  return request({
    url: '/pendingEvents/list',
    method: 'get',
    params: query
  })
}