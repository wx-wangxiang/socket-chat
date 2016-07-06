//定义全局变量
var BASE_DIR = __dirname,
    CONF = BASE_DIR + '/conf/',
    STATIC = BASE_DIR, /*+ '/static'*/
    CATCH_TIME = 365*24*60*60,
    mimeConf;
//require本模块需要的node.js模块
var sys = require('util'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');
mimeConf = getUrlConf(); //JSON对象
exports.getStaticFile = function (pathname, res, req){
    var extname = path.extname(pathname);
        extname = extname ? extname.slice(1) : '';
    var realPath = STATIC + pathname;
    var mimeType = mimeConf[extname] ? mimeConf[extname] : 'text/plain';
    fs.exists(realPath,function(exists){
    	if(!exists){
    		res.writeHead(404,{'Content-Type':'text/plain'});
    		res.end('Not Find!');
    	}else{
            var fileInfo = fs.statSync(realPath);
            var lastModified = fileInfo.mtime.toUTCString();
            /*判断文件是否需要缓存,是静态文件就要缓存*/
            if(mimeConf[extname]){
               var date = new Date();
               date.setTime(date.getTime() + CATCH_TIME*1000);
               res.setHeader('Expires',date.toUTCString());
               res.setHeader('Cache-Control','max-age=' + CATCH_TIME);
            }
            if(req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']){
                res.writeHead(304,'Not Modified');
                res.end();
                console.log(req.headers['if-modified-since']);
            }else{
                fs.readFile(realPath,'binary',function(err,file){
                   if(err){
                    res.writeHead(500,{'Content-Type':'text/plain'});
                    res.end(err);
                   }else{
                    res.setHeader('Last-Modified', lastModified);
                    res.writeHead(200,{'Content-Type':mimeType});
                    res.write(file,'binary');
                    res.end();
                   }
                });
            }
    	}
    });
}
function getUrlConf(){
	var routerMsg = null;
	try{
		var str = fs.readFileSync(CONF + 'mime_type.json', 'utf8');
        routerMsg = JSON.parse(str);
	}catch(e){
		sys.debug("JSON parse fails");
	}
	return routerMsg;
}