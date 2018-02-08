import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'http://localhost:3000/user/login/',
    //url: 'login/login/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'http://localhost:3000/user/info/',
    //url: '/user/info',
    method: 'get',
    params: { token }
  })
}

