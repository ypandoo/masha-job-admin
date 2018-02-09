var mongoose = require('mongoose')

var Schema = mongoose.Schema
var timestamps = require('mongoose-timestamp')

// Define User schema
var _Category = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  desc: String,
  url: String
})

_Category.plugin(timestamps)

// export them
module.exports = mongoose.model('Category', _Category)
