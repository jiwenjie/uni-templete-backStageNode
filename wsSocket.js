/*
 * @Author: jiwenjie5 
 * @Date: 2021-04-Th 03:35:29 
 * @Last Modified by:   jiwenjie5 
 * @Last Modified time: 2021-04-Th 03:35:29 
 * 开启后台 socket 服务相关代码
 */

const url = require('url');
const ws = require('ws');
const Cookies = require('cookies');
// webSocker 对象信息
const WebSocketServer = ws.Server;

function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}

/** ------------------------------------------------------------ 后台 webSocket 服务相关代码 start ------------------------------------------------------------ **/
function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    console.log('create webSocketServer')
    let wss = new WebSocketServer({
        server: server
    });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    };
    onMessage = onMessage || function (msg) {
        console.log('[WebSocket] message received: ' + msg);
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err) {
        console.log('[WebSocket] error: ' + err);
    };
    wss.on('connection', function (ws) {
        console.log('serve webSocket connection', ws.upgradeReq.url);
        let location = url.parse(ws.upgradeReq.url, true);
        console.log('[WebSocketServer] connection: ' + location.href);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        // 对前端的长连接地址进行判断，如果不对则直接报错并关闭 socket
        if (location.pathname !== '/ws/chat') {
            // close ws:
            ws.close(4000, 'Invalid URL');
        }
        // check user: 这里做了用户判断，因为是根据 cookie 实现，所以在实际测试的时候需要同时开启多个浏览器测试，如果自己普通调用则可以删除修改该逻辑
        let user = parseUser(ws.upgradeReq);
        if (!user) {
            ws.close(4001, 'Invalid user');
        }
        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);
    });
    console.log('WebSocketServer was attached.');
    return wss;
}

var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function onConnect() {
    let user = this.user;
    let msg = createMessage('join', user, `${user.name} joined.`);
    this.wss.broadcast(msg);
    // build user list:
    let users = this.wss.clients.map(function (client) {
        return client.user;
    });
    this.send(createMessage('list', user, users));
}

function onMessage(message) {
    console.log(message);
    if (message && message.trim()) {
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);
    }
}

function onClose() {
    let user = this.user;
    let msg = createMessage('left', user, `${user.name} is left.`);
    this.wss.broadcast(msg);
}

/** ------------------------------------------------------------ 后台 webSocket 服务相关代码 end ------------------------------------------------------------ **/
module.exports = {
    /**
     * 后台开启 webSocket 的方法
     * @param {*} app koa 的实例化对象
     * serve：后台启动的监听端口服务返回
     */
    initWss(app, server) {
        console.log('init webSocket')
        // parse user from cookie:
        app.use(async (ctx, next) => {
            ctx.state.user = parseUser(ctx.cookies.get('name') || '');
            await next();
        });
        app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);
    }
}

// 前端实现长连接示例
// var ws = new WebSocket('ws://localhost:3000/ws/chat');

// ws.onmessage = function(event) {
//     var data = event.data;
//     console.log(data);
//     var msg = JSON.parse(data);
//     if (msg.type === 'list') {
//         vmUserList.users = msg.data;
//     } else if (msg.type === 'join') {
//         addToUserList(vmUserList.users, msg.user);
//         addMessage(vmMessageList.messages, msg);
//     } else if (msg.type === 'left') {
//         removeFromUserList(vmUserList.users, msg.user);
//         addMessage(vmMessageList.messages, msg);
//     } else if (msg.type === 'chat') {
//         addMessage(vmMessageList.messages, msg);
//     }
// };