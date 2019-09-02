var hasChoosePro = []; //已选产品
var dropOrg = [];  //不参与组织

var type = getUrlParam('type');
var activityId = getUrlParam('id');
var addType = getUrlParam('selectType') == null? 'ACTIVE' : getUrlParam('selectType'); 
var urlStatus = getUrlParam('status');


var createTimeStart  = '';
var createTimeEnd = '';
var activityName = '';
var createName = '';
var status = '';


var repayDateEnd = '';
var repayDateStart = '';
var valueDateStart = '';
var valueDateEnd =  '';

//点击选择产品模态窗
$(function(){
	//判断是活动还是产品
	if(addType == 'PRODUCT_COMMISSION'){
		$('div[name="产品类"]').addClass('active')
		$('div[name="活动类"]').removeClass('active')
		$('#addName').html('产品规则名称');
		$('#ifTime').removeClass('hide');
	}else{
		$('div[name="活动类"]').addClass('active')
		$('div[name="产品类"]').removeClass('active')
		$('#addName').html('活动名称');
		$('#ifTime').addClass('hide');
	}
	

	if(type == 1){ //详情
		$('.details').removeClass('hide').siblings('.ifHideFoot').addClass('hide');
		$('.details button').html('返回');
		unRevise()
		$('#chooseProduct').addClass("disable");
		$('#chooseOrgnize').addClass("disable")
		$('div[name="活动类"]').addClass("disable")
		$('div[name="产品类"]').addClass('disable')
		getActiveInfo();
	}else if(type == 2){ //修改
		$('.revise').removeClass('hide').siblings('.ifHideFoot').addClass('hide');
		unRevise()
		$('#chooseProduct').addClass("disable");
		$('#chooseOrgnize').addClass("disable")
		$('div[name="活动类"]').addClass("disable")
		$('div[name="产品类"]').addClass('disable')
		getActiveInfo()
		
	}else if(type == 3){ //复核
		$('.auditing').removeClass('hide').siblings('.ifHideFoot').addClass('hide');
		unRevise()
		$('#chooseProduct').addClass("disable")
		$('#chooseOrgnize').addClass("disable")
		$('div[name="活动类"]').addClass("disable")
		$('div[name="产品类"]').addClass('disable')
		getActiveInfo();
	}else if(type == 4){ //废弃
		$('.delete').removeClass('hide').siblings('.ifHideFoot').addClass('hide');
		unRevise()
		$('#chooseProduct').addClass("disable");
		$('#chooseOrgnize').addClass("disable")
		$('div[name="活动类"]').addClass("disable")
		$('div[name="产品类"]').addClass('disable')
		getActiveInfo()
		
	}else{
		$('.normalFooter').removeClass('hide').siblings('.ifHideFoot').addClass('hide');
		$('#chooseProduct').removeClass("disable")
		$('#chooseOrgnize').removeClass("disable")
		$('div[name="活动类"]').removeClass("disable")
		$('div[name="产品类"]').removeClass('disable')
	}
	$('#chooseProduct').on('click', function(){
		var hasChoosePro = [];
		$("#model-proName").modal("show");
		channel()
	})
	$('#actions-name').change(function(){
		var value = $('#actions-name').val();
	})
	
	$('#chooseOrgnize').on('click', function(){
		$("#model-orgName").modal("show");
	})
	
	
	//选择规则类型
	$('.achievement-tab .box div').on('click', function(){
		if($(this).hasClass("active")) return;
		
		console.log($(this).attr("name"));
		$(this).addClass('active')
		$(this).siblings('div').removeClass('active');
		
		$('input[name="daterangeQixi"]').val('')
		$('input[name="daterangePay"]').val('')
		reloadPro()
		reloadOrg()
//		addType = $(this).attr("name");
		if($(this).attr("name") == '活动类'){
			$('#addName').html('活动名称');
			$('#ifTime').addClass('hide');
			$('#choose_ProName').html('');
			$('#chooseOrg').html('');
			addType = 'ACTIVE'
		}else{
			$('#addName').html('产品规则名称');
			$('#ifTime').removeClass('hide');
			$('#choose_ProName').html('');
			$('#chooseOrg').html('');
			addType = 'PRODUCT_COMMISSION'
		}
		$('#actions-name').val('');
		$('input[name="daterangeRange"]').val('');
		$('#products-name').val('')
		$('textarea').val('');
		$('#dropOrg li').remove();
		$('#hasChoosed li').remove()
	})
})

//产品渠道选择
function channel(){
	var url = "/api/mms-api/activity/outSystemEnum"
	$.ajax({
		type: "post",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$('#channel').empty();
				var html = "<label style='display:block;'>产品渠道选择：</label><select class='title-after form-control profess margin-bottom-0 span8' id='channel-select' style='height:36px;line-height:30px;border-radius:4px;width:100%'>";
				$.each(data.data, function(i,item){
					if(i == 0){
						html += "<option value='" + item.value + "' selected >"+ item.name +"</option>"
					}else{
						html += "<option value='" + item.value +"' >" + item.name +"</option>"
					}
					
				})
				html += "</select>";
				$('#channel').append(html);
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//使form表单中不能再修改
function unRevise(){
	$('input:radio[name="addRadio"]').attr('disabled', true);
	$('input').attr('readonly', true);
	$('input[name="daterangeRange"]').attr('disabled', true);
	$('textarea').attr('readonly', true)
}

//查询活动或产品提成的信息  -详情
function getActiveInfo(){
	var url = "/api/mms-api/activity/info"
	var param = {
		activityId: activityId
	}
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$('#actions-name').val(data.data.data.activityName);
				//已选产品
				var arr= [];
				var tempArr = data.data.data.exchangeProducts;
				if(tempArr == null){
					return false;
				}else{
					for(var i=0;i<tempArr.length; i++){
						arr.push(tempArr[i])
					}
					let hasChoosePro = Array.from(new Set(arr));
					console.log(hasChoosePro)
					var html = '';
					$.each(hasChoosePro,function(i,item) {
						html += '<li class="checkbox"><label><input type="checkbox"  onclick="return false;" disabled="disabled"   id="' + item.id + '" name="hasChoosedli" checked />'+ item.product_name +'</label></li>'
					});
					$('#hasChoosed').html('')
					$('#hasChoosed').append(html);
				}
				
				//时间
				createTimeStart = data.data.data.startTime == null ? '' : (data.data.data.startTime).substring(0,10);
				createTimeEnd = data.data.data.endTime == null ? '' : (data.data.data.endTime).substring(0,10)
				if(createTimeStart == ''){
					var tempTime = '';
				}else{
					var tempTime =createTimeStart +' - '+ createTimeEnd;
				}
				$('input[name="daterangeRange"]').val(tempTime);
				//不参与组织
				var arrOrg= [];
				var tempArrOrg = data.data.data.excludeOrgs;
				if(tempArrOrg == null){
					//提成比例
					$('#products-name').val(data.data.data.profitRate);
					//说明
					$('.remark').val(data.data.data.remark)
					return false;
				}else{
					for(var i=0;i<tempArrOrg.length; i++){
						arrOrg.push(tempArrOrg[i])
					}
					let dropOrg = Array.from(new Set(arrOrg));
					console.log(dropOrg)
					var orgStr = '';
					$.each(dropOrg, function(i,item) {
						orgStr += '<li class="checkbox"><label><input type="checkbox" disabled="disabled"   name="hasDropOrg" id="' + item.id + '"  checked />' +item.name + '</label></li>'
					});
					$('#dropOrg').html('')
					$('#dropOrg').append(orgStr);
					//提成比例
					$('#products-name').val(data.data.data.profitRate);
					//说明
					$('.remark').val(data.data.data.remark)
				}
				
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//修改
function revise(){
	var totalPro = [];
	var totalOrg = [];
	var tempLi = $('input[name="hasChoosedli"]:checked').map(function(i,ele){
		totalPro.push(JSON.parse($(ele).attr('id')))
	}).get();
	var tempOrg = $('input[name="hasDropOrg"]:checked').map(function(i,ele){
		totalOrg.push(JSON.parse($(ele).attr('id')))
	}).get();
	
	console.log(totalPro)
	var txt = "确定修改么";
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var param = {
				id: activityId,
				activityName: $('#actions-name').val(),
				productIdArr: (totalPro).join(','),
				excludeOrgIdArr:(totalOrg).join(','),
				profitRate: '0.1',
				startTimeStr: createTimeStart,
				endTimeStr: createTimeEnd,
				remark: $('.remark').val()
				
			}
			var url = "/api/mms-api/activity/update";
			$.ajax({
				type: "post",
				url: url,
				async: true,
				data:param,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						alert('操作成功！')
					} else {
						alert(data.message);
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});
	
}

//复核 通过
function auditing(){
	var totalPro = [];
	var totalOrg = [];
	var tempLi = $('input[name="hasChoosedli"]:checked').map(function(i,ele){
		totalPro.push(JSON.parse($(ele).attr('id')))
	}).get();
	var tempOrg = $('input[name="hasDropOrg"]:checked').map(function(i,ele){
		totalOrg.push(JSON.parse($(ele).attr('id')))
	}).get();
	
	console.log(totalPro)
	var txt = "确定通过审核么";
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var param = {
				id: activityId,
				status: 'PASS'
			}
			var url = "/api/mms-api/activity/audit";
			$.ajax({
				type: "post",
				url: url,
				async: true,
				data:param,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						alert('操作成功！',"",function(){
							history.go(-1)
						});
						
					} else {
						alert(data.message);
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});
	
	
	
}
//复核 驳回
function unAutiting(){
	var totalPro = [];
	var totalOrg = [];
	var tempLi = $('input[name="hasChoosedli"]:checked').map(function(i,ele){
		totalPro.push(JSON.parse($(ele).attr('id')))
	}).get();
	var tempOrg = $('input[name="hasDropOrg"]:checked').map(function(i,ele){
		totalOrg.push(JSON.parse($(ele).attr('id')))
	}).get();
	
	var txt = "确定驳回审核么";
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var param = {
				id: activityId,
				status: 'REFUSED'
			}
			var url = "/api/mms-api/activity/audit";
			$.ajax({
				type: "post",
				url: url,
				async: true,
				data:param,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert('操作成功！',"",function(){
							history.go(-1)
						});
					} else {
						alert(data.message);
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});
}

//废弃
function deletes(){
	var totalPro = [];
	var totalOrg = [];
	var tempLi = $('input[name="hasChoosedli"]:checked').map(function(i,ele){
		totalPro.push(JSON.parse($(ele).attr('id')))
	}).get();
	var tempOrg = $('input[name="hasDropOrg"]:checked').map(function(i,ele){
		totalOrg.push(JSON.parse($(ele).attr('id')))
	}).get();
	
	console.log(totalPro)
	var txt = "确定废弃么";
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var param = {
				id: activityId
			}
			var url = "/api/mms-api/activity/delete";
			$.ajax({
				type: "post",
				url: url,
				async: true,
				data:param,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert('操作成功！',"",function(){
							history.go(-1)
						});
						
					} else {
						alert(data.message);
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	});
	
}

//查询活动或产品提成的列表
function activeName(){
	$('.getAll').prop('checked', true)
	var outerSystem = $('#channel-select').val();
	var productName = $('#proName').val();
	if(($('input[name="daterangeQixi"]').val() != '') || ($('input[name="daterangePay"]').val() != '') ||($('#orgName').val() == '') || ($('#orgName').val() != '') ){
		var param = {
			productType: 'EXCHANGE',
			outerSystem: outerSystem,
			productName: productName,
			valueDateStart: valueDateStart,
			valueDateEnd: valueDateEnd,
			repayDateStart: repayDateStart,
			repayDateEnd: repayDateEnd
			
		}
		var url = "/api/mms-api/activity/productList";
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data:param,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				 $('#choose-ProName').empty();
				if(data.statusCode == 200) {
					if(data.data.data.length >0){
						var html = '';
						 $.each(data.data.data, function(i,item){
						 	html += "<li class='checkbox'><label>"
						 	html += "<input type='checkbox'  data='"+ JSON.stringify(item)+ "'  name='hasChoosePro' onclick='checkOne()'  class='checkboxPro'  checked />" + item.product_name
						 	html +="</label></li>";
						 })
						 $('#choose-ProName').append(html);
						 //搜索之后才让全选框显示
						$('.getAllBox').css('display','block')
					}else{
						 $('#choose-ProName').append('<li class="margin-top-20 text-center" style="width:100%;">暂无数据</li>');
						$('.getAllBox').css('display','none')
					}
					
					 
									 
//				$("#model-proName").on('hidden.bs.modal', chooseProduct);
//				$('#model-proName').on('shown.bs.modal', chooseProduct);
//				$("#model-orgName").on('hidden.bs.modal', chooseOrg);
//				$('#model-orgName').on('shown.bs.modal', chooseOrg)
				} else {
					alert(data.message);
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	}else {
		alert("产品名称、起息日区间、兑付日区间不能全为空");
	}
}




//校验
function has(arr,param){
	return arr.some(function(item){
		return item == param
	})
}


//选择产品----渲染待选产品
function chooseProduct(){
	$('.boxOrg').css('display', 'none')
	//判断已选产品表是否为空
		var hasChoosePro = []
		var text = $('input[name="hasChoosePro"]:checked').map(function(i,ele){
			hasChoosePro.push(JSON.parse($(ele).attr('data')))
		}).get();
		var html = '';
		let hasChooseProSave = Array.from(new Set(hasChoosePro)) 
		$.each(hasChooseProSave, function(i,item) {
			html += '<li class="checkbox"><label><input type="checkbox"  onclick="return false;"id="'+ item.id + '"   name="hasChoosedli" checked />'+ item.product_name + '</label></li>'
		});
		$('#hasChoosed').html('')
		$('#hasChoosed').append(html);
}
//确定
function chooseOk(){
	chooseProduct()
}
function chooseOrgOk(){
	chooseOrg()
}

//选择不参与的组织
function transferSearchBtn() {
	$('.getAll').prop('checked', true)
	var orgName = $("#orgName").val();
	var url = '/api/mms-api/performance/searchOrg';
	var param = {
		orgName: orgName
	}
	$.ajax({
		type: "post",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		data: param,
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#chooseOrg").empty();
				if(data.data.length > 0) {
					var html = '';
					$.each(data.data, function(index, item) {
						html += "<li class='checkbox'><label><input  data='"+ JSON.stringify(item) +"' type='checkbox' onclick='checkTwo()' class='checkboxOrg' name='hasChooseOrg' checked />"+ item.name +"</label></li>"     
					})
					$("#chooseOrg").append(html);
					$('.getAllBox').css('display','block')
//					$("#model-orgName").on('hidden.bs.modal', chooseOrg);
//					$('#model-orgName').on('shown.bs.modal', chooseOrg)
				}else{
					
					$("#chooseOrg").append('<li class="text-center" style="width:100%;margin-top:20px">暂无数据</li>');
				}
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//渲染不参与组织
function chooseOrg(){
	
	var dropOrg = []
	var org = $('input[name="hasChooseOrg"]:checked').map(function(i,ele){
		dropOrg.push(JSON.parse($(ele).attr('data')))
	}).get();
	var html = '';
	let dropOrgSave = Array.from(new Set(dropOrg))
	$.each(dropOrgSave, function(i,obj) {
		html += '<li class="checkbox"><label><input type="checkbox"  readonly  onclick="return false;"  class="checkboxOrg" name="hasDropOrg" id="' + obj.id + '"  checked />' + obj.name + '</label></li>'
	});
	$('#dropOrg').html('')
	$('#dropOrg').append(html);
}

		
          
function checkOne(){ 
    var count = 0;  
    $(".checkboxPro").each(function(){
        if($(this).attr('checked') != 'checked'){// 判断一组复选框是否有未选中的  
            count+=1;  
        }  
    });  
    if(count == 0) { // 如果没有未选中的那么全选框被选中  
        $('.getAll').attr('checked', 'true');  
    } else {  
        $('.getAll').removeAttr('checked');  
    }  
}
function checkTwo(){ 
    var count = 0;  
    $(".checkboxOrg").each(function(){
        if($(this).attr('checked') != 'checked'){// 判断一组复选框是否有未选中的  
            count+=1;  
        }  
    });  
    if(count == 0) { // 如果没有未选中的那么全选框被选中  
        $('.getAll').attr('checked', 'true');  
    } else {  
        $('.getAll').removeAttr('checked');  
    }  
}
//全选按钮
function getAllPro(){
	var count = 0;  
    $(".checkboxPro").each(function(){
        if($(this).attr('checked') != 'checked'){// 判断一组复选框是否有未选中的  
            count+=1;  
             $('.checkboxPro').attr('checked',false)
        }
    }); 
    if($('.getAll').is(':checked')){
    	if(count > 0){
    		$('.checkboxPro').attr('checked',true)
    	}else{
    		$('.checkboxPro').attr('checked',false)
    	}
    }else{
    	$('.checkboxPro').attr('checked',false)
    }
}
function getAllOrg(){
	var count = 0;  
    $(".checkboxOrg").each(function(){
        if($(this).attr('checked') != 'checked'){// 判断一组复选框是否有未选中的  
            count+=1;  
             $('.checkboxOrg').attr('checked',false)
        }
    }); 
    if($('.getAll').is(':checked')){
    	if(count > 0){
    		$('.checkboxOrg').attr('checked',true)
    	}else{
    		$('.checkboxOrg').attr('checked',false)
    	}
    }else{
    	$('.checkboxOrg').attr('checked',false)
    }
}
//重置
function reload(){
	$("#chooseOrg").empty();
	$("#radio-act").val('ACTIVE')
	$("#radio-pro").val('PRODUCT_COMMISSION')
	addType = 'ACTIVE';
	$('#addName').html('活动名称');
	$('#actions-name').val('');
	$('input[name="daterangeRange"]').val('');
	$('#products-name').val('')
	$('textarea').val('');
	$('#dropOrg li').remove();
	$('#hasChoosed li').remove()
	reloadPro()
	reloadOrg()
	valueDateStart = '';
	valueDateEnd =  '';
	repayDateStart = '';
	repayDateEnd = '';
}

//重置产品
function reloadPro(){
	$("#model-proName input").val('')
	$('#choose-ProName input:checkbox').attr('checked',false);
	$('#choose-ProName li').remove()
	$('.getAllBox').css('display', 'none')
//	$('input[name="daterangeRange"]').val('');
}
//重置活动
function reloadOrg(){
	$("#model-orgName input").val('')
	$('#chooseOrg input:checkbox').attr('checked',false);
	$('#chooseOrg li').remove()
$('.getAllBox').css('display','none')
//	$('input[name="daterangeRange"]').val('');
}



//时间选择
var dateLongRangePickerOptionObj = {
    minDate: '2015/01/01 00:00:00',    //最小时间
    showDropdowns: true,
    showWeekNumbers: false, //是否显示第几周
//  dateLimit: {days: 300}, //起止时间的最大间隔
    timePicker: true,
    timePickerIncrement: 1, //时间的增量，单位为分钟
    timePicker12Hour: false,
    opens: 'right', //日期选择框的弹出位置
    buttonClasses: ['btn btn-default'],
    applyClass: 'btn-small btn-primary blue',
    cancelClass: 'btn-small',
    format: 'YYYY/MM/DD ', //控件中from和to 显示的日期格式MM/DD/YYYY
    separator: ' - ',
    defaultDate: new Date(),
    locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '起始时间',
        toLabel: '结束时间',
        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
    }
}
//起息日
$('input[name="daterangeQixi"]').daterangepicker(dateLongRangePickerOptionObj,function(start, end, label) {
        valueDateStart = start == null ? "" : (start.format('YYYY-MM-DD HH:mm:ss')).toString();
        valueDateEnd = end == null ? "" : (end.format('YYYY-MM-DD HH:mm:ss')).toString();
       
 })
$('input[name="daterangePay"]').daterangepicker(dateLongRangePickerOptionObj,function(start, end, label) {
        repayDateStart = start == null ? "" : (start.format('YYYY-MM-DD HH:mm:ss')).toString();
        repayDateEnd = end == null ? "" : (end.format('YYYY-MM-DD HH:mm:ss')).toString();
       
 })
$('input[name="daterangeRange"]').daterangepicker(dateLongRangePickerOptionObj,function(start, end, label) {
        createTimeStart = start == null ? "" : (start.format('YYYY-MM-DD HH:mm:ss')).toString();
        createTimeEnd = end == null ? "" : (end.format('YYYY-MM-DD HH:mm:ss')).toString();
        console.log(createTimeStart,createTimeEnd)
       
 })

//提交 - 添加活动信息
function addSubmit(){
	var totalPro = [];
	var totalOrg = [];
	var tempLi = $('input[name="hasChoosedli"]:checked').map(function(i,ele){
		totalPro.push(JSON.parse($(ele).attr('id')))
	}).get();
	var tempOrg = $('input[name="hasDropOrg"]:checked').map(function(i,ele){
		totalOrg.push(JSON.parse($(ele).attr('id')))
	}).get();
	
	//判断是活动还是产品
//	$('input:radio[name="addRadio"]').click(function(){
//	addType = $('input:radio[name="addRadio"]:checked').val();
//	})
console.log(addType,100)
	
	var param = {
		type:  addType,
		productType: 'EXCHANGE', //目前只有理财，先写死理财
		activityName: $('#actions-name').val(),
		productIdArr: (totalPro).join(','),
		excludeOrgIdArr:(totalOrg).join(','),
		profitRate: $('#products-name').val(),
		startTimeStr: createTimeStart,
		endTimeStr: createTimeEnd,
		remark: $('.remark').val()
		
	}
	var url = "/api/mms-api/activity/add";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data:param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
//				$.alert('操作成功！',"",function(){
//					history.go(-1)
//				});
				if((type != 1) && (type != 2) && (type != 3) && (type != 4) ){
					$.alert('操作成功！', '', function(){
						location.reload()
					})
				}else{
					$.alert('操作成功！',"",function(){
						history.go(-1)
					});
				}
				
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}



/*获取到Url里面的参数*/
function getUrlParam(name){
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if (r != null) return unescape(r[2]); return null;
}

function back(){
	history.go(-1);
}
//单纯性的关闭模态框
function goBack(){
	$("#chooseOrg").empty();
	reloadPro()
	$("#model-proName").modal("hide");
	//清空数据
	$("#model-proName").on('hidden.bs.modal');
	$('#model-proName').on('shown.bs.modal');
	$('input[name="daterangeQixi"]').val('')
	
}
function goBackOrg(){
//	reloadOrg()
//$('.getAllBox').css('display','none')
	$("#model-orgName input").val('')
	$("#model-orgName").modal("hide");
	$("#chooseOrg").empty();
	$('.getAllBox').hide()
	//清空数据
//	$("#model-orgName").on('hidden.bs.modal');
//	$('#model-orgName').on('shown.bs.modal');
}

