
///////////////////////////////////////////////////
var fs = require('fs');
var async =require('async');
var file= './README1.md';
var content;
async.series([
              function(callback){
            	  fs.stat(file,function(err,stats){
            		if(err){ 
            			  callback(err);
            		}else{
            			
        			  if(stats.isFile()){
            			  callback(null,'check done');
            		  }else{
            			  callback('not file');
            		  }
        			  
            		}
            		  
            	  });
              }
              
              
              ,
              //파일 읽기
              function (callback){
            	  console.log('read S');
            	  fs.readFileSync(file,'utf-8',function(err,data){
            		  content= data;
            	  });
            	  console.log('read D');
            	  callback(null,'read Done');
              }
             
        	  ,
              
              //파일쓰기
        	  function (callback){
        		  console.log('write S');
        		  fs.writeFile('./HELLO.md',content,function (error){
                  });
        		  console.log('write D');
                  callback(null, 'write Done');
        	  }
              
              ],
		function(err,results){
			//콜백
			console.log('*******'+results);
	
});






/////////////////////////////////////////////////////
