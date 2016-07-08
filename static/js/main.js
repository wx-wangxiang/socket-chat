require(['avalon', 'jquery', 'bootjs', 'socket', 'scrollbar'], function(avalon, $) {
var vm, 
	Socket,
	socket = io.connect('http://192.168.7.205:1337'),
	Navbar,
	Scrollbar;

	vm = avalon.define({
		$id: 'socketChat',
		tip: '',
		userNum: '0',
		userName: '',
		userOnlineList: [],
		message: '',
		messageList: [
		/*{
			message: '很高兴遇到你！',
			userName: 'wang'
		},
		{
			message: 'hello nice to meet you too!',
			userName: 'xiang'
		},
		{
			message: 'O(∩_∩)O哈哈~',
			userName: 'wang'
		}*/],
		login: function() {
			Navbar.login();
		},
		sendName: function(e) {
			e.preventDefault();
			Modal.submit();
		},
		sendMessage: function(e) {
			e.preventDefault();
			Comment.send();
			console.log(vm.message);
		},
		state: {
			submitStateText: '',
			submitState: '1'
		}
	});
/*--------------------------------------导航条----------------------------------*/
	Navbar = {
		login: function() {
			Modal.show();
		}
	};
/*---------------------------------------弹出框----------------------------------*/
	Modal = {
		submit: function() {
			var _this = this,
				ID = Math.random().toString().replace('.', '_');
			socket.emit('users', {'userName': vm.userName, 'id': ID}, function (data) {
				vm.state.submitStateText = data.message;
				vm.state.submitState = data.state;
				vm.tip = data.message;
				console.log(vm.userOnlineList);
				if(data.state) {
					setTimeout(function() {
						Modal.hide();
					}, 500);
				}else{
					return false;
				}
				vm.userOnlineList = data.userOnlineList;
				vm.userNum = data.userNum;
			});
			Socket.init();
		},
		hide: function() {
			$('#loginModal').modal('hide');
		},
		show: function() {
			$('#loginModal').modal('show');
		}
	}
/*----------------------------------------聊天窗口--------------------------------------*/
	Comment = {
		send: function() {
			socket.emit('msg', {message: vm.message, userName: vm.userName, method: 'req'}, function (data) {
				vm.messageList.push({
					message: data.message,
					userName: data.user.userName,
					avatar: data.user.avatar
				});
				console.log(data.message);
			} )
		}
	}
/*-------------------------------------------socket------------------------------*/
	Socket = {
		init: function() {
	        socket.on('users', function (data) {
	            vm.userNum = data.userNum;
	            vm.userOnlineList = data.userOnlineList;
	        });
	        socket.on('msg', function (data) {
	        	if(data.method == 'res') {
	        		vm.messageList.push({
	        			message: data.message,
	        			userName: data.user.userName,
	        			avatar: data.user.avatar
	        		});
	        	}
	        })
		}
	}
/*------------------------------------------滚动条-------------------------------*/
	Scrollbar = {
		init: function() {
			$('#scrollbar').tinyscrollbar();
		}
	}
	Scrollbar.init();
	Modal.show();
	avalon.scan();
})