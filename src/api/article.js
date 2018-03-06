import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/article/list',
    method: 'post',
    data
  })
}

export function fetchArticle(data) {
  return request({
    url: '/article/findOne',
    method: 'post',
    data
  })
}

export function createArticle(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/article/delete',
    method: 'post',
    data
  })
}
