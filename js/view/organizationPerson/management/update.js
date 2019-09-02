
(function(){
	
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
	var add_validator = $('.update .form-horizontal').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        trigger:"change",
        debug:true,
        rules: {        
            u_username:{required: true,},         
            u_userid:{required: true,},
            u_phone:{required: true,correctMobile:true}, 
            u_idCard:{required: true,correctCard:true}, 
            u_age:{correctAge:true}
        },
        messages: {       
           	u_username: { required: "用户名不能为空"}, 
           	u_userid: { required: "员工编号不能为空"}, 
           	u_phone:{required:"不能为空",correctMobile:"请输入正确的手机号"},
            u_idCard:{required:"不能为空",correctCard:'请输入正确的证件号'},  
            u_age:{correctAge:'请输入正确的年龄'}
        },
        highlight: function (element,ele) {
             $(element).addClass("help-block");
        },
        success: function (element,ele) {
            $(ele).removeClass("help-block")
        },
        errorPlacement: function (error, element) {
            //这个地方当输入框失去焦点时，正确情况也走，纳闷了，但是传进来的error是空div判断下，如果是空则不清除提示信息
//          if(error.text()){
//              element.closest('.form-box').find(".placeInfo").remove();
//          }
//          	error.insertAfter(element.parent());
        }
    });          
})()


function initUserInfoUpdate(id){
	if(!$.isLogin()){location.href = '/view/sign/sign.html';}
	var userInfo = $.getUser(id);
	salesId = id;
	if(userInfo == null){return false;}	
	$(".update .usernumber").val(userInfo.salesCode);
	$('.update .username').val(userInfo.salesName);
	$(".update .userid").val(userInfo.salesNum);
	$(".update .profess option[value='"+userInfo.position+"']").attr("selected","selected");
	$(".update .position_status option[value='"+userInfo.status+"']").attr("selected","selected");
	$('.update .email').val(userInfo.email);
	$('.update .phone').val(userInfo.phoneNo);
	$('.update .idType').val(userInfo.idType);
	$('.update .idCard').val(userInfo.idNumber);
	$('.update .age').val(userInfo.age);
	$('.update .entryDate').val(userInfo.entryDate);
	$('.update .graUniversity').val(userInfo.graUniversity);
	$(".update .maxEducation option[value='"+userInfo.maxEducation+"']").attr("selected","selected");
	$('.update .maxDegree').val(userInfo.maxDegree);
	$('.update .awardExperie').val(userInfo.awardExperie);
	$('.update .photoAddress').val(userInfo.photoAddress);
	$('.update .qrcode').val(userInfo.qrCode);
	$('.update .adeptDomain').val(userInfo.adeptDomain);
	$(".entryDate").jeDate({
            format: "YYYY-MM-DD",
            isTime: false,
            theme:{bgcolor:"#D91600",pnColor:"#FF6653"},
            position:['100','200'],
            multiPane:true,  
            minDate: "1990-09-19 00:00:00",
            fixed:true,  
        })
}

function submitUpdate() {
	var result =  $(".update .form-horizontal").valid();
	if(!result) return false;
	var param = {
		salesId : salesId,
		salesName : $('.update .username').val(),
		salesNum : $('.update .userid').val(),
		phoneNo : $('.update .phone').val(),
		idType : $('.update .idType').val(),
		idNumber : $('.update .idCard').val(),
		status : $(".update .position_status").val(),
		position : $('.update .profess').val(),
		email : $('.update .email').val(),
		Age : $('.update .age').val(),
		entryDate : $('.update .entryDate').val(),
		graUniversity : $('.update .graUniversity').val(),
		maxEducation : $('.update .maxEducation').val(),
		maxDegree : $('.update .maxDegree').val(),
		awardExperie : $('.update .awardExperie').val(),
		photoAddress : $('.update .photoAddress').val(),
		qrCode :$('.update .qrcode').val(),
		adeptDomain :$('.update .adeptDomain').val(),
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
					location.reload();
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
