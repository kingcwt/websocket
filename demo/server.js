const ws = require('nodejs-websocket');
const PORT = 3000;
let count = 0;

const TYPE_ENTER = 0;
const TYPE_LEAVE = 1;
const TYPE_MSG = 2;


const server = ws.createServer(connect => {
    console.log('有用户连接上来了')
    count++;
    connect.userName = `用户${count}`
    //1 告诉所有用户 有人加入了聊天室
    broadcast({
        type: TYPE_ENTER,
        msg: `${connect.userName}进入聊天室`,
        time:new Date().toLocaleTimeString()
    })

    connect.on('text', data => {
        broadcast({
            type:TYPE_MSG,
            msg:`${connect.userName} : ${data}`,
            time:new Date().toLocaleTimeString()
        })
    });

    connect.on('close', () => {
        broadcast({
            type:TYPE_LEAVE,
            msg:`${connect.userName}离开聊天室`,
            time:new Date().toLocaleTimeString()
        })
    });

    // 注册一个error 处理用户错误信息
    connect.on('error', () => {
        console.log('用户连接异常');
    })
});



//广播 给所有用户发送消息

function broadcast(msg) {
    //server.connections:所有用户
    server.connections.forEach(item => {
        item.send(JSON.stringify(msg))
    })
}



server.listen(PORT, () => {
    console.log('服务启动成功 端口=' + PORT);
})