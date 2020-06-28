var socket = io('http://localhost:3000');

var username, avatar;

$('.div-libox li').on('click', function () {
    $(this)
        .addClass('new')
        .siblings()
        .removeClass('new');
})
//当前元素滚动到底部
function scrollIntoView() {
    $('.box-bd').children(':last').get(0).scrollIntoView(false);
}
//login


$('#loginbtn').on('click', function () {
    var username = $('#username').val().trim();
    if (!username) {
        alert('请输入用户名');
        return;
    }

    var avatar = $('.div-libox li.new img').attr('src');
    if (!avatar) {
        alert('请选择头像');
        return;
    }
    console.log(username, avatar)

    socket.emit('login', {
        username,
        avatar
    })
})


socket.on('loginError', error => {
    alert(error.msg);
    return;
});
socket.on('loginSuccess', res => {
    alert('登录成功');
    $('#loginbox').fadeOut();
    $('#containerbox').fadeIn();
    $('.avatar_url').prop('src', res.data.avatar);
    $('.username').html(res.data.username);

    username = res.data.username;
    avatar = res.data.avatar;
    return;
});

// 系统提示谁谁加入群聊
socket.on('addUser', data => {
    $('.box-bd').append(`
    <div class="system">
        <p class="message_system">
          <span class="content">${data.username}加入了群聊</span>
        </p>
    </div>
    `)
})

socket.on('userList', data => {
    console.log(data, 'xxx')
    $('.user-list ul').html('');
    data.forEach(item => {
        console.log(item, 'qq')
        $('.user-list ul').append(`
    <li class="user">
          <div class="avatar"><img src=${item.avatar} alt=""></div>
          <div class="name">${item.username}</div>
        </li>
    `)
    })
    $('.len-span').text(data.length);
});


// 系统提示谁谁离开群聊
socket.on('delUser', data => {
    console.log('离开')
    $('.box-bd').append(`
    <div class="system">
        <p class="message_system">
          <span class="content">${data.username}离开了群聊</span>
        </p>
    </div>
    `)

    scrollIntoView()
})
// 聊天

$('.btn-send').on('click', () => {
    let content = $('#content').val().trim();
    $('#content').val('');
    if (!content) return alert('请输入内容');
    //send
    socket.emit('sendMessage', {
        msg: content,
        username,
        avatar
    })
})

//监听聊天消息
socket.on('receiveMessage', data => {
    if (data.username === username) {
        //my message
        $('.box-bd').append(`
        <div class="my message">
            <img class="avatar" src=${data.avatar} alt="" />
            <div class="content">
            <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
            </div>
            </div>
        </div>
        `)
    } else {
        $('.box-bd').append(`
        <div class="other message">
                  <img class="avatar" src=${data.avatar} alt="" />
                  <div class="content">
                    <div class="nickname">${data.username}</div>
                    <div class="bubble">
                      <div class="bubble_cont">${data.msg}</div>
                    </div>
                  </div>
                </div>
        `)
    }
    scrollIntoView();
    //
})

$('#file').on('change', function () {
    var file = this.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = function () {
        socket.emit('sendImage', {
            username,
            avatar,
            img: fr.result
        })
    }
})


//监听图片
socket.on('receiveImage', data => {
    if (data.username === username) {
        //my message
        $('.box-bd').append(`
        <div class="my message">
            <img class="avatar" src=${data.avatar} alt="" />
            <div class="content">
            <div class="bubble">
                <div class="bubble_cont">
                 <img src=${data.img}>
                </div>
            </div>
            </div>
        </div>
        `)
    } else {
        $('.box-bd').append(`
        <div class="other message">
                  <img class="avatar" src=${data.avatar} alt="" />
                  <div class="content">
                    <div class="nickname">${data.username}</div>
                    <div class="bubble">
                      <div class="bubble_cont">
                      <img src=${data.img}>
                      </div>
                    </div>
                  </div>
                </div>
        `)
    }
    //等待图片加载完成
    $('.box-bd img:last').on('load', function () {
        scrollIntoView();
    })
    //
})

//初始化 jquery-emoji

$('.face').on('click', function () {
    $('#content').emoji({
        button: ".face",
        showTab: false,
        animation: 'slide',
        position: 'topRight',
        icons: [{
            name: "QQ表情",
            path: "/lib/img/qq/",
            maxNum: 91,
            excludeNums: [41, 45, 54],
            file: ".gif"
        }]
    })
})



