// Creat by maybe
// 2019-2-21
var userName;
var passWord;
var imgCatch;
var imgToken;


(function(){							
	/*changeImg();*/
	getCookie();
	
	
	
	
})()

 function getCookie(){ //获取cookie,获取用户名密码
         var loginCode = $.cookie("login_code"); //获取cookie中的用户名  
         var pwd =  $.cookie("pwd"); //获取cookie中的登陆密码  
         if(pwd){//密码存在的话把“记住用户名和密码”复选框勾选住  
            $("[name='checkbox']").attr("checked","true");  
         }  
         if(loginCode){//用户名存在的话把用户名填充到用户名文本框  
            $("#username").val(loginCode);  
         }  
         if(pwd){//密码存在的话把密码填充到密码文本框  
            $("#password").val($.base64.decode(pwd)); 
         }  
} 

function setCookie(){ //设置cookie  ,存贮用户名密码
	     var checked = $("[name='checkbox']:checked");//获取“是否记住密码”复选框
         var loginCode = $("#username").val(); //获取用户名信息  
         var pwd = $("#password").val(); //获取登陆密码信息  
        

         if(checked){ //判断是否选中了“记住密码”复选框  
            $.cookie("login_code",loginCode),{path: "/", expires:1000000};//调用jquery.cookie.js中的方法设置cookie中的用户名  
            $.cookie("pwd",$.base64.encode(pwd),{path: "/", expires:1000000});//调用jquery.cookie.js中的方法设置cookie中的登陆密码，并使用base64（jquery.base64.js）进行加密  
         }else{   
         	$.cookie("login_code",null)
            $.cookie("pwd", null);   
         }    
    } 


function change(ele){	
		if($(ele).is(":checked")){
			$('#username').attr("autocomplete","on");
		}else{
			$('#username').attr("autocomplete","off");
		}							
}

// 切换图形验证码
function changeImg(ele) {
	/*ele = ele || ".img";
	var timestamp=new Date().getTime();	
	var numtamp =  Math.random();
	numtamp = numtamp.toString();
	numtamp = numtamp.substring(0,8);
	timestamp = timestamp + numtamp;
	imgToken = timestamp;
	$(ele).attr("src","/api/mms-api/image/captcha-image?t="+timestamp);		*/
}


// 登录
function login() {
	userName = $.trim($('#username').val());
	passWord = $.trim($('#password').val());
	imgCatch = $.trim($('#imgCatch').val());	
	try {
		var errorMessage = "";
		if(userName == "")  throw errorMessage ="用户名不能为空";
		if(passWord == "")  throw errorMessage ="密码不能为空";
		//if(imgCatch == "")  throw errorMessage ="图形验证码不能为空";
	}catch(e) {
		$.alert(e);
		return false;
	}
	/* 验证一切通过 调接口的登录  */
	var params = {
		'phone' : userName,
		'password' : passWord,
		'remember' : true
		//'captcha' : imgCatch,
		//'t':imgToken
	}
	$.ajax({
		type:"POST",
		url:"/api/mms-api/login",
		async:false,
		data:params,
		dataType:'json',
		contentType:"application/x-www-form-urlencoded",		
		success:function(data) {
			if((data.statusCode == "200") && (data.data.result)) {
				 setCookie();   
				
				var date = $.cookieExpires();						
				var user = {
					username : userName,
					userId : data.data.userId,
					salesId : data.data.salesId,
					token : data.data.token,					
				}
				user = JSON.stringify(user);
				$.cookie("user",user, {path: "/", expires:1000000});
				data.data.funcs  = JSON.stringify(data.data.funcs);
				localStorage.funcs = data.data.funcs;
				location.href = '/index.html';
			}else{
				$.alert(data.data.message);
				// 登录失败更换图形验证码
				changeImg();
			}
		},
		error:function(error) {
			changeImg();	
			$.alert("服务器异常!")
			console.log("登录接口报错:" + error);
		}		
	});				
}




          
     