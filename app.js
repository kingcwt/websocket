const ws = require('nodejs-websocket');
const PORT = 3000;


// 每次只要有用户连接 函数就会被执行 会给当前连接的用户创建一个connect对象
const server = ws.createServer(connect=>{
    console.log('有用户连接上来了')
    //每当接受到用户传递过来的数据 这个text事件就会被触发
    connect.on('text',data=>{
        console.log('接受用户的数据',data);

        //对用户传过来的数据 把小写转大写 并且拼接一点内容
        connect.send(data+'ok!');
    });

    //  只要websocket连接断开了 close事件就会触发
    connect.on('close',()=>{
        console.log('连接断开了～')
    });

    // 注册一个error 处理用户错误信息
    connect.on('error',()=>{
        console.log('用户连接异常');
    })
});




server.listen(PORT,()=>{
    console.log('服务启动成功 端口='+PORT);
})