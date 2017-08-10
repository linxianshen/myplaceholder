# myplaceholder
placeholder typewriting effect

对输入框的placeholder进行操作.可以设置多个句子, 循环以打字效果显示

``` bash
//调用方法及参数
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
```

## 调用
``` bash
//引入
<script src="myplaceholder.js"></script>
```

``` bash
splaceholder({
  el: inputId,  //input的id
  texts: ["cslcslcslcslcsl", "anni jjjjjxs", "lucysadadqsdf"],
  options: {
    loop: true,
    letterDelay: 100

  }
})
```
![调用成功](img/myplaceholder.gif)
