const fs = require('fs')
const { mongo_url } = JSON.parse(fs.readFileSync('./config.json'))
const mongoose = require('mongoose')
    mongoose.connect(mongo_url)
  .then(() => console.log('Connected!'));
