import request from '@/utils/request'

export function addPosition(data) {
  return request({
    url: '/position/add',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/position/list',
    method: 'post',
    data
  })
}


