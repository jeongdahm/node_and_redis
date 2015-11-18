/**
 * RESTfulAPIExam server.js
 */

var movieList=['아바타','스타워즈','인터스텔라'];

var movieDetail={
		'아바타':{'director':'제임스 카메론'},
		'스타워즈':{'director':'조지 루카스'},
		'인터스텔라':{'director':'크리스토퍼 놀란'}
};

var http=require('http');
var server = http.createServer(function(req, res) {
	var method = req.method.toLowerCase();
	//console.log(method);
	if(method=='get') handleGetRequest(req,res);
	else if(method=='post') handlePostRequest(req,res);
	else if(method=='put') handlePutRequest(req,res);
	else if(method =='delete')handleDeleteRequest(req,res);
	else{res.statusCode=404;res.end('Wrong method');}
});
server.listen(3000);

var urlencode = require('urlencode');
function handleGetRequest(req,res){ //리스트 출력 
	var url=req.url;
	if(url =='/movies'){
		res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
		res.end(JSON.stringify(movieList));
	}else{
		var itemName=url.split('/')[2];//세번쨰 항목
		itemName = urlencode.decode(itemName);//url디코드
		var item = movieDetail[itemName];//이름을 찾음
		if(item){ //아이템을 찾으면
			res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify(item));
		}else{//없으면 
			res.statusCode=404;res.end('Wrong movie name'); //404에러 , 잘못된 메서드임 
		}
	}
}

var querystring = require('querystring');
function handlePostRequest(req,res){ //입력 
	var url=req.url;
	if(url =='/movies'){
		var body=''; //바디 만들고 
		req.on('data',function(chunk){
			body += chunk;
		//console.log('chunk:'+chunk);
		});//바디에 청크를 더해라
		req.on('end',function(){
			var parsed = querystring.parse(body);//parsed 하면 JSON형태가 된다.
			console.log(body);
			console.log(parsed);
			movieList.push(parsed.title);
			console.log('parsed.title:'+parsed.title);
			movieDetail[parsed.title]={director:parsed.director};
			res.statusCode=302; res.setHeader('Location','/movies');res.end(); //리다이렉트를 해야함
		});
		
	}
}
function handlePutRequest(req,res){ //전체 수정 
	var url = req.url;
	if(url =='/movies'){
		var body ='';
		req.on('data',function(chunk){body += chunk;});
		req.on('end',function(){
			var parsed = querystring.parse(body);
			parsed.movies = urlencode.decode(parsed.movies);
			var obj =JSON.parse(parsed.moives);
			movieList =[]; //초기화
			movieDetail={};
			for(var i=0 ; i <obj.length ; i++){
				moviesList.push(obj[i].title);
				movieDetail[obj[i].title]= {director:obj[i].director}; 
			}
				
			
			res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify({movieList:movieList,movieDetail:movieDetail}));
		});
	}else{
		var itemName=url.split('/')[2];//세번쨰 항목 /영화 이름을 알아야 함 
		itemName = urlencode.decode(itemName);//url디코드
		var item = movieDetail[itemName];//이름을 찾음
		var body ='';
		var parsed ='';
		req.on('data',function(chunk){body += chunk;});
		req.on('end',function(){
			var parsed = querystring.parse(body);
			if(!movieDetail[itemName]) movieList.push(itemName);
			
			movieDetail[itemName] ={director:parsed.director};
			res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify({movieList:movieList,movieDetail:movieDetail}));
		});
	}
}
function handleDeleteRequest(req,res){ //선택 삭제 
	var url = req.url;
	if(url =='/movies'){
		movieList=[];
		movieDetail={};
		res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
		res.end(JSON.stringify(movieList));
		
	}else{
		var itemName=url.split('/')[2];//세번쨰 항목
		itemName = urlencode.decode(itemName);//url디코드
		var item = movieDetail[itemName];//이름을 찾음
		if(item){ //아이템을 찾으면
			var index = movieList.indexOf(itemName);//배역에서 제거하고 
			if(index != -1) movieList.splice(index,1);
			delete movieDetail[itemName];
			res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify({movieList:movieList,movieDetail:movieDetail}));
		}else{//없으면 
			res.statusCode=404;res.end('Wrong movie name'); //404에러 , 잘못된 메서드임 
		}
	}

}