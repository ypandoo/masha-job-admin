import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: 'http://localhost:3000/article/list',
    method: 'post',
    data
  })
}

export function fetchArticle(data) {
  return request({
    url: 'http://localhost:3000/article/findOne',
    method: 'post',
    data
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

export function deleteArticle(data) {
  return request({
    url: 'http://localhost:3000/article/delete',
    method: 'post',
    data
  })
}
