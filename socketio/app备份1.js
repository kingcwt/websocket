const http = require('http');
const app = http.createServer();
let fs = require('fs');
app.listen(3000, () => {
    console.log('服务器启动成功 3000')
});

app.on('request', (req, res) => {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('ERROR LOADING INDEX.HTML');
        }
        res.writeHead(200);
        res.end(data);
    })
})

let io = require('socket.io')(app);
// socket.emit 发送给浏览器信息
//socket.on 获取浏览器的数据 注册  等待浏览器触发
io.on('connection', function (socket) {
    socket.emit('send', { hello: 'world' }) // send 对应
    socket.on('hehe', function (data) {  // hehe 对应
        console.log(data,'xxx')
    })
})