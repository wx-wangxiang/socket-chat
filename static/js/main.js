require(['avalon', 'jquery', 'bootjs', 'socket'], function(avalon, $) {
var vm, 
		Socket,
		socket = io.connect('http://127.0.0.1:1337'),
		Navbar;

	vm = avalon.define({
		$id: 'socketChat',
		tip: '',
		userNum: '',
		userName: '',
		userOnlineList: [],
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

	Navbar = {
		login: function() {
			Modal.show();
		}
	};

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

	Socket = {
		init: function() {
			/*socket.on('msg', function(data) {
				vm.state.submitStateText = data.message;
				vm.state.submitState = data.state;
        vm.tip = data.message;
        if(data.state) {
					setTimeout(function() {
						Modal.hide();
					}, 500);
				}else{
					return false;
				}
        vm.userNum = data.userNum;
      });*/
      socket.on('users', function(data) {
        vm.userNum = data.userNum;
        vm.userOnlineList = data.userOnlineList;
      })
		}
	}

	//Socket.init();
	avalon.scan();
})