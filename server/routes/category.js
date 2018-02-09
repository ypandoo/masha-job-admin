var express = require('express')
var router = express.Router()
var Category = require('../models/category')

router.post('/add', function(req, res) {
  const url = req.body.url
  if (!url) {
    res.json({ error_code: 1, msg: 'url is empty' })
    return
  }
  const desc = req.body.desc
  if (!desc) {
    res.json({ error_code: 1, msg: 'desc is empty' })
    return
  }
  const title = req.body.title
  if (!title) {
    res.json({ error_code: 1, msg: 'title is empty' })
    return
  }

  var category = new Category({
    title: title,
    desc: desc,
    url: url
  })
  category.save()
  res.json({ error_code: 0, msg: 'success' })
})

module.exports = router
