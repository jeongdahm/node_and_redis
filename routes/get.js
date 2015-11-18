
/*
 * GET home page.
 */

exports.get = function(req, res){
	var url=req.url;
	if(url =='/movies'){
		res.writeHead(200,{'Content-type':'application/json; charset=UTF-8'});
		res.end(JSON.stringify(movieList));
	}else{
		var itemName=url.split('/')[2];//세번쨰 항목
		itemName = urlencode.decode(itemName);//url디코드
		var item = movieDetail[itemName];//이름을 찾음
		if(item){ //아이템을 찾으면
			res.render({title:})
		}else{//없으면 
			res.statusCode=404;res.end('Wrong movie name'); //404에러 , 잘못된 메서드임 
		}
	}
};