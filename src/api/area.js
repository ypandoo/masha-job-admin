import request from '@/utils/request'

export function addArea(data) {
  return request({
    url: '/area/add',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/area/list',
    method: 'post',
    data
  })
}


