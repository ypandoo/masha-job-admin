var express = require('express')
var router = express.Router()
const qiniu = require('qiniu')
const uuidV1 = require('uuid/v1')

router.get('/getToken', function(req, res) {
  var accessKey = '1lSgFC2W5FS4fVr4u0pLgm4JmUIbAYiOEaAVbUdS'
  var secretKey = 'IqEjro62qfpv3SZ1LtFmT4i-80hRXpfpJZ6dt6nt'
  var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  var bucket = 'pyonex2'
  var uid = uuidV1()

  // 简单上传凭证
  var options = {
    scope: `${bucket}:${uid}`
  }

  var putPolicy = new qiniu.rs.PutPolicy(options)
  var uploadToken = putPolicy.uploadToken(mac)

  res.json({ 'qiniu_token': uploadToken, 'qiniu_key': uid, 'qiniu_url': 'p3rsb7zg2.bkt.clouddn.com/' + uid })
})

module.exports = router
