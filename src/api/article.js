import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:3000/article/list',
    method: 'post',
    params: query
  })
}

export function fetchArticle(query) {
  return request({
    url: 'http://localhost:3000/article/findOne',
    method: 'post',
    params: query
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: 'http://localhost:3000/article/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'http://localhost:3000/article/update',
    method: 'post',
    data
  })
}
