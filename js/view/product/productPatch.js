/*
 Creat by maybe 
 2019-02-22 
 * */
$(function(){
		getProductEnums();

		/** 添加age验证 */
	    $.validator.addMethod("correctNumber",function(value,element){
	        return $.isNumber(value);
	    });	
	     $.validator.addMethod("correctLimtEnd",function(value,element){
	       var startTime = $('.startTime').val();
	       var endTime = $('.endTime').val();
	       if(endTime == ""){return true;}
	       if(endTime < startTime){
	       	return false;
	       }else{
	       	return true;
	       }
	    });	
	    
	    $.validator.addMethod("correctLimtTime",function(value,element){
	       var startTime = $('.proStartDate').val();
	       var endTime = $('.proEndDate').val();
	       if(endTime == ""){return true;}
	       if(endTime < startTime){
	       	return false;
	       }else{
	       	return true;
	       }
	    });	
	    
    	var validator = $('.form-horizontal').validate({
    	onfocusout: function(element) { $(element).valid(); },
    	errorElement: 'div',
        errorClass: 'help-block',
        trigger:"change",
        debug:true,
        rules: {        
            proNum:{required: true,},           
            proName:{required: true,},
            proTime:{correctNumber:true},
            proRate:{required: true,},
            minMonely:{required: true,correctNumber:true},           
            proScale:{correctNumber:true},          
            proStartDate:{required: true,correctLimtTime:true,},
            proEndDate:{required: true,correctLimtTime:true,}, 
            creatTime:{required: true,},
            startTime:{required: true,correctLimtEnd:true},
            endTime:{required: true,correctLimtEnd:true},
            honour:{required: true},
            maxInvestAmount:{correctNumber:true}                              
        },
        messages: {       
            proNum: { required: "用户名不能为空",correctNumber:"请输入正确的此字段"},        
            proName:{required: "不能为空",},
            proTime:{required: "不能为空",},
            proRate:{required: "不能为空",},
            minMonely:{required: "不能为空",},                       
            proStartDate:{required: "不能为空",},
            proEndDate:{required: "不能为空",},                               
            maxInvestAmount:{correctNumber:true}
            
        },
        highlight: function (element,ele) {
        	//$(element).addClass("error").parent().prev().find(".asterisk").removeClass("hide");
        	$(element).addClass("error");
  
        },
        success: function (element,ele) {
//      	console.log(element)
        	console.log($(this));
           //	$(ele).removeClass("error").parent().prev().find(".asterisk").addClass("hide");
            $(ele).removeClass("error")
       
        },
        errorPlacement: function (error,element) {
            //这个地方当输入框失去焦点时，正确情况也走，纳闷了，但是传进来的error是空div判断下，如果是空则不清除提示信息
             if(error.text()){
             }
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
//          isinitVal:true,
            clearfun:function(elem, val) {
              $(elem).valid(); 
            },    
            choosefun:function(elem,val) { 
            	$(elem).valid(); 
            }
       })   
})

function upperCase(obj){//用户只能输入正负数与小数
	if(isNaN(obj.value) && !/^$/.test(obj.value)){
		obj.value="";
	}
	if(!/^[+-]?\d*\.{0,1}\d{0,1}$/.test(obj.value)){
		obj.value=obj.value.replace(/\.\d{2,}$/,obj.value.substr(obj.value.indexOf('.'),3));
	}
}

function submitForm() {
	
 	var resultStr =  $(".form-horizontal").valid();
	console.log(resultStr);
	if(!resultStr) return  false;
    var _value = $('.proNum').val();
	checkProCode(_value).then(function(data){
	var proRate  = 	$('.proRate').val();
	//proRate =  parseFloat(proRate / 100);
		var param = {
			productCode:$('.proNum').val(),
			productName:$('.proName').val(),
			interestRate:proRate,
	        repayMethod:$('.repayment').val(),
	        riskType:$('.riskType').val(),
	        raiseStartDate:$('.startTime').val(),
	        raiseEndDate:$('.endTime').val(),
	        valueDate:$('.proStartDate').val(),
	        dueDate:$('.proEndDate').val(),
	        durationDays:$('.proTime').val(),
	        createDate:$('.creatTime').val(),
	        repayDate:$('.honour').val(),
	        minInvestAmount:$('.minMonely').val(),
	        totalAmount:$('.proScale').val(),
	        maxInvestAmount:$('.maxInvestAmount').val(),
	        isManual : true,
	        status: $(".status").val(),
	        outerSystem : $(".outerSystem").val()
		}
		$.ajax({
			type:"post",
			url:"/api/mms-api/product/addNew",
			async:true,
			data:param,
			dataType:'json',
			contentType:"application/x-www-form-urlencoded",	
			success:function(data){
				if(data.statusCode == 200){
					$.alert("添加成功!","营销管理平台",function(){
						location.href = "/view/product/productPatch.html"
					})
				}else{
					$.alert(data.message);
				}
				
			},
			error:function(error){
				$.alert("网络忙请稍后再试!")
			}
		});
	}).catch(function(error){
		$.alert(error);
		return false;
	})
		
	
	
			
}

function checkProCode(value){
	var param = {
		productCode : value,
	}
	return  new Promise(function(resolve,reject){
		$.ajax({
		type:"post",
		url:"/api/mms-api/product/checkProductCode",
		async:true,
		data:param,
		dataType:'json',
		contentType:"application/x-www-form-urlencoded",	
		success:function(data){
			if(data.statusCode == 200){
				resolve("编号合法")
			}else{
				reject(data.message)
			}
		},
		error:function(error){			
			reject("网络忙请稍后再试!")
		}
		});
	})
	 
}

function black() {
	location.href = "/index.html"
}


function getProductEnums(){	
	$.ajax({
		url:'/api/mms-api/product/getProductEnums',
		type:'get',
		data:"",
		async:true,
		dataType:"json",
		success:function(data){
			if(data.statusCode == 200){
				eachLsit(data.data.outerSystemList,".outerSystem");
				eachLsit(data.data.repayMethodList,".repayment");
				eachLsit(data.data.riskTypeList,".riskType");
				eachLsit(data.data.statusList,".status");
			}
		},
		error:function(error){
			$.alert("网络忙,请稍后在试!")
		}		
	})	
}


function eachLsit(orgain,ele){
	var html = "";
	if(orgain.length == 0){return false;}
	$.each(orgain, function(index,item) {
		html += "<option value='"+item.code+"' >"+item.desc+"</option>";
	});
	$(ele).append(html);
}
