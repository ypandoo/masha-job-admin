import request from '@/utils/request'

export function addCompany(data) {
  return request({
    url: '/company/add',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/company/list',
    method: 'post',
    data
  })
}


