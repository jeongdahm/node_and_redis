/**
 * http://usejsdoc.org/
 */

/*var  url =require('url');
var urlStr = 'http://idols.com/q?group=EXID&name=하니&since=';
var parsed= url.parse(urlStr,true);
console.log(parsed);
console.log('===========url parsing=============');
console.log('protocol:'+parsed['protocol']);
console.log('protocol:'+parsed.protocol);
console.log('host:'+parsed.host);
console.log('q.group:'+parsed.query.grou);





var querystring = require('querystring');
var str= parsed.search;
var parsed2 = querystring.parse(str);

console.log(parsed2);

var str2 = 'group=걸스데이&member=he&member=yu&member=min';
var  parsed3 = querystring.parse(str2);
console.log(parsed3);
var members = parsed3.member;
console.log('members:'+members);

for(var i=0 ; i <members.length ; i++){
	console.log('i:'+members[i]);
}
*/
var fs = require('fs');
var path = './images/cat.jpg';

var http = require('http');
var server = http.createServer(function(req,res){
	
	console.log('ver'+req.httpVersion);
	console.log('method'+req.method);
	console.log('url'+req.url);
	console.log('----------headers------------');
	console.log(req.headers);
	
	if(req.url =='/image'){
		fs.readFile(path,function(err,data){
			if(err){
				res.statusCode=404;
				res.end('can not find resourse');
			}else{
				
				res.statusCode=200;
				res.setHeader('Content-Type','image/jpg');
				res.end(data);
			}
		});
	
	}else if(req.url =='/google'){
		res.writeHead(302, {'Location':'http://google.com'});
		res.end();
	
	}else{
		var body='<html>';
		body += '<body>';
		body += '<h1> hello world 444444</h1>';
		body += '</body>';
		body += '</html>';
		res.statusCode= 200;
		res.statusMessage='OK';
		res.setHeader('Content-Type',"text/html; charset=UTF-8");
		res.setHeader('Content-Length',body.length);
		
//		res.writeHead(200, {
//			'Content-Type':'text/plain',
//			'Content-Length':body.length 
//		});
		res.write(body);
		res.end();
	}
	
});
server.listen(3000);

	