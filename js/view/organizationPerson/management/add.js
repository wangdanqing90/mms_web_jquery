
// 初始化的,做表单清空什么的 
function initAdd(){
	$('.add .controls input').val("");	
	$('.add .help-block').remove();
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
	var add_validator = $('.add .form-horizontal').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        trigger:"change",
        
        debug:true,
        rules: {        
            add_user_name:{required: true,}, 
            add_user_password:{required: true,},
            add_phone:{required: true,correctMobile:true}, 
            add_idCard:{required: true,correctCard:true}, 
            add_age:{correctAge:true,},
            add_user_id:{required: true,},
        },
        messages: {       
           	add_user_name: { required: "用户名不能为空"},
           	add_user_password:{required:"不能为空"},
           	add_phone:{required:"不能为空",correctMobile:"请输入正确的手机号"},
            add_idCard:{required:"不能为空",correctCard:'请输入正确的证件号'},
            add_age:{correctAge:'请输入正确的年龄',},
            add_user_id: { required: "用户编号不能为空"},
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

function submitAdd(){
	var result =  $(".add  .form-horizontal").valid();
	if(!result){return false;}
	var param = {
		salesName : $('.add-username').val(),		
		phoneNo : $('.add-phone').val(),
		idNumber : $(".add-idCard").val(),
		position : $('.add-profess').val(),
		email : $(".add-email").val(),
		idType:  $(".add-idType").val(),
		age : $('.add-age').val(),
		status : $(".add_position_status").val(),
		entryDate : $('.add_entryDate').val(),
		graUniversity : $('.add_graUniversity').val(),
		maxEducation : $('.add_maxEducation').val(),
		maxDegree : $('.add_maxDegree').val(),
		photoAddress : $('.add_photoAddress').val(),   //图像地址
		awardExperie :$('.add_awardExperie').val(),   //获奖经历
		qrCode : $('.add_qrcode').val(),
		adeptDomain : $('.add_adeptDomain').val(),     // 擅长领域
		salesNum : $('.add-userid').val() 
		
	}
	
	$.ajax({
		type:"post",
		url:"/api/mms-api/sales/addSales",
		async:true,
		dataType:"json",
		data:param,
		success:function(data){
			if(data.statusCode == 200){
				$.alert('添加成功',"营销管理平台",function(){
					location.href="/view/organizationPerson/management.html";
				})
				
			}else{
				$.alert(data.message)
			}
		},
		error:function(Error){
			console.log("添加用户的错误信息:"+Error)
		}
	});
	
	
}
