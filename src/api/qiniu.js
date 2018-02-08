import request from '@/utils/request'

export function getToken() {
  return request({
    url: 'http://localhost:3000/getToken', // 假地址 自行替换
    method: 'get'
  })
}
