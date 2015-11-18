
/**
 * Module dependencies. 메인 역할이당 
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser()); // 알아서 파싱을 해준다. 
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/', function (req,res,next){
	console.log(req.body);
	next(new Error('이것은 에러이다'));//다음 미들웨어 실행 //강제로 에러 발생 
});
app.post('/', function (req,res){
	console.log(req.body);
});
app.get('/users', user.list);

app.use(function(err,req,res,next){//에러 처리용 미들웨어 
	console.log(err);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));//최초에 한번 띄운다. 
});
