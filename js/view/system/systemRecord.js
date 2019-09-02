/*
 *  Creat By  Maybe;
 *  2019/3/15
 * */

var pageStatus = true;
var pageCurrent = 1;
var nowId;
var startTime = "";
var endTime = "";
var oprArr = {
	"ADD" : "新增",
	"OPENED" : "启用",
	"INVALID" : "禁用",
	"IMPORT" : '导入'
};
var operator = "";
var eventId = "";
var operateStartDate = "";
var operateEndDate	= "";
var type = "";


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
		url:"/api/mms-api/sysLog/getSearchEnums",		
		contentType:'application/x-www-form-urlencoded',
		async:true,		
		success:function(data){
			if((data.statusCode == 200)){				
				if(data.data.typeList.length > 0){
					var html = " ";
					$.each(data.data.typeList,function(index,item){
						html += '<option value='+item.code+' >'+item.desc+'</option>';
					})
					$('.s-type').append(html);
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
		eventId = $('.c-name').val();
		operateStartDate = startTime;
		operateEndDate =  endTime;
		type = $('.s-type').val();
	}
	var param = {
		pageCurrent :pageCurrent,
		pageSize : 10,
		operator : operator,
		eventId : eventId,
		operateStartDate : operateStartDate,
		operateEndDate : operateEndDate,	
		type : type
	}
	$.ajax({
		type:"post",
		url:"/api/mms-api/sysLog/search",
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
					item.operatorCode = item.operatorCode == null ? " " : item.operatorCode;
					item.operatorName = item.operatorName == null ? " " : item.operatorName;
//					item.checkStatus = item.checkStatus == null ? "无需审核 " : item.checkStatus;
					item.eventId = item.eventId  ? item.eventId  : "";
					html += '<tr>';
						html += '<td>'+ (index + 1) +'</td>';
						html += '<td>'+ item.createTime +'</td>';
						html += '<td>'+ item.eventId +'</td>';
						html += '<td>'+ item.operatorCode + "  |  " + item.operatorName +'</td>';
//						html += '<td>'+ item.checkerCode+ "  |  " + item.checkerName +'</td>';
						html += '<td>'+ item.type +'</td>';	
//						html += '<td>'+ item.checkStatus +'</td>';	
						html += '<td class="text-center"> <button class="button-blue-small" onclick="details(\''+item.id+'\')">详情</button> </td>';
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
function details(id){
	nowId = id;	
	$.ajax({
		type:'get',
		url:'/api/mms-api/sysLog/'+nowId+'/details',
		async:true,
		dataType:'json',
		success:function(data){
			 if((data.statusCode == 200) ){
			 	var html = "";
			 		var item = data.data;
					item.oldValue = (item.oldValue == "") || (item.oldValue == null) ? " " : JSON.stringify(JSON.parse(item.oldValue), null, 4);
					item.newValue = (item.newValue == "") || (item.newValue == null) ? " " : JSON.stringify(JSON.parse(item.newValue), null, 4);
		 			html += '<tr style="white-space: pre-wrap;">';
		 				html += '<td style="white-space: pre;">'+item.oldValue +'</td>';
						html += '<td style="white-space: pre;">'+item.newValue +'</td>';							
					html += '</tr>';
			 				 					 	
			 	
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
