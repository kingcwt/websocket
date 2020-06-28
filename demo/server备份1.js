const ws = require('nodejs-websocket');
const PORT = 3000;
// 记录当前连接上来的在总的用户数量
let count = 0;

// 每次只要有用户连接 函数就会被执行 会给当前连接的用户创建一个connect对象
const server = ws.createServer(connect=>{
    console.log('有用户连接上来了')
    count++;
    connect.userName=`用户${count}`
    //1 告诉所有用户 有人加入了聊天室
    broadcast(`${connect.userName}进入聊天室`)

    //每当接受到用户传递过来的数据 这个text事件就会被触发
    connect.on('text',data=>{
        // 告诉所有用户 消息内容

        //对用户传过来的数据 把小写转大写 并且拼接一点内容
        broadcast(data)
    });

    //  只要websocket连接断开了 close事件就会触发
    connect.on('close',()=>{
        console.log('关闭连接')
        // 3 告诉所有用户 离开聊天室
        broadcast(`${connect.userName}离开聊天室`)
    });

    // 注册一个error 处理用户错误信息
    connect.on('error',()=>{
        console.log('用户连接异常');
    })
});



//广播 给所有用户发送消息

function broadcast(msg) {
    //server.connections:所有用户
    server.connections.forEach(item=>{
        item.send(msg)
    })
  }



server.listen(PORT,()=>{
    console.log('服务启动成功 端口='+PORT);
})