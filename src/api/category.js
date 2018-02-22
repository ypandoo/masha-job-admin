import request from '@/utils/request'

export function addCategory(data) {
  return request({
    url: 'http://localhost:3000/category/add',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: 'http://localhost:3000/category/update',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: 'http://localhost:3000/category/list',
    method: 'post',
    data
  })
}

export function fetchCategory(data) {
  return request({
    url: 'http://localhost:3000/category/findOne',
    method: 'post',
    data
  })
}
