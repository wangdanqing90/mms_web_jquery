/*
 
 * */
var user;

(function($){
	user = $.cookie("user");
	if((user == undefined) || (user == "")){loginOut()}	
	user = JSON.parse(user);
	$('.user-name').text(user.username);
					
})(jQuery)


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
     /*   if(!$.isNullOrBlank(style)){*/
        	wrapper.style.cssText = style;
        /*} */ 
})


function loginOut() {
	  $.cookie("userName", "", {path: "/", expires: -1});
	  $.cookie("user", "", {path: "/", expires: -1});
	  location.href = '/view/sign/login.html';
}


//ajax请求loading动画
$(window).ajaxStart(function(){	
    ajaxComplete = false;
    setTimeout(function(){
        if(ajaxComplete!=true){
            $.loading();
        }
    },500);
});
$(window).ajaxStop(function(){
    ajaxComplete = true;
    $.unloading();
});



(function($){
	if((user == undefined) || (user == "")){return false;}	
    //首先备份下jquery的ajax方法   
    var _ajax=$.ajax;    
    //重写jquery的ajax方法
    $.ajax=function(opt){
        //备份opt中error和success方法
        var fn = {
            error:function(XMLHttpRequest, textStatus, errorThrown){},
            success:function(data, textStatus){}
        }
        if(opt.error){
            fn.error=opt.error;
        }
        if(opt.success){
            fn.success=opt.success;
        }         
        //扩展增强处理
        var _opt = $.extend(opt,{          
            beforeSend:function(XMLHttpRequest){              
                XMLHttpRequest.setRequestHeader("access_token",user.token);
                XMLHttpRequest.setRequestHeader("access_id",user.salesId);
            },
            complete:function(data){
          	var code = JSON.parse(data.responseText).statusCode;
          	if(code == 300){
          		location.href = "/view/sign/login.html"
         	}
            }
        });
       return _ajax(_opt);
    };
})(jQuery);







