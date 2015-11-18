/**
 * http://usejsdoc.org/
 */


var http = require('http');
var fs= require('fs');
var querystring = require('querystring');

var server = http.createServer(function(req,res){
	console.log(req);
	if(req.url =='/'){
		res.writeHead(200,{'Content-type':'text/html; charset=UTF-8'});
		fs.createReadStream('index.html').pipe(res);
		fs.createReadStream('index2.html').pipe(res);
		return;
	}else if(req.url =='/upload' && req.method =='POST'){
		var body='';
		req.on('data',function(chunk){
			console.log('get %d bytes of data', chunk.length);
			body += chunk;
		});
		req.on('end',function(chunk){
			console.log('there will be no more data');
			console.log('end'+body);
			var query =querystring.parse(body);
			console.log('name1:'+query.name1);
			console.log('name2:'+query.name2);
		});
	}
});
server.listen(3000);