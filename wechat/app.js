const PORT = 3000;
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

server.listen(3000, () => {
    console.log('服务器启动成功 3000')
});
app.use(require('express').static('public'));
app.get('/', function (req, res) {
    res.redirect('/index.html');
})
//记录登录用户
const users = [];
// socket.emit 发送给浏览器信息
//socket.on 获取浏览器的数据 注册  等待浏览器触发
io.on('connection', function (socket) {
    console.log('新用户连接了')
    socket.on('login', data => {
        let user = users.find(item => item.username === data.username);
        if (user) {
            socket.emit('loginError', { msg: '该用户名已经登录！' })
            return;
        } else {
            users.push(data);
            //告诉当前用户
            socket.emit('loginSuccess', { data })
            //广播 用户加入
            io.emit('addUser', data);
            //广播 聊天室有多少人
            io.emit('userList', users);

            //存储用户名 头像
            socket.username = data.username;
            socket.avatar = data.avatar;
            return;
        }
    })
    socket.on('disconnect', () => {
        //断开连接
        let idx = users.findIndex(item => item.username === socket.usernmae);
        //删除断开连接的人
        users.splice(idx, 1);
        io.emit('delUser', {
            username: socket.username,
            avatar: socket.avatar
        });
        io.emit('userList', users);
    });

    socket.on('sendMessage', data => {
        io.emit('receiveMessage', data);
    });
    //接受图片信息
    socket.on('sendImage', data => {
        io.emit('receiveImage', data);
    })


})




// 每次只要有用户连接 函数就会被执行 会给当前连接的用户创建一个connect对象;