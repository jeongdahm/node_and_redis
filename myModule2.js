/**
 * http://usejsdoc.org/
 */

exports.createGreeting = function (){
	//객체정의 통째로 익스포트
	
	var obj = {
		hello : function (who){
			console.log('Hello'+ who);
		} 
	};
	
	
	
	obj.howAreYou = function (){
		console.log('Fine Thank you and you?');
	}
	return obj;
}