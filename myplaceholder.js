/**
splaceholder({
	el: inputid,
	texts: [str1, str2, str3],
	options:{
		letterDelay: 100, //每个字显示的时间间隔
		textDelay: 1000,  //句子切换时间间隔
		loop: false,  //是否循环显示
		startOnFocus: true, //获取焦点,显示打字效果
		showCursor: true,  //显示打字效果光标
		cursor: '|'  //光标
	}
})
**/
;(function(){
	//创建一个input元素,判断是否支持placeholder属性
	var test = document.createElement('input');
	var isPlaceHolderSupported = ('placeholder' in test);

	//默认参数options
	var defaults = {
		letterDelay: 100, //每个字显示的时间间隔
		textDelay: 1000,  //句子切换时间间隔
		loop: false,  //是否循环显示
		startOnFocus: true, //获取焦点,显示打字效果
		showCursor: true,  //显示打字效果光标
		cursor: '|'  //光标
	}

	//obj1是默认键值,obj2是使用时传的键值,用obj2的键值去覆盖obj1的
	function extend(obj1, obj2){
		var obj = {};
		for(key in obj1){
			obj[key] = obj2[key]===undefined ? obj1[key] : obj2[key];
		}
		return obj;
	}

	//构造一个PlaceHolder方法 options里没有设置的属性就使用默认的
	function PlaceHolder(el, texts, options){
		this.el = el;
		this.texts = texts;
		options = options || {};
		this.options = extend(defaults, options);
		this.timeouts = [];
		this.begin();
	}

	//初始化开始
	PlaceHolder.prototype.begin = function(){
		var self = this,
			temp;
		//初始时placeholder的值
		self.originalPlaceholder = self.el.getAttribute('placeholder');

		//初始化后直接开始打字效果显示placeholder  or  需要手动聚焦开始或者停止
		if(self.options.startOnFocus){
			self.el.addEventListener('focus', function(){
				self.cleanUp();		
			});
			self.el.addEventListener('blur', function(){
				self.processText(0);
			})
		}else{
			self.processText(0);
		}
	}

	//texts
	PlaceHolder.prototype.processText = function(index){
		var self = this,
			timeout;
		self.typeString(self.texts[index], function(){    //typeString显示完一个短句,再回调,设置下一个短句的定时显示
			timeout = setTimeout(function(){
				self.processText(self.options.loop ? ((index + 1) % self.texts.length) : (index + 1));
			}, self.options.textDelay);
			self.timeouts.push(timeout);
		});
	}

	//text
	PlaceHolder.prototype.typeString = function(str, callback){
		var self = this,
			timeout;
		if(!str){
			return false;
		}
		
		//给每增加一个字符显示设置定时,即每增加一个letterDelay, 调用函数给input的placeholder设置对应的str
		for(let i = 0; i < str.length; i++){
			//setTimeout第三个参数及以后的参数可以作为函数(setTimeoutCallback)的参数
			timeout = setTimeout(setTimeoutCallback, i * self.options.letterDelay, i);   
			self.timeouts.push(timeout);
		}

		//
		function setTimeoutCallback(index){
			//index == str.length - 1 便是显示到了一个text的最后的一个字符
			self.el.setAttribute('placeholder', str.substring(0, index + 1) + (index === str.length - 1 || !self.options.showCursor ? '' : self.options.cursor));
			if(index == str.length - 1){
				callback();  //一个text显示完整后,回调,设置下一个text的
			}
		}
	}

	//失去焦点之后触发,设置为原来的默认值, 并且清空定时器
	PlaceHolder.prototype.cleanUp = function(){
		// Stop timeouts
		for (var i = this.timeouts.length; i--;) {
			clearTimeout(this.timeouts[i]);
		}
		this.el.setAttribute('placeholder', this.originalPlaceholder);
		this.timeouts.length = 0;
	}

	var splaceholder = function(params){
		if(!isPlaceHolderSupported){
			return;
		}
		new PlaceHolder(params.el, params.texts, params.options);
	}

	// open to the world.
	// commonjs
	if( typeof exports === 'object' )  {
		module.exports = splaceholder;
	}
	// AMD module
	else if( typeof define === 'function' && define.amd ) {
		define(function () {
			return splaceholder;
		});
	}
	// 浏览器window对象
	else {
		window.splaceholder = splaceholder;
	}

})();