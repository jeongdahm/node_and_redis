
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

///////////////////////
var mysql = require('mysql');
var dbConfig={
		host:'localhost',
		user:'root',
		password:'1234',
		database:'Moviest'
};
var connection = mysql.createConnection(dbConfig);
connection.connect(function(err){
	if(err){
		console.log('error connecting:'+err.stack);
		return;
	}
	console.log('connected as id'+connection.threadId);
	
});;
///////////////////////
var MongoClient = require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var mongodb = null;
MongoClient.connect('mongodb://localhost:27017/moviest',function(err,db){
		if(err){	
			console.log("error connecting"+err.stack);
			return;
		}
		console.log("Connected correctly to server");
		mongodb=db;
});


app.get('/movies',function(req,res){
	//쿼리를 날린다.
	var select ='select movie_id,title,director, year from movie';
	
	connection.query(select, function(err,results){//쿼리 select의 err와 결과값 
		if(err){
			console.error('select Error',err);
		}else{
			//res.send(results);
			res.render('movies.jade',{title:'Movies',movies:results});
		}
	});
});
app.post('/movies/comment', function(req,res){
	var comments = mongodb.collection('comments');
	comments.insert({movie_id:Number(req.body.movie_id),comments:req.body.comment},
			function(err,results){
		if(err){
			console.log(err);
		}else{
			res.redirect('/movies/'+req.body.movie_id);
		}
	});
});
app.get('/movies/add', function(req,res){//추가하는 페이지 내려움 
	res.render('add.jade',{title:'Add Movie'});
});
app.post('/movies/add', function(req,res){//insert
		var insert = 'insert into movie (title, director, year) values(?,?,?);';
		connection.query(insert,[req.body.title,req.body.director,Number(req.body.year)],
				function(err,results){//id가 넘어온다. 
			if(err){
				console.log(err);
			}
			else{
				console.log(results);
				
				var movie = mongodb.collection('movie');
				movie.insert({movie_id:Number(results.insertId), synopsis:req.body.synopsis},function(err,result){
					
					if(err){
						console.log(err);
					}else{
						
						res.redirect("/movies"); //post끝 movies로 돌아간다. 
					}
					
				});
				
			}
				
			
		});
	
});

app.get('/movies/modify/:id',function(req,res){
	//쿼리를 날린다.
	var select ='select * from movie where movie_id=?;'
	connection.query(select,[req.params.id] ,function(err,results){//?의 매개변수를 넘겨줌 
		if(err){
			console.error('select Error',err);
		}else{
			var movieObj={};
			if(results.length >0){
				movieObj={
						movie_id : results[0].movie_id,
						title :results[0].title,
						director:results[0].director,
						year:results[0].year,
						synopsis:''};//코멘트와 시놉시스가 비어있는 객체 준비. 
				var movie= mongodb.collection('movie');
				
				movie.find({movie_id:Number(results[0].movie_id)}).toArray(function(err,docs){//'readable로 오지만 toarray 하면 필요한 부분만 json으로 넘겨준다.  
					if(docs.length >0){
						movieObj.synopsis = docs[0].synopsis;
					}
					res.render('modify.jade',{
						title:"수정페이지",
						movie:movieObj});
					console.log(movie);//results를 movies로 내려줌 
				});
			}
		}
	});
})
app.post('/movies/modify',function(req,res){
	var update = 'update movie set title=?, director=?, year=? where movie_id=?;';
	connection.query(update,[req.body.title,req.body.director,Number(req.body.year),Number(req.body.movie_id)],
			function(err,result){
		if(err){console.log(err);}
		else{
			var movie = mongodb.collection('movie');
			movie.update({movie_id:Number(req.body.movie_id)},
					{'$set':{synopsis:req.body.synopsis}},function(err,result){
						if(err){console.log(err);}
						else{
							res.redirect('/movies/'+req.body.movie_id);
						}
					})
		}
	});
});
app.get('/movies/:id',function(req,res){
	//쿼리를 날린다.
	var select ='select * from movie where movie_id=?;'
	connection.query(select,[req.params.id] ,function(err,results){//?의 매개변수를 넘겨줌 
		if(err){
			console.error('select Error',err);
		}else{
			var movieObj={};
			if(results.length >0){
				movieObj={
						movie_id : results[0].movie_id,
						title :results[0].title,
						director:results[0].director,
						year:results[0].year,
						comments:[],synopsis:''};//코멘트와 시놉시스가 비어있는 객체 준비. 
				var movie= mongodb.collection('movie');
				
				movie.find({movie_id:Number(results[0].movie_id)}).toArray(function(err,docs){//'readable로 오지만 toarray 하면 필요한 부분만 json으로 넘겨준다.  
					if(docs.length >0){
						movieObj.synopsis = docs[0].synopsis;
					}
				
					var comments = mongodb.collection('comments');
					comments.find({movie_id:Number(results[0].movie_id)}).toArray(function(err,docs){
						for(var i=0; i < docs.length ; i++){
							movieObj.comments.push({comments:docs[i].comments, _id:docs[i]._id});
							console.log(movieObj);
						}
						res.render('movie.jade',{movie:movieObj}); //results를 movies로 내려줌 
					});	
				});
			}
		}
	});
});

//코멘트 삭제 
app.delete('/movies/comment/',function(req,res){

	var comments = mongodb.collection('comments');
	comments.remove({_id:ObjectId.createFromHexString(req.body._id)},function(err,result){
		if(err){
			console.log(err);
		}else{
			res.redirect('/movies/'+req.body.movie_id);
		}
		
	});
	
});
//영화 삭제 
app.delete('/movies/:id',function(req,res){
	var del ='delete from movie where movie_id=?;'
		connection.query(del,[req.params.id] ,function(err,results){
			if(err){
				console.log(err);
			}else{
				var movie = mongodb.collection('movie');
				movie.remove({movie_id:Number(req.body.movie_id)},function(err,results){
					if(err)console.log(err);
					else{
						var comments = mongodb.collection('comments');
						comments.remove({movie_id:Number(req.body.movie_id)},function(err,results){
							if(err)console.log(err);
							else res.redirect("/movies");
						});
					}
				});
				
			}
		});

});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
