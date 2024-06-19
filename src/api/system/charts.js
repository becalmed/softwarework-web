import request from '@/utils/request'



export function get(id) {
  return request({
    url: 'api/activity/charts?id=' + id,
    method: 'get'
  })
}

export default { get}
