const express = require('express')
const app = express()
// 通过gzip减小文件体积,使传输速度更快
const compression = require('compression')
// 3.启用中间件
app.use(compression())
app.use(express.static('./dist'))
app.listen(3000, () => {
    console.log('server runing at http://127.0.0.1:3000')
})