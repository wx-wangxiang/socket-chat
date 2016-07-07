require.config({
	map: {
		'*': {'css': 'http://static.uc108.com/cdn/require-css/0.1.8/css.min.js'}
	},
	paths: {
		'jquery': 'http://static.uc108.com/cdn/jquery/1.11.1/jquery',
		'avalon': 'http://static.uc108.com/cdn/avalon/1.5.5/avalon.shim.min',
		'bootjs': 'http://static.uc108.com/cdn/bootstrap/3.3.5/js/bootstrap.min',
		'socket': '/socket.io/socket.io',
		'datepicker':'http://static.uc108.com/cdn/bootstrap-datetimepicker/3.0.0/js/bootstrap-datetimepicker.min',
		'datepicker-zh-CN':'http://static.uc108.com/cdn/bootstrap-datetimepicker/3.0.0/js/locales/bootstrap-datetimepicker.zh-CN',
		'page':'http://static.uc108.com/cdn/bootstrap-page/1.0.0/page.min',
		'scrollbar': '/static/lib/jquery.tinyscrollbar'
	},
	shim: {
		'bootjs': ['jquery'],
		'datepicker': ['jquery', 'bootjs', 'css!http://static.uc108.com/cdn/bootstrap-datetimepicker/3.0.0/css/bootstrap-datetimepicker.min.css'],
		'datepicker-zh-CN': ['datepicker'],
		'page': ['jquery'],
		'scrollbar': ['jquery']
	}
})