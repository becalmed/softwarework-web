import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/activity',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/activity/',
    method: 'delete',
    data: ids
  })
}
export function get(id) {
  return request({
    url: 'api/activity/get?id='+id,
    method: 'get',
  })
}

export function edit(data) {
  return request({
    url: 'api/activity',
    method: 'put',
    data
  })
}

export default { add, edit, del ,get}
