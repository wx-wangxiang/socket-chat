require(['avalon', 'jquery', 'bootjs', 'socket', 'scrollbar'], function(avalon, $) {
var vm, 
	Socket,
	socket = io.connect('http://127.0.0.1:1337'),
	Navbar,
	Scrollbar;

	vm = avalon.define({
		$id: 'socketChat',
		tip: '',
		userNum: '0',
		userName: '',
		userOnlineList: [],
		messageList: [
		{
			message: '很高兴遇到你！',
			position: 'left'
		},
		{
			message: 'hello nice to meet you too!',
			position: 'right'
		}],
		login: function() {
			Navbar.login();
		},
		send: function(e) {
			e.preventDefault();
			Modal.submit();
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
/*-------------------------------------------socket------------------------------*/
	Socket = {
		init: function() {
	        socket.on('users', function(data) {
	            vm.userNum = data.userNum;
	            vm.userOnlineList = data.userOnlineList;
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
	avalon.scan();
})