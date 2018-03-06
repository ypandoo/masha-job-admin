import request from '@/utils/request'

export function getToken(data) {
  return request({
    url: '/getToken', 
    method: 'post',
    data
  })
}

export function getTokenNoName() {
  return request({
    url: '/getTokenNoName', 
    method: 'post'
  })
}

export function upload(data) {
  return request({
    url: 'http://upload.qiniup.com/', 
    method: 'post',
    data: data,
    config: { headers: {'Content-Type': 'multipart/form-data' }}
  })
}


