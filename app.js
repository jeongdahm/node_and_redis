
/**
 * Module dependencies.
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

var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);
var  users=[];
var redis = require('redis');
var subscriber = redis.createClient(); // subscribe chat = redis-cli  과 같음 
var publisher = redis.createClient();

////////////////////////////////////////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var chatLogs = new Schema({
	id:ObjectId, log:String, date:String
});
var ChatLogModel = mongoose.model('chatlog',chatLogs);
	
var contentLogs = new Schema({
	id:ObjectId , content:String
});
var ContentLogModel = mongoose.model('contentLog',contentLogs);
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveLog(socket, id, state){
	var chatLog = new ChatLogModel();
	if(state =='conn') chatLog.log = id+'님이 접속했습니다.';
	else chatLog.log = id+'님이 나갔습니다.';
	
	chatLog.date = new Date();
	chatLog.save(function(err){
		if(err) console.log(err);
		else{
			ChatLogModel.find({},function(err,logs){
					socket.emit('logs',JSON.stringify(logs));
					socket.broadcast.emit('logs',JSON.stringify(logs));
			});
		}
	});
} 
function saveContent(socket, id, content){
	var contentLog =new ContentLogModel();
	contentLog.content = content;
	//contentLog.id = id;
	
	contentLog.save(function(err){
		if(err)console.log(err);
		else{
			/*ContentLogModel.find({},function(err,logs){
				socket.emit('clogs',JSON.stringify(logs));
				socket.broadcast.emit('clogs',JSON.stringify(logs));
			});*/
		}
	});
}

io.sockets.on('connection',function(socket){
	console.log('connection');
	subscriber.subscribe('chat'); //받으려고 대기중 
	subscriber.on('message',function(channel,message){//메세지가 올때까지 기다리는 중 
		socket.emit('message_go',message);
	});

	socket.on('message',function(raw_msg){
		console.log('message:'+raw_msg);
		var msg =JSON.parse(raw_msg);
		var chat_msg = msg.chat_id+':'+msg.message;
		publisher.publish('chat',chat_msg); //publish chat 블라블라 와 같음 
		
		saveContent(socket,msg.chat_id,chat_msg);
	});
	socket.on('chat_conn',function(raw_msg){
		//사용자 아이디가 기존 리스트에 있는지 보고 없으면 승인 있으면 팅
		console.log('chat_conn'+raw_msg);
		var msg =JSON.parse(raw_msg); //제이슨 객체로 말들어준다.
		var index = users.indexOf(msg.chat_id); //없으면 -1나온다.
		if(index ==-1){//성공일때
			users.push(msg.chat_id);
			socket.emit('chat_join',JSON.stringify(users));
			socket.broadcast.emit('chat_join',JSON.stringify(users)); //모두에게 유저 를 알림
			saveLog(socket, msg.chat_id, 'conn');
			
			ContentLogModel.find({},function(err,logs){ //이전 대화를 보내기 
				socket.emit('clogs',JSON.stringify(logs));
				socket.broadcast.emit('clogs',JSON.stringify(logs));
			});
			
		}else{//실패일때
			socket.emit('chat_fail',JSON.stringify(msg.chat_id));
		}
	});
	 socket.on('leave',function(raw_msg){
			console.log('leave'+raw_msg);
			var msg = JSON.parse(raw_msg);
			if(msg.chat_id != ' ' && msg.chat_id != undefined){
				var index = users.indexOf(msg.chat_id);
				users.splice(index,1);
				console.log('users'+users);
				socket.emit('someone_leaved', JSON.stringify(users));
				socket.broadcast.emit('someone_leaved',JSON.stringify(users));
				saveLog(socket, msg.chat_id, 'leave');
			}
			console.log('-------------');
			console.log(users);
			console.log('-------------');
		});
	 //클라이언트의 브라우저가 종료되어도 연결종료 처리 가능. 
	 socket.on('disconnect',function(raw_msg){
		 console.log("disconnect");
		   subscriber.unsubscribe();
			subscriber.quit();
			publisher.quit();
			
	 });
});

/*io.sockets.on('close',function(socket){
	subscriber.unsubscribe();
	subscriber.close();
	publisher.close();
});*/
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
