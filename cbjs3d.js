"use strict";
/*
* Cbjs3d.js
* CARD BOARD JAVA SCRIPT 3D LIBRARY
* VERSION 0.1ALPHA
*
* USAGE:
*   Create and style a div element and add a onload function like this (for landscape image):
*
*	
*	window.onload = function(){
*		Cbjs3d({
*			div: "divElementId",
*			type: "landscape",
*			image: "image.jpg",
*			view: 360
*		});
*	};
*
* 
* Date: September 3, 2016
*/
window.requestAnimation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
window.exitAnimation = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


/**
class:  Cbjs3dutils

	This class manage the cardboard 3d images.
	
*/
var Cbjs3dutils = Cbjs3dutils || {};


/**
variable:  Cbjs3dutils.elements

	An array with all 3d images configuration object
	
*/
Cbjs3dutils.elements = [];

/**
variable:  Cbjs3dutils.requestId

	Use to control the requestAnimation in some function with
	dynamic images.
	
*/
Cbjs3dutils.requestId = 0;

/**
variable:  Cbjs3dutils.conf

	Use to store the configuration of the selected 3d image.
	
*/
Cbjs3dutils.conf;

/**
variable:  Cbjs3dutils.last_device_orientation

	Use to store the last device orientation
	
*/
Cbjs3dutils.last_device_orientation  = [-1,-1,-1];

/**
variable:  Cbjs3dutils.first_device_orientation

	Use to store the first device orientation
	
*/
Cbjs3dutils.first_device_orientation = [-1,-1,-1];

/**
variable:  Cbjs3dutils.eventData

	Use to store the events data: the pitch, movements, acceleration of the device.
	
*/
Cbjs3dutils.eventData = {};

/**
function: isAndroid

	This function returns true if the device is an android

	@return {Boolean}
	
*/
Cbjs3dutils.isAndroid = function(){
	return (navigator.userAgent.toLowerCase().indexOf("android")>-1);
}

/**
function: isIphone

	This function returns true if the device is an iphone

	@return {Boolean}
	
*/
Cbjs3dutils.isIphone = function(){
	return (navigator.userAgent.toLowerCase().indexOf("iphone")>-1);
}

/**
function: isChrome

	This function returns true if the device uses
	chrome as web browser.

	@return {Boolean}
	
*/
Cbjs3dutils.isChrome = function(){
	return (navigator.userAgent.toLowerCase().indexOf("chrome")>-1);
}

/**
function: isMobile

	This function returns true if the device is
	a mobile phone.

	@return {Boolean}
	
*/
Cbjs3dutils.isMobile = function(){
	return (Cbjs3dutils.isAndroid() || Cbjs3dutils.isIphone());
}

/**
function: start

	This function run the main function
	for configure the 3d item.
	This function stores the configuration
	object (conf) in the Cbjs3dutils.elements
	array.

	@params {Object} conf
	
*/
Cbjs3dutils.start = function(conf){
	if(conf.div !== undefined && conf.type !== undefined){
		var id = Cbjs3dutils.elements.push(conf);
		Cbjs3dutils.boot(id-1);
	}else{
		Cbjs3dutils.displayError("configuration: div or type not found!");
	}
}


/**
function: boot

	This function create and store
	the variables which will be use
	when a image is selected to view.


	@params {Number} id
	
*/
Cbjs3dutils.boot = function(id){
	var conf = Cbjs3dutils.elements[id];
	conf.port_view = screen.width*(screen.devicePixelRatio || 1);
	conf.divElm = L.a(conf.div);

	//PONER CLASE .fsElm

	if(conf.divElm.className!=""){
		conf.divElm.className+=" ";
	}

	conf.divElm.className+="fsElm";

	conf.divElm.innerHTML = "<div id=\""+conf.div+"_right_eye\" class=\"right_eye\"><div id=\""+conf.div+"_debug\" style=\"color:#00FF00;\">DEBUG</div></div><div id=\""+conf.div+"_left_eye\" class=\"left_eye\"></div>";
	conf.divElmL = L.a(conf.div+"_right_eye");
	conf.divElmR = L.a(conf.div+"_left_eye");
	conf.divElmL.style.width = conf.divElmR.style.width = conf.divElm.style.width/2;
	switch(conf.type.toLowerCase()){
		case "image":
			Cbjs3dutils.bootImage(id);
		break;
		case "landscape":
			Cbjs3dutils.bootLandscape(id);
		break;
		case "cube":
//			this.cube();
		break;
		case "info":
			//this.getInfo();
		default:
			Cbjs3dutils.displayError("invalid type.");
		break;
	}
	conf.divElm.addEventListener("click", function(){ Cbjs3dutils.select(id); }, false);

}

/**********************************
*  IMAGES CONFIGURATION FUNCTIONS:*
*	IMAGES			  *
*	LANDSCAPE		  *
*	...			  *
***********************************/

/**
function: bootimage

	This function put the right and 
	left images passed in the configuration
	class.

	@params {Number} id
	
*/
Cbjs3dutils.bootImage = function(id){
	var conf = Cbjs3dutils.elements[id];
	conf.divElmR.style.backgroundImage = "url('"+conf.right+"')";
	conf.divElmL.style.backgroundImage = "url('"+conf.left+"')";
}

/**
function: bootLandscape

	This function put the landscape
	image in 'pseudo-3d' passed in the configuration
	class.

	@params {Number} id
	
*/
Cbjs3dutils.bootLandscape = function(id){
	var conf = Cbjs3dutils.elements[id];
	var img = new Image();
	if(conf.view === undefined){
		conf.view = 360;
	}
	img.src = conf.image;
	img.onload = function(){
		var width = Math.round(img.width*0.1);
		if(width == 0 || img.width < img.height){ Cbjs3dutils.displayError("Landscape not valid");}else{
			console.log(img.width);
			conf.divElmL.style.backgroundImage = "url('"+img.src+"')";
			conf.divElmL.style.backgroundPosition = (img.width*0.48)+"px 0px";
			conf.divElmL.style.backgroundSize = "auto 100%";
			conf.divElmR.style.backgroundImage = "url('"+img.src+"')";
			conf.divElmR.style.backgroundPosition = (img.width*0.5)+"px 0px";
			conf.divElmR.style.backgroundSize = "auto 100%";
		}
	}
	conf.img = img;
}
/**
function: select
	This function is called when a element is clicked to see.
	This function pass an identifier (id), Cbjs3dutils
	controls the selected 3d item.
	
	@params {Number} id
	
*/


Cbjs3dutils.select = function(id){
	if(Cbjs3dutils.elements.length>id){
		Cbjs3dutils.conf = Cbjs3dutils.elements[id];
		//IMAGE FACTOR: USED FOR LANDSCAPES
		if(Cbjs3dutils.conf.type=="landscape"){
			Cbjs3dutils.imgFactor = Cbjs3dutils.conf.img.width/Cbjs3dutils.conf.img.height*screen.height/2;
		}
		Cbjs3dutils.toggleFullscreen();
	}
}


/**
function: toggleFullscreen

	This function toggle on or off the fullscreen.
*/
Cbjs3dutils.toggleFullscreen= function(){

	if(fullscreen.is()){
		fullscreen.exit();
	}else{
		if(Cbjs3dutils.isLandscape()){
			if(fullscreen.request(Cbjs3dutils.conf.divElm)){
				Cbjs3dutils.getMotion();
			}else{
				Cbjs3dutils.displayError("Unable to fullscreen. Try with other browser.");
			}
		}else{
			Cbjs3dutils.displayError("Put the device in landscape mode.");
		}
	}
}

/**
function: displayError
	This function display a error on screen. It last 4 seconds.
*/

Cbjs3dutils.displayError = function(e){
	var _err = document.createElement("div");

	if(document.body.querySelector("#_err_display") !== null){
		try {document.body.removeChild(_err);}catch(e){ console.log("Err removing _err"+e);};
	}

	_err.id = "_err_display";
	_err.style = "position:fixed; top:20px; left:20px; right:20px; background:rgba(20,20,20,0.8); border-radius:5px 5px; z-index:999; height:50px; animation:show_and_remove_opacity ease-in 4s;";
	document.body.appendChild(_err);
	_err.innerHTML = "<span style=\"color:#EE1111;margin-left:20px; margin-top:20px;\">Error:</span><span style=\"color:#FEFEFE; margin-top:20px;\">"+e+"</span>";
	setTimeout(
		function(){
			if(document.body.querySelector("#_err_display") !== null){
				document.body.removeChild(_err);
			}
		}
	,4000);

}

/**
function: isLandscape
	This function returns true if the device is in landscape mode.
*/
Cbjs3dutils.isLandscape = function(){
	return (screen.height < screen.width);
}

/**
function: onResize
	This function fires when the screen is resized.
*/
Cbjs3dutils.onResize = function(e){	
	if(!Cbjs3dutils.isLandscape()){
		fullscreen.exit();
	}
}

/************************************************************************
*MOTION FUNCTIONS:							*
*	MOTION FUNCTIONS CONTROLS THE IMAGES WHEN THE DEVICE MOVES.	*
*	THIS ONLY WORKS WHEN FULL SCREEN IS ENABLED!			*
*************************************************************************/

/**
function: getMotion
	This function request the animation of the images and stores the first position of the device.
	See: animateMove
*/
Cbjs3dutils.getMotion = function(){
	if(Cbjs3dutils.eventData.alpha>=0 && Cbjs3dutils.eventData.alpha<=360){
		Cbjs3dutils.first_device_orientation = [Cbjs3dutils.eventData.alpha, Cbjs3dutils.eventData.beta, Cbjs3dutils.eventData.gamma];
	}else{
		Cbjs3dutils.first_device_orientation = [0,0,0];
	}
	requestAnimation(Cbjs3dutils.animateMove);

}
Cbjs3dutils.removeMotion = function(){
	exitAnimation(Cbjs3dutils.requestId);
}


Cbjs3dutils.requestMove = function(a){
	try {
		Cbjs3dutils.eventData = {
			alpha: Math.floor(a.alpha*10)/10,
			beta: Math.floor(a.beta*10)/10,
			gamma: Math.floor(a.gamma*10)/10
			};
	}catch(e){
		Cbjs3dutils.displayError("Cant move device due to hardware error!");
	}
}


/**
function: animateMove
	This function control the movement of the images and call
	the functions that controls the type of image.
*/
Cbjs3dutils.animateMove = function(){

	if(fullscreen.is()){

		Cbjs3dutils.requestId = requestAnimation(Cbjs3dutils.animateMove);

		switch(Cbjs3dutils.conf.type){
			case "landscape":
				Cbjs3dutils.motionLandscape(Cbjs3dutils.eventData);
			break;
			default:
			break;
		}
		Cbjs3dutils.last_device_orientation = [Cbjs3dutils.eventData.alpha, Cbjs3dutils.eventData.beta, Cbjs3dutils.eventData.gamma];



	}

}


/**
function: motionLandscape
	This function control the movement of the landscape image.
*/
Cbjs3dutils.motionLandscape = function(normCompass){

	var __back_angle;
	var _a;
	if(Cbjs3dutils.first_device_orientation[0]<=Cbjs3dutils.conf.view/2){
		__back_angle = Cbjs3dutils.conf.view/2+Cbjs3dutils.first_device_orientation[0];
	}else{
		__back_angle = Cbjs3dutils.conf.view/2-Cbjs3dutils.first_device_orientation[0];
	}

	if(normCompass.alpha>__back_angle || normCompass.alpha<Cbjs3dutils.first_device_orientation[0]){
		if(normCompass.alpha>Cbjs3dutils.first_device_orientation[0]){			
			_a = normCompass.alpha-Cbjs3dutils.first_device_orientation[0];
		}else{
			_a = (360-Cbjs3dutils.first_device_orientation[0])+normCompass.alpha;
		}
		_a = 360-_a;
	}else{
		_a = Cbjs3dutils.first_device_orientation[0]-normCompass.alpha;
		if(_a>0){			
			_a -= 360;
		}
	}
	_a/=-180;
	if(Math.abs(normCompass.beta)>90){
		(_a<0) ? _a+=1 : _a-=1;
	}


	var imgPos = _a*Cbjs3dutils.imgFactor;
	L.a(Cbjs3dutils.conf.div+"_debug").innerHTML="->"+_a;

	Cbjs3dutils.conf.divElmR.style.backgroundPosition = (imgPos-Cbjs3dutils.conf.port_view*0.1)+" 0px";
	Cbjs3dutils.conf.divElmL.style.backgroundPosition = imgPos+" 0px";
}


/**********************************************
	CARDBOARD JAVASCRIPT 3D MAIN FUNCTION
**********************************************/


/**
function: Cbjs3d
	This function check if the conf file is passed as argument
	and call the Cbjs3dutils.start function.
*/

function Cbjs3d(conf) {
		if(conf === undefined){
			Cbjs3dutils.displayError("Undefined configuration!");
			return false;
		}else{
			Cbjs3dutils.start(conf);
			return true;
		}
};


/********************************************************************
L: LESS
	WITH THIS WE REDUCE THE LENGTH OF THE MOST CALLED FUNCTIONS

	Now is used for replace document.getElementById for L.a.
	This will be used for code compression...
*********************************************************************/
var L = L || {};
L.a = function(a){ return document.getElementById(a);}





/**
	THIS PART OF CODE IS BASED ON https://github.com/sindresorhus/screenfull.js
	LICENSED BY MIT License.
*/

/**
class: fullscreen
	This class controls the fullscreen requests
*/
var fullscreen = fullscreen || {};

/**
var: tags
	Tags of fullscreen request valid for the web browser.
*/
fullscreen.tags = {};

/**
function: request
	This function request the fullscreen element. Returns false if
	something is wrong.
*/
fullscreen.request = function(elm){
	try {
		elm[fullscreen.tags.request]();
		return true;
	}catch(e){
		return false;
	}
}

/**
function: exit
	This function exits from fullscreen element.
*/
fullscreen.exit = function(elm){
	document[fullscreen.tags.exit]();
}

/**
function: is
	This function returns true if is fullscreen.
*/
fullscreen.is = function(elm){
	return (document[fullscreen.tags.element]!=null);
}

/**
function: getTags (auto-called)
	This function stores in fullscreen.tags the valid tags.
*/
fullscreen.getTags = (function(){

	var tags = [
		//Global full screen tags / FULL SCREEN TAGS WHICH WILL BE USED
		[
			'requestFullscreen',
			'exitFullscreen',
			'fullscreenElement'
		],
		//WEBKITS
		[
			'webkitRequestFullscreen',
			'webkitExitFullscreen',
			'webkitFullscreenElement'

		],
		[
			'webkitRequestFullScreen',
			'webkitCancelFullScreen',
			'webkitCurrentFullScreenElement'

		],
		//Gecko
		[
			'mozRequestFullScreen',
			'mozCancelFullScreen',
			'mozFullScreenElement'
		],
		//IE
		[
			'msRequestFullscreen',
			'msExitFullscreen',
			'msFullscreenElement'
		]
	];

	for (var i = 0; i < tags.length; i++) {
		if ( tags[i][1] in document) {
			fullscreen.tags["request"] = tags[i][0];
			fullscreen.tags["exit"] = tags[i][1];
			fullscreen.tags["element"] = tags[i][2];
		}
	}

})();


/**
function: anonymous (auto-called)
	This function add the event listener for device orientation event.
*/
(function(){
	if(window.DeviceOrientationEvent){
		window.addEventListener("deviceorientation", function(event) { Cbjs3dutils.requestMove(event); }, false);
	}
	window.addEventListener("orientationchange", Cbjs3dutils.onResize, false);

})();
