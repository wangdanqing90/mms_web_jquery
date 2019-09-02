/*
 Creat by maybe 
 2019-02-22 
 * */

$(function(){		
		/** 添加age验证 */
	    $.validator.addMethod("correctAge",function(value,element){
	    	if(value == ""){return true}
	        return $.isNumber(value);
	    });
	
		/** 添加手机号验证 */
	    $.validator.addMethod("correctMobile",function(value,element){
	        return $.isMobile(value);
	    });
	   	/** 添加证件号验证 */
	    $.validator.addMethod("correctCard",function(value,element){
	        return $.isCard(value);
	    });
    	var validator = $('.form-horizontal').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        trigger:"change",
        debug:true,
        rules: {        
            username:{required: true,},  
            salesNum:{required: true,},  
            phone:{required: true,correctMobile:true},
            idCard:{required: true,correctCard:true}, 
            age:{correctAge:true}
        },
        messages: {       
            username: { required: "用户名不能为空",}, 
             salesNum: { required: "员工编号不能为空",},    
            phone:{required:"不能为空",correctMobile:"请输入正确的手机号"},
            idCard:{required:"不能为空",correctCard:"请输入正确的证件号"},
            age:{correctAge:"请输入正确的年龄"}
        },
        highlight: function (element,ele) {
           $(element).addClass("help-block");
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
    
    	$(".date").jeDate({
            format: "YYYY-MM-DD",
            isTime: false,
            theme:{bgcolor:"#D91600",pnColor:"#FF6653"},
            position:['100','200'],
            multiPane:true,  
            minDate: "2014-09-19 00:00:00",
            fixed:true,
        })
    

    
    initUserInfo();
   
    
    
})

function initUserInfo(){
	if(!$.isLogin()){location.href = '/view/sign/sign.html';}
	var userInfo = $.getUser();
	if(userInfo == null){
		/*$.alert("网络忙 ! 请稍后再试 !","",function(){
			location.href = "/index.html"
		});*/
		return false;
	}
	$(".usernumber").val(userInfo.salesId);
	$(".salesNum").val(userInfo.salesNum);
	$('.username').val(userInfo.salesName);
	$(".profess option[value='"+userInfo.position+"']").attr("selected","selected");
	$(".position_status option[value='"+userInfo.status+"']").attr("selected","selected");
	$('.email').val(userInfo.email);
	$('.phone').val(userInfo.phoneNo);
	$('.idType').val(userInfo.idType);
	$('.idCard').val(userInfo.idNumber);
	$('.age').val(userInfo.age);
	$('.entryDate').val(userInfo.entryDate);
	$('.graUniversity').val(userInfo.graUniversity);
	$(".maxEducation option[value='"+userInfo.maxEducation+"']").attr("selected","selected");
	$('.maxDegree').val(userInfo.maxDegree);
	$('.awardExperie').val(userInfo.awardExperie);
	$('.photoAddress').val(userInfo.photoAddress);
	$('.qrcode').val(userInfo.qrCode);
	$('.adeptDomain').val(userInfo.adeptDomain);
	
}


function changePassWord() {
	var result =  $(".form-horizontal").valid();
	if(!result) return false;
	var param = {
		salesId : $(".usernumber").val(),
		salesNum : $(".salesNum").val(),
		salesName : $('.username').val(),
		phoneNo : $('.phone').val(),
		idType : $('.idType').val(),
		idNumber : $('.idCard').val(),
		status : $(".position_status").val(),
		Age : $('.age').val(),
		position : $('.profess').val(),
		email : $('.email').val(),
		entryDate : $('.entryDate').val(),
		graUniversity : $('.graUniversity').val(),
		maxEducation : $('.maxEducation').val(),
		maxDegree : $('.maxDegree').val(),
		awardExperie : $('.awardExperie').val(),
		photoAddress : $('.photoAddress').val(),
		qrCode : $('.qrcode').val(),
		adeptDomain:$('.adeptDomain').val()
	}
	$.ajax({
		type:"POST",
		url:"/api/mms-api/sales/modifySales",
		async:true,
		data:param,
		dataType:'json',
		contentType:"application/x-www-form-urlencoded",	
		success:function(data){
			if(data.statusCode == 200){
//				$.cookie("user", "", {path: "/", expires: -1});
				$.alert("修改用户信息成功",'营销管理平台',function(){
					location.href = "/index.html";
				});				
			}else{
				$.alert(data.message);
			}
		},
		error:function(error){
			console.log("修改密码接口错误:"+error);
		}
	});
}


function black() {
	location.href = "/index.html"
}
