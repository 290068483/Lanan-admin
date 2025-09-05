import request from '@/utils/request'

export const getMyTask = (userId) => {
  return request({
    url: '/task/getMyTask',
    method: 'get',
    params: {
      userId: userId
    }
  })
}