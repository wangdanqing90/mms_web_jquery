/*
 *  Creat By  Maybe;
 *  2019/3/15
 * */

var pageStatus = true;
var pageCurrent = 1;
var nowId;
var startTime = "";
var endTime = "";

var operator = "";
var operateStartDate = "";
var operateEndDate	= "";
var checkType = "";
var	status = "";

var oprArr = {
	"ADD" : "新增",
	"OPENED" : "启用",
	"INVALID" : "禁用",
	"IMPORT" : '导入'
};


$(function(){	
	getCheckTypes()
// 获取组织审核信息列表	
   getOrangizList();
   
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
    format: 'YYYY/MM/DD', //控件中from和to 显示的日期格式MM/DD/YYYY
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

$('input[name="daterange"]').daterangepicker(dateLongRangePickerOptionObj,function(start, end, label) {		
        startTime = start == null ? "" : (start.format('YYYY-MM-DD')).toString();
        endTime = end == null ? "" : (end.format('YYYY-MM-DD')).toString();
        console.log(startTime,endTime)      
   })
   
   
   
})


// 获取下拉列表
function getCheckTypes(){
	$.ajax({
		type:"get",
		url:"/api/mms-api/orgCheck/getCheckTypes",		
		contentType:'application/x-www-form-urlencoded',
		async:true,		
		success:function(data){
			if((data.statusCode == 200)){				
				if(data.data.checkTypeList.length > 0){
					var html = " ";
					$.each(data.data.checkTypeList,function(index,item){
						html += '<option value='+item.code+' >'+item.desc+'</option>';
					})
					$('.s-type').append(html);
				}
				if(data.data.statusList.length > 0){
					var html = " ";
					$.each(data.data.statusList,function(index,item){
						html += '<option value='+item.code+' >'+item.desc+'</option>';
					})
					$('.s-status').append(html);
				}
			}
		},
		error:function(error){
			$.alert("查询失败!");
		}		
	})
}


	
// 获取组织审核信息列表
function  getOrangizList(flag){	
	if(flag){
		pageStatus = true;
		$(".M-box3").hide();
		pageCurrent = 1;		
		operator = $('.s-name').val();
		operateStartDate = startTime;
		operateEndDate = endTime;
		checkType = $(".s-type").val();
		status =  $(".s-status").val();
	}
	var param = {
		pageCurrent :pageCurrent,
		pageSize : 6,
		operator : operator,
		startTime : operateStartDate,
		endTime : operateEndDate,
		checkType : checkType,
		status :  status,
	}
	$.ajax({
		type:"post",
		url:"/api/mms-api/orgCheck/search",
		async:true,
		contentType:'application/x-www-form-urlencoded',	
		data:param,
		success:function(data){
			if((data.statusCode == 200) && (data.data.list.length > 0)){
				data = data.data;
				// 初始化分页
				if(pageStatus && (data.pageCount != 0)){					
					initPage(data.pageCount);					
				}
				var html  = "";
				$.each(data.list,function(index,item){
					// 字母翻译成中文
					var status = item.status == "ONCHECK" ? "待审核" : item.status == "PASS" ? "通过" : "驳回";				
					item.type = item.type ? item.type : "JOIN";
					html += '<tr>';
						html += '<td>'+ (index + 1) +'</td>';
						html += '<td>'+ item.createTime +'</td>';
						html += '<td>'+ item.operatorName +'</td>';
						html += '<td>'+ item.operatorCode +'</td>';
						html += '<td>'+ oprArr[item.type] +'</td>';
						html += '<td>'+ status +'</td>';
						html += '<td class="text-center"> <button class="button-blue-small" onclick="details(\''+item.id+'\',\''+ item.status +'\')">详情</button> </td>';
					html += '</tr>';
					status = flag = null;
				})
				$('.role-tbody').empty().append(html);				
			}else{
				$('.role-tbody').empty();
			}
		},
		error:function(error){
			console.log("获取列表信息接口错误信息" + error)
		}
		
	});
	
}
// 分页初始化
function initPage(pageCount){
	if(pageCount == undefined){return false;}
	$(".M-box3").show();
	$(".M-box3").pagination({
			pageCount:pageCount,
			jump: true,
			coping: true,
			keepShowPN: true,
			mode: "fixed",			
			homePage: "首页",
			endPage: "尾页",
			prevContent: "上一页",
			nextContent: "下一页",
			callback: function(api) {				
					pageStatus = false;					
					pageCurrent = api.getCurrent();
					getOrangizList();							
			}
	});	
}
// 详情
function details(id,status){
	nowId = id;
	var statusText = status == "ONCHECK" ? "待审核" : status == "PASS" ? "通过" : "驳回";
	$.ajax({
		type:'get',
		url:'/api/mms-api/orgCheck/'+ id +'/details',
		async:true,
		success:function(data){
			 if((data.statusCode == 200) && (data.data.length != 0)){
			 	var html = "";
			 	$.each(data.data, function(index,item) {
			 		html += '<tr>';
						html += '<td>'+ item.createTime +'</td>';
						html += '<td>'+ item.operatorName +'</td>';
						html += '<td>'+ item.orgName +' | ' + item.originalOrgStatus+'</td>';
//						html += '<td>'+ item.salesPhone +'</td>';						
						html += '<td>'+  item.orgName +' | ' + item.currentOrgStatus+'</td>';
//						html += '<td>'+ item.salesPhone +'</td>';
						html += '<td>'+ statusText +'</td>';
					html += '</tr>';
			 	});
			 	if(status == "ONCHECK"){
			 		$('.btn-check').removeClass("hide");
			 	}else{
			 		$('.btn-check').addClass("hide");
			 	}
			 	$('#model-detail #modal-role-tbody').empty().append(html);			 	
			 	$("#model-detail").modal("show");
			 }
		},
		error:function(error){
			$.alert("网络忙,请稍后再试!");
			console.log("查询用户信息接口报错:" + error);
		}
	})
	
}

function resolve(){	
	$.ajax({
		type:'post',
		url:'/api/mms-api/orgCheck/'+ nowId +'/pass',
		async:true,
		success:function(data){
			$('.modal').modal('hide');
			getOrangizList();
			$.alert(data.message);
		},
		error:function(error){
			$('.modal').modal('hide');
			console.log("审核通过的错误信息返回"+error);
		}
		
	})
}

function reject(){
	$.ajax({
		type:'post',
		url:'/api/mms-api/orgCheck/'+ nowId +'/refuse',
		async:true,
		success:function(data){
			$('.modal').modal('hide');
			getOrangizList();
			$.alert(data.message);
		},
		error:function(error){
			$('.modal').modal('hide');
			console.log("审核通过的错误信息返回"+error);
		}
		
	})
}

function locaBlack(){
	$('.modal').modal("hide");
}
