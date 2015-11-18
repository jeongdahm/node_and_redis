
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , urlencode = require('urlencode')
  , querystring = require('querystring');

var app = express();
//data
var movieList=['아바타','스타워즈','인터스텔라'];

var movieDetail={
		'아바타':{'director':'제임스 카메론'},
		'스타워즈':{'director':'조지 루카스'},
		'인터스텔라':{'director':'크리스토퍼 놀란'}
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


app.get('/movies',function(req,res){
	//res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
	//res.end(JSON.stringify(movieList));
	res.send(movieList);
	console.log(movieList);
	console.log(movieDetail);
	
});
app.get('/movies/:id',function(req,res){
	var itemName = req.params.id;
	itemName=urlencode.decode(itemName);
	var item = movieDetail[itemName];//이름을 찾음
	if(item){ //아이템을 찾으면
		//res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
		//res.end(JSON.stringify(item));
		res.send(item);
	}else{//없으면 
		res.statusCode=404;res.end('Wrong movie name'); //404에러 , 잘못된 메서드임 
	}
});
app.post('/movies',function(req,res){
	movieList.push(req.body.title);//
	movieDetail[req.body.title]= {director:req.body.director}; //
	
	res.redirect('/movies');
});
app.put('/movies',function(req,res){
	var obj =JSON.parse(req.body.movies); //
	movieList =[]; //초기화
	movieDetail={};
	for(var i=0 ; i <obj.length ; i++){
		movieList.push(obj[i].title);
		movieDetail[obj[i].title]= {director:obj[i].director}; 
	}
	res.send({movieList:movieList,movieDetail:movieDetail});
});
app.put('/movies/:id',function(req,res){
	var itemName= req.params.id;
	itemName = urlencode.decode(itemName);
	if(!movieDetail[itemName]) movieList.push(itemName);
	movieDetail[itemName] ={director:req.body.director};
	res.send({movieList:movieList,movieDetail:movieDetail});
	
});
app.delete('/movies',function(req,res){//전체 삭제 
	movieList=[];
	movieDetail={};
	res.send({movieList:movieList,movieDetail:movieDetail});
});
app.delete('/movies/:id',function(req,res){
	var itemName=req.params.id;
	itemName = urlencode.decode(itemName);//url디코드
	var item = movieDetail[itemName];//이름을 찾음
	if(item){ //아이템을 찾으면
		var index = movieList.indexOf(itemName);//배역에서 제거하고 
		if(index != -1) movieList.splice(index,1);
		delete movieDetail[itemName];
		res.send({movieList:movieList,movieDetail:movieDetail});
	}else{//없으면 
		res.statusCode=404;res.end('Wrong movie name'); //404에러 , 잘못된 메서드임 
	}
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
