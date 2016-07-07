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
	userOnlineList: [],//{userName: '', id: ''}
	init: function() {
		var _this = this;
		io = require('socket.io').listen(server, {'log': false});
		io.sockets.on('connection', function (socket) {
			socket.on('users', function(data, callback) {

				var enable = _this.userOnlineList.every(function(item, index) {
					if(item.userName != data.userName) {
						return true;
					}
				});

				if(enable) {
					console.log(data);
					_this.userOnlineList.push(data);
					socket.name = data.userName;
					_this.userNum++;
					callback({message: '登录成功', state: 1, userNum: _this.userNum, userOnlineList: _this.userOnlineList});
					socket.broadcast.emit('users', {userNum: _this.userNum, userName: data.userName, userOnlineList: _this.userOnlineList});
				}else{
					callback({message: '该昵称已存在', state: 0, userNum: '--'});
				}
			});
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
