var http = require('http'); //http모듈 사용

var  hello = require('./myModule1.js'); //다른 자바 스크립트 파일을 모듈처럼 불러다 사용할 수 있다.
var  hello2 = require('./myModule1.js');

hello.howAreYou();
hello2.howAreYou();


var  hello3 = require('./myModule2.js');
var greeting = hello3.createGreeting();
greeting.hello('Steve jobs');
greeting.howAreYou();


//클래스가 넘어옴
var hello4 = require('./myModule3.js');
var obj= new hello4();

obj.howAreYou();

//객체가 넘어옴
var  hello5= require('./myModule4.js');
hello5.hello();
/////////////////////////////////////////////////////////////////////////////////////////

function task1 (){
	console.log('Fist Task started');
	
	setTimeout(function (){
		console.log('First Task Done!');
	},3000);
}

function task2(){
	console.log('Second Task started');
	setTimeout(function (){
		console.log('Second Task Done!');
	},1000);
}


//task1();
//task2();


function task3 (callback){
	console.log('3 Task started');
	
	setTimeout(function (){
		console.log('3 Task Done!');
		callback();
	},3000);
}

function task4(){
	console.log('4 Task started');
	setTimeout(function (){
		console.log('4 Task Done!');
	},1000);
}

/*task3(function (){ //3의 콜백 ->4 실행 
	task4();
});
*/

var  async =require('async');
async.series([
              function(callback){
            	  console.log('111111');
            	  setTimeout(function(){
            		  console.log('1111111Done');
            		  callback(null,'Done1');
            	  },3000);
              },
              function (callback){
            	  console.log('22222');
            	  setTimeout(function(){
            		  console.log('22222Done');
            		  callback(null,'Done2');
            	  },1000);
              }],
              function(err,results){
			 console.log('All done&&&'+results);
}
              );

/////////////////////////////////////////////////////////////////////////////////////////////
http.createServer(function handler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'}); //클라이언트로 쏴줌 
    res.end('Hello World!!!!!!!!!!\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
