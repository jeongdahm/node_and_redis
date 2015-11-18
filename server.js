/**
 * http://usejsdoc.org/
 */

var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var paints=[];

var server = http.createServer(function(req,res){
	 if(req.url =='/list' && req.method =='GET'){
		 console.log(JSON.stringify(paints));
		var  html = '<html><head><meta charset="UTF-8"></head><body><h1>Favorite Paint</h1><ul>';
		for(var i=0; i < paints.length ; i++){
			html += '<li><img src="http://127.0.0.1:3000/'+paints[i].image_url+'">'+paints[i].title+'</li>';
			
		}
		html += '</ul><form method="post" action="/upload" enctype="multipart/form-data">작품이름:<input type="text" name="title"><br><input type="file" name="file" ><br><input type="submit" name="Upload" ></form></body></html>';
		res.end(html);
	
	}else if(req.url =='/upload' && req.method=="POST"){
		var form = new formidable.IncomingForm();
		form.encoding='utf-8';
		form.keepExtensions = true;
		form.uploadDir='./upload';
		form.parse(req, function(err,fields,files){
			console.log(files);
			var File = files.file;
			var filename= File['path'];
			filename = filename.replace(/\\/gm,'/');
			console.log(File['path']);
			paints.push({title:fields.title,image_url:filename});
			res.statusCode=302;
			 res.setHeader('Location','/list'); //여기로 이도 ㅇ
			 res.end();
			
		});
	}else{
		var path = __dirname + req.url;
		fs.exists(path,function(exist){
			if(exist){
			 res.writeHead(200,{'Content-type':'image/*'});	
			 fs.createReadStream(path).pipe(res);
			}
		});
	}
});
server.listen(3000);