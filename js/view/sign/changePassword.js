/*
 Creat by maybe 
 2019-02-22 
 * */
var userName
$(function(){	
	if((user == undefined) || (user == "")){location.href = '/view/sign/sign.html';}
	userName = user.username;	
    $('#validation_name').val(userName);	
    
    var validator = $('.form-horizontal').validate({       
        trigger:"change",
        debug:true,
        rules: {        
            oldPassword:{required: true,},           
            password:{required: true},
          
        },
        messages: {       
           oldPassword: { required: "用户名不能为空",},        
           password:{required:"不能为空"},
           
        },
        highlight: function (element,ele) {
           $(element).addClass("help-block")
        },
        success: function (element,ele) {
            $(ele).removeClass("help-block")
        },
        errorPlacement: function (error, element) {
            //这个地方当输入框失去焦点时，正确情况也走，纳闷了，但是传进来的error是空div判断下，如果是空则不清除提示信息
            if(error.text()){
//              element.closest('.form-box').find(".placeInfo").remove();
            }
//          	error.appendTo(element.prev());
        }
    }); 
    
})


function changePassWord() {
	var result = $(".form-horizontal").valid();
	if(!result) return false;
	var param = {		
		oldPassword : $.trim($('#validation_oldPassword').val()),
		password : $.trim($('#validation_password').val())
	}
	$.ajax({
		type:"POST",
		url:"/api/mms-api/sales/changePassword",
		async:true,
		data:param,
		dataType:'json',			
		success:function(data){
			if(data.statusCode == 200){
				$.cookie("userName", "", {path: "/", expires: -1});
				$.alert("修改密码成功.请重新登录",'营销管理平台',function(){
					location.href = "/view/sign/login.html";
				});
				setTimeout(function(){
					$('.modal').modal("hide");
					location.href = "/view/sign/login.html";
				},2000)
			}else{
				$.alert(data.message);
			}
		},
		error:function(error){
			console.log("修改密码接口错误:"+error);
		}
	});
}
