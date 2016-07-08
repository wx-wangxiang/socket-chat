var http = require('http');
var fs = require('fs');
var url = require('url');
var staticModule = require('./static_module');
var io;

var server = http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	switch(pathname) {
		case '/':
		case 'index': goIndex(req, res);
		break;
		default: staticModule.getStaticFile(pathname, res, req);
	}
}).listen(1337, "127.0.0.1");
console.log('Server running at port:1337');

var IO = {
	userNum: 0,
	avatars: ['/static/images/avatars/avatar1.gif', '/static/images/avatars/avatar2.jpg', '/static/images/avatars/default.png'],
	userOnlineList: [],//{userName: '', id: '', avatar: ''}
	init: function() {
		var _this = this;
		io = require('socket.io').listen(server, {'log': false});
		io.sockets.on('connection', function (socket) {
			socket.on('users', function (data, callback) {
				/*昵称的唯一性处理*/
				var enable = _this.userOnlineList.every(function (item, index) {
					if(item.userName != data.userName) {
						return true;
					}
				});

				if(enable) {
					/*给每个用户添加头像信息,暂时先简单处理,以后可以在客户端增加头像上传功能*/
					if(_this.userOnlineList.length < 3) {
						data.avatar = _this.avatars[_this.userOnlineList.length];
					}else{
						data.avatar = '/static/images/avatars/default.png';
					}
					if(data.userName == '') {
						data.userName = '这家伙很懒，名字都没写!';
					}
					_this.userOnlineList.push(data);
					socket.name = data.userName;
					_this.userNum++;
					console.log(data);
					/*登陆成功后界面显示的信息*/
					callback({message: '登录成功', state: 1, userNum: _this.userNum, userOnlineList: _this.userOnlineList});
					socket.broadcast.emit('users', {userNum: _this.userNum, userName: data.userName, userOnlineList: _this.userOnlineList});
				}else{
					callback({message: '该昵称已存在', state: 0, userNum: '--'});
				}
			});
			socket.on('msg', function (data, callback) {
				var userObj = null;
				/*找到该用户名对应的用户的信息*/
				_this.userOnlineList.forEach(function(item, index) {
					if(data.userName == item.userName) {
						userObj = item;
					}
				})
				console.log('currentUser:' + userObj);
				callback({message: data.message, user: userObj});
				socket.broadcast.emit('msg', {message: data.message, user: userObj, method: 'res'});
			})
			socket.on('disconnect', function () {
				_this.userOnlineList.forEach(function(item, index) {
					if(item.userName == socket.name) {
						_this.userNum--;
						console.log('退出后的总人数：' + _this.userNum);
						console.log('退出的人是：' + socket.name);
						_this.userOnlineList.splice(index, 1);
						socket.broadcast.emit('users', {userNum: _this.userNum, userName: socket.name, userOnlineList: _this.userOnlineList});
					}
				})
			});
		});
	}
}

IO.init();

function goIndex(req, res) {
	var readPath = __dirname + '/views/' + url.parse('index.html').pathname;
	var page = fs.readFileSync(readPath);
	res.writeHead(200, {'Content-Type': 'text/html;charset="utf-8"'});
	res.end(page);
}
