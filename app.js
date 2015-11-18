/**
 * app.js
 */

var entry = {
		profile:{
			name:"Tae",
			job:"Singer"
		}

};
var jstoxml = require("jstoxml");
var xmlContent = jstoxml.toXML(entry,{header:true}); 								//json 객체 -> xml변환
console.log(xmlContent); //<?xml version="1.0" encoding="UTF-8"?> 
						//<profile><name>Tae</name><job>Singer</job></profile>

var xml2json = require("node-xml2json");
var json = xml2json.parser(xmlContent);												 //xml->json 객체
console.log(json);		//{ PROFILE: { NAME: 'TAE', JOB: 'SINGER' } }
console.log(json.profile); // { name: 'Tae', job: 'Singer' }

var jsonStr =JSON.stringify(json);													//json객체 ->json문자열
console.log(jsonStr); //{"profile":{"name":"Tae","job":"Singer"}}

var jsonObj = JSON.parse(jsonStr);													//json문자열 ->json객체
console.log(jsonObj); //{ profile: { name: 'Tae', job: 'Singer' } }