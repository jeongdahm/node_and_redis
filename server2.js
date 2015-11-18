/**
 * http://usejsdoc.org/
 */
var http= require('http');
var fs = require('fs');
var server = http.createServer(function(req,res){
	console.log('req'+req.url);
	
	if(req.url=='/'){
		res.writeHead(200,{'Content-type':'text/html;charset=UTF-8'});
		fs.createReadStream('index.html').pipe(res);
		return;
	}
	
	var path= __dirname + req.url;
	fs.exists(path, function(exist){
		if(exist){
			res.writeHead(200,{'Content-type':'image/*'});
			fs.createReadStream(path).pipe(res);
		}else{
			res.statusCode = 404;
			res.end('not found');
		}
		
	});
});
server.listen(3000);