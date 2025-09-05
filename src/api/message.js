import request from '@/utils/request'

// 查询未读消息列表
export function listUnreadMessages(query) {
  return request({
    url: '/unreadMessage/list',
    method: 'get',
    params: query,
  })
}

// 标记消息为已读
export function markMessageAsRead(messageId) {
  return request({
    url: '/unreadMessage/read/' + messageId,
    method: 'put',
  })
}

// 批量标记消息为已读
export function batchMarkMessagesAsRead(messageIds) {
  return request({
    url: '/unreadMessage/read',
    method: 'put',
    data: messageIds,
  })
}

// 删除消息
export function deleteMessage(messageId) {
  return request({
    url: '/unreadMessage/' + messageId,
    method: 'delete',
  })
}

// 批量删除消息
export function batchDeleteMessages(messageIds) {
  return request({
    url: '/unreadMessage',
    method: 'delete',
    data: messageIds,
  })
}
