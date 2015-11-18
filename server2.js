/**
 * http://usejsdoc.org/
 */


var http = require('http');
var fs= require('fs');
var querystring = require('querystring');
var  list=[];

var server = http.createServer(function(req,res){
	console.log(req);
	if(req.url =='/'){
		res.writeHead(200,{'Content-type':'text/html; charset=UTF-8'});
		fs.createReadStream('index2.html').pipe(res);
		return;
	}else if(req.url=='/list' && req.method =='GET'){ //첫화면 만들기 
		var html ='<html><head><meta charset="UTF-8"></head><body><h1>Favorite Movie</h1><ul>';
		for(var i=0 ; i <list.length ; i ++){
			html += '<li>' +list[i].movie +'('+list[i].director+')</li>';
		}
			html += '</ul><h2>new movie</h2><form method="post" action="/upload"><input type="text" name="movie" placeholder="movie"><br><input type="text" name="director" placeholder="name"><br><input type="submit" name="Upload" ></form></body></html>';
			res.end(html);
			
	}
	else if(req.url =='/upload' && req.method =='POST'){ //업로드 요청들어 왔을 때 
		var body='';
		req.on('data',function(chunk){
			console.log('get %d bytes of data', chunk.length);
			body += chunk;
			console.log('body:'+body);
		});
		req.on('end',function(chunk){
			console.log('there will be no more data');
			console.log('end'+body);
			var query =querystring.parse(body);
			console.log('movie:'+query.movie);
			console.log('name:'+query.director);
			list.push({movie : query.movie, director:query.director});
			 console.log(list);
			 res.statusCode=302;
			 res.setHeader('Location','/list'); //여기로 이도 ㅇ
			 res.end();
		});
	}
});
server.listen(3000);