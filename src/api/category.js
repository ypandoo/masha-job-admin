import request from '@/utils/request'

export function addCategory(data) {
  return request({
    url: '/category/add',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/category/list',
    method: 'post',
    data
  })
}

export function fetchCategory(data) {
  return request({
    url: '/category/findOne',
    method: 'post',
    data
  })
}

export function showCategory(data) {
  return request({
    url: '/category/show',
    method: 'post',
    data
  })
}
