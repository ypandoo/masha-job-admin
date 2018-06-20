import request from '@/utils/request'

export function addJob(data) {
  return request({
    url: '/job/add',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/job/list',
    method: 'post',
    data
  })
}

export function deleteJob(data) {
  return request({
    url: '/job/delete',
    method: 'post',
    data
  })
}



