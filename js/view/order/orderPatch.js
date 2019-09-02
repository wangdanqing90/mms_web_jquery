/*
 Creat by maybe 
 2019-02-22 
 * */

var id = "";
var _num = "one";
var  filesList = {
	'one':'/api/mms-api/order/downloadBaseFile',  // get
	'two':'/api/mms-api/order/importBaseFile',   // post
	'three':'/api/mms-api/order/downloadTemFile', //get
	'four':'/api/mms-api/order/improtTmpFile'  //post
}
var resultVal = '';
$(function(){
		orderEnums();		
		/** 添加age验证 */
	    $.validator.addMethod("correctNumber",function(value,element){
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
        onfocusout: function(element) { $(element).valid(); },
		onsubmit:false,
        trigger:"blur",
        debug:true,
        rules: {        
            orderNum:{required: true,},           
            orderMonely:{required: true,},
            orderType:{required: true,},
            orderTime:{required: true,},
            orderChannel:{required: true,},
            expected:{required: true,},
            customerName:{required: true,},
            customerPhone:{required: true,correctMobile:true},
            registerPhone:{required: true,correctMobile:true},
            customerCard:{required: true,correctCard:true},
            customerBank:{required: true,correctNumber: true},
            bankType:{required: true,},
            productNum:{required: true,},
            productName:{},
            productDay:{},
            productRate:{},
                               
        },
        messages: {       
            orderNum: {required: "用户名不能为空",},        
            orderMonely:{required: "不能为空",},
            orderType:{required: "不能为空",},
            orderChannel:{required: "不能为空",},
            expected:{required: "不能为空",},
            customerName:{required: "不能为空",},
            customerPhone:{required: "不能为空",},
            registerPhone:{required: "不能为空"},
            customerCard:{required: "不能为空",},
            customerBank:{required: "不能为空",},
            bankType:{required: "不能为空",},
            productNum:{required: "不能为空",},
            productName:{required: "不能为空",},
            productDay:{required: "不能为空",},
            productRate:{required: "不能为空",},
            
        },
        highlight: function (element,ele) {
        	$(element).addClass("error");
  
        },
        success: function (element,ele) {
        	console.log(element)
        	console.log($(this));
           	$(ele).removeClass("error");
       
        },
        errorPlacement: function (error,element) {
            //这个地方当输入框失去焦点时，正确情况也走，纳闷了，但是传进来的error是空div判断下，如果是空则不清除提示信息
            if(error.text()){
            }
            	
        }
    }); 
    
    	$(".date").jeDate({
            format: "YYYY-MM-DD hh:mm:ss",
            isTime: false,
            theme:{bgcolor:"#D91600",pnColor:"#FF6653"},
            position:['100','200'],
            multiPane:true,  
            minDate: "2014-09-19",
            clearfun:function(elem, val) {
              $(elem).valid(); 
            }, 
   
            choosefun:function(elem,val) { 
            	$(elem).valid(); 
            }
            
        })
    
		$('.productNum').on("blur",function(){
			var _value = $(this).val();
			getProductDetail(_value);
		})
			 
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
	
	
	
}


function submitForm() {
	resultVal =  $(".form-horizontal").valid();
	console.log(resultVal);
	if(!resultVal) return  false;
	
	if($.isNullOrBlank($(".productName").val()) ||$.isNullOrBlank($(".productDay").val() )||$.isNullOrBlank($(".productRate").val()) ||$.isNullOrBlank($(".valueDate ").val())||$.isNullOrBlank($(".repayDate").val()) )
	{
		$.alert("请输入正确的产品编号");
		return false;
	}
	
	var param = {
		orderNo:$('.orderNum').val(),
		orderDate:$('.orderTime').val(),
		orderAmount:$('.orderMonely').val(),
        orderType:$('.orderType').val(),
        outerSystem:$('.orderChannel').val(),
        expectReturn:$('.expected').val(),
        customerName:$('.customerName').val(),
        phone:$('.registerPhone').val(),
        status : $('.status').val(),
        accountPhone:$('.customerPhone').val(),
        identityType:$(".cardType").val(),
        identityNo:$('.customerCard').val(),
        bankCardNo:$('.customerBank').val(),
        bankName:$('.bankType').val(),         
        isManual : true,
        productId:id                
	}
	$.ajax({
		url:'/api/mms-api/order/addNew',
		type:"post",
		async:true,
		data:param,
		success:function(data){
			if(data.statusCode == 200){
				location.href = "orderList.html"
			}else{
				$.alert(data.message);
			}
		},
		error:function(error){
			console.log(error);
			$.alert("网络忙,请稍后再试!");
		}
		
		
		
	})
	
	
	
	
}


function black() {
	location.href = "/index.html"
}


// 遍历下拉框
function orderEnums(){
	$.ajax({
		type:"get",
		url:"/api/mms-api/order/getEnums",
		async:true,
		success:function(data){
			if(data.statusCode == 200){
				eachLsit(data.data.outerSystemList,".orderChannel");
				eachLsit(data.data.orderTypeList,".orderType");
				eachLsit(data.data.identityTypeList,".cardType");
				eachLsit(data.data.orderStatusList,".status");			
			}
		},
		error:function(error){
			
		}
	});
}
function eachLsit(orgain,ele){
	var html = "";
	if(orgain.length == 0){return false;}
	$.each(orgain, function(index,item) {
		html += "<option value='"+item.code+"' >"+item.desc+"</option>";
	});
	$(ele).append(html);
}


function getProductDetail(code){
	if(code == ""){
		 return $('.productName,.productRate,.valueDate,.repayDate,.productDay').val("");		
	}
	var param = {
			productCode : code,
			outerSystem :$('.orderChannel').val()
		}
	$.ajax({
		type:"post",
		url:"/api/mms-api/order/getProduct",
		async:true,
		data:param,
		success:function(data){
			if(data.statusCode == 200 && data.data != undefined){
				//$('.btn_change_datasource').attr('disabled',false)
				id =  data.data.id;
				var productName = data.data.productName;
				$('.productName').val(data.data.productName)
				var interestRate = data.data.interestRate + "%";
				$('.productRate').val(interestRate);
				var valueDate = data.data.valueDate;								
				$('.valueDate').val(valueDate.substr(0,10));
				var repayDate = data.data.repayDate;
				$('.repayDate').val(repayDate.substr(0,10));
				var productDay = data.data.durationDays;
				productDay = productDay == null ? "" : productDay;
				$('.productDay').val(productDay);
			}else{
				$('.productName,.productRate,.valueDate,.repayDate,.productDay').val("");
				//$('.btn_change_datasource').attr('disabled',true)
			}
		},
		error:function(error){
			console.log(error);
		}
		
	});			
            	
}
function upload() {　
	document.getElementById("fileId").click();
}

function filechange(el) {
	$(".file-input-name").remove();
}
function updatefile(num){
	_num = num;
	if((_num == "one") || (_num == "three")){
		window.open(filesList[_num])
	}else{
		$('#fileId').val("");  
		$('.file-input-name').empty(); 
		$('#model-upload').modal("show");
	}
	
}

function check() {
	var objFile = document.getElementById("fileId");
	if(objFile.value == "") {
		$('#fileId').val("");  
		$('.file-input-name').empty(); 
		$('#model-upload').modal("hide");
		$.alert("不能为空,请选择文件");
		return;
	}
	var files = $('#fileId').prop('files'); //获取到文件列表
	if(files.length == 0) {
		alert('请选择文件');
	} else {
		try{    	
	    	if(files[0].size > (2*1024*1024*10)){ 	 
	    		 throw "上传文件大小不能大于20M！";
	    		 return false;
	    	}
	    	var AllExt="|.xlsx|.xls";
	    	if(AllExt.indexOf(files[0].name.split(".")[1])==-1){                                
	                throw "该文件类型不允许上传";
	                return false;
	      	}    	   	
	   }catch(e){
	   		$('#fileId').val("");  
			$('.file-input-name').empty(); 
			$('#model-upload').modal("hide");
	    	$.alert(e);
	    	return false;
	    }
		
		
		
		var formData = new FormData();
		var name = $("#fileId").val();
		formData.append("excel", document.getElementById("fileId").files[0]);		
		var url = filesList[_num];
		$.ajax({
			type: 'post',
			url: url,
			async: true,
			contentType: false,
			dataType: "json",
			processData: false,
			data: formData,
			success: function(data) {
			    $('#fileId').val("");  
				$('.file-input-name').empty(); 
				$('#model-upload').modal("hide");
				if(data.statusCode == 200) {
					$.alert("上传成功");					
				} else {
					$.alert(data.message);
				}
			},
			error: function(error) {
					$.alert("网络忙,请稍后再试");
			}
		});
	}
}

