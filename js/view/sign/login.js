// Creat by maybe
// 2019-2-21
var userName;
var passWord;
var imgCatch;
var imgToken;


(function(){
	// 处理安卓手机输入法遮挡输入框问题（摘自WEUI）
//  if ((/Android/gi).test(navigator.userAgent)) {
//      window.addEventListener('resize', function () {
//          if (document.activeElement.tagName == 'INPUT' || 
//              document.activeElement.tagName == 'TEXTAREA') {
//              window.setTimeout(function () {
//                  document.activeElement.scrollIntoViewIfNeeded();
//              }, 0);
//          }
//      });
//  }
//var winHeight = $(window).height(); //获取当前页面高度
//  $(window).resize(function() {
//      var thisHeight = $(this).height();
//      if (winHeight - thisHeight > 50) {
//          //当软键盘弹出，在这里面操作
//          //alert('aaa');
//          $('body').css('height', winHeight + 'px');
//      } else {
//          //alert('bbb');
//          //当软键盘收起，在此处操作
//          $('body').css('height', '100%');
//      }
//  });

	getCookie();
	var validator = $('.form-horizontal').validate({
        errorElement: 'div',
        errorClass: 'div-error',
      	trigger:"change",
        rules: {        
            username:{required:true},           
            password:{required:true},          
        },
        messages: {       
            username: {required: "用户名不能为空",},        
            password:{required:"密码不能为空",},           
        },
        highlight: function (e) {
            $(e).closest('.form-box').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-box').removeClass('has-error');
            $(e).remove();
        },
        errorPlacement: function (error, element) {
            if(error.text()){
                element.closest('.form-box').find(".placeInfo").remove();
            }
            	error.insertAfter(element.parent());
        }
    }); 
	 $('input').on("focus",function(){
		$(this).parents(".row").addClass("focus");
		
	})
	$('input').on("blur",function(){
		$(this).parents(".row").removeClass("focus");
		
	})	
		
	$('.check').on("click",function(){
		$(this).toggleClass("checked");
		if($(this).hasClass("checked")){
			$('.toggle-y').removeClass('hide').siblings("img").addClass("hide");
			$('#username').attr("autocomplete","on");
		}else{
			$('.toggle-n').removeClass('hide').siblings("img").addClass("hide");
			$('#username').attr("autocomplete","off");
		}			
		
	})
})()

// 登录未导入公共头,防止走登录判断
$(window).on("resize",function(){	
        var width = document.documentElement.clientWidth,
                height = document.documentElement.clientHeight,
                wrapper = document.getElementById("main"),
                style = "";
        if(width >= height) { // 竖屏
            style += "width:100%;"; 
            style += "height:100%;";
            style += "-webkit-transform: rotate(0); transform: rotate(0);";
            style += "-webkit-transform-origin: 0 0;";
            style += "transform-origin: 0 0;";
        } else { // 横屏
            style += "width:" + height + "px;";// 注意旋转后的宽高切换
            style += "height:" + width + "px;";
            style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";          
            style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
            style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
        }
        wrapper.style.cssText = style;  		
})
 function getCookie(){ //获取cookie,获取用户名密码
         var loginCode = $.cookie("login_code"); //获取cookie中的用户名  
         var pwd =  $.cookie().pwd;//获取cookie中的登陆密码  
         if(!$.isNullOrBlank(pwd)){//密码存在的话把“记住用户名和密码”复选框勾选住  
         	$(".check").removeClass("checked")
            $('.toggle-n').removeClass('hide').siblings("img").addClass("hide");
         }  
         if(!$.isNullOrBlank(loginCode)){//用户名存在的话把用户名填充到用户名文本框  
            $(".username").val(loginCode);  
         }  
         if(!$.isNullOrBlank(pwd)){//密码存在的话把密码填充到密码文本框  
            $(".password").val($.base64.decode(pwd)); 
         }  
} 

function setCookie(){ //设置cookie  ,存贮用户名密码
	     var checked = $(".check").hasClass("checked");//获取“是否记住密码”复选框
         var loginCode = $(".username").val(); //获取用户名信息  
         var pwd = $(".password").val(); //获取登陆密码信息  
         if(checked){ //判断是否选中了“记住密码”复选框  
            $.cookie("login_code",loginCode),{path: "/", expires:1000000};//调用jquery.cookie.js中的方法设置cookie中的用户名  
            $.cookie("pwd",$.base64.encode(pwd),{path: "/", expires:1000000});//调用jquery.cookie.js中的方法设置cookie中的登陆密码，并使用base64（jquery.base64.js）进行加密  
         }else{   
         	$.cookie("login_code","", { expires: -1 })
            $.cookie("pwd", "", { expires: -1 });   
         }    
    } 



// 登录
function login() {
	var result =  $(".form-horizontal").valid();
	if(!result){return false;}
	userName = $.trim($('.username').val());
	passWord = $.trim($('.password').val());		
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

			}
		},
		error:function(error) {
			$.alert("服务器异常!")
			console.log("登录接口报错:" + error);
		}		
	});	
	
	return false;
	
}




          
     