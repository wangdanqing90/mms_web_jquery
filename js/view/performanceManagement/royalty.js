var PageCurrent = 1;
var page_status = false;
var pageCount = 0;
var createTimeStart= "";
var createTimeEnd= "";
var activityName = "";
var createName = "";
var status = $("#royalty-select-state").val();
var type = $('#royalty-select-type').val();

$(function() {
	initTable();
	initPage();
})

//初始化表格列表
function initTable() {
	var params = {
		type: type,
		createTimeStart: createTimeStart,
		createTimeEnd: createTimeEnd,
		activityName: activityName,
		createName: createName,
		status: status,
		pageCurrent: PageCurrent,
		pageSize: 10
	};

	var url = "/api/mms-api/activity/list";
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		data: params,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#royalty-tbody").empty();
				if(data.data.list.length > 0) {
					$.each(data.data.list, function(index, item) {
						var html = "<tr id=" + item.id +" status="+item.status + "><td><label class='checkBox'><input type='checkbox' name='mycheckboxNext'></label></td><td>" + item.activityName + "</td><td class='color-red'>" + item.profitRate + "‰</td>";
						html += "<td><span class=''>" + item.createUser.salesName + "</span></td><td class='color-red'>"
						if(item.status == "ONCHECK") {
							html += "待审";
						} else if(item.status == "PASS") {
							html += "通过";
						} else if(item.status == "REFUSED") {
							html += "驳回";
						} else if(item.status == "INVALID") {
							html += "废弃";
						}
						html += "</td><td>";
						if(item.type == "ACTIVE") {
							html += "活动";
						} else if(item.type == "PRODUCT_COMMISSION") {
							html += "产品";
						}
						html += "</td><td>" + item.createTime + "</td>";
						if(item.status == "PASS"||item.status == "REFUSED"){//通过，驳回
							html += "<td><button class='button-blue-small padding-left-0'  onclick='detail(this)'>详情</button><button class='button-blue-small' disabled onclick='review(this)'>复核</button><button class='button-blue-small' onclick='discard(this)'>废弃</button></td></tr>";
						}else if(item.status == "INVALID"){//废弃
							html += "<td><button class='button-blue-small padding-left-0'  onclick='detail(this)'>详情</button><button class='button-blue-small' disabled onclick='review(this)'>复核</button><button class='button-blue-small' disabled onclick='discard(this)'>废弃</button></td></tr>";
						}else{//待审
							html += "<td><button class='button-blue-small padding-left-0' onclick='detail(this)'>详情</button><button class='button-blue-small' onclick='review(this)'>复核</button><button class='button-blue-small' onclick='discard(this)'>废弃</button></td></tr>";
						}
						
						$("#royalty-tbody").append(html);
					})
				}
			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//翻页
function initPage() {
	var params = {
		type: type,
		createTimeStart: createTimeStart,
		createTimeEnd: createTimeEnd,
		activityName: activityName,
		createName: createName,
		status: status,
		pageCurrent: PageCurrent,
		pageSize: 10
	};

	var url = "/api/mms-api/activity/list";
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		data: params,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				pageCount = data.data.pageCount;

				page_status = true;
				$(".M-box3").show();
				$(".M-box3").pagination({
					pageCount: pageCount,
					jump: true,
					coping: true,
					keepShowPN: true,
					mode: "fixed",
					isHide: true,
					homePage: "首页",
					endPage: "尾页",
					prevContent: "上一页",
					nextContent: "下一页",
					callback: function(api) {
						PageCurrent = api.getCurrent();
						initTable();
					}
				});

			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});

}

//详情
function detail(obj) {
	var id = $(obj).parent().parent().attr("id");
	var status = $(obj).parent().parent().attr("status");
	var selectType = $('#royalty-select-type').val();
	var url = "addActCommission.html?type=1&id=" + id+"&status="+status+"&selectType="+selectType;
	location.href = url;

}

//复核
function review(obj) {
	var id = $(obj).parent().parent().attr("id");
	var status = $(obj).parent().parent().attr("status");
	var selectType = $('#royalty-select-type').val();
	var url = "addActCommission.html?type=3&id=" + id+"&status="+status+"&selectType="+selectType;
	location.href = url;
}

//废弃
function discard(obj) {
	var id = $(obj).parent().parent().attr("id");
    var status = $(obj).parent().parent().attr("status");
    var selectType = $('#royalty-select-type').val();
	var url = "addActCommission.html?type=4&id=" + id+"&status="+status+"&selectType="+selectType;
	location.href = url;
}

//获取选中的checkbox
function getCheckbox(obj) {
	var check_val = [];
	for(var k in obj) {
		if(obj[k].checked) {
			check_val.push(obj[k]);
		}
	}
	return check_val;
}

//批量审核
function BatchAuditBtn() {
	var obj = document.getElementsByName("mycheckboxNext");
	var checkboxs = getCheckbox(obj);
	if(checkboxs.length == 0) {
		$.alert("请先勾选列表");
		return;
	}

	var ids = "";
	$.each(checkboxs, function(index, item) {
		if(ids!=""){
			ids+=","
		}
		ids+=$(item).parent().parent().parent().attr("id");
	})

	var params = {
		ids: ids,
		status:"PASS"
	};

	var url = "/api/mms-api/activity/audits";
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		data: params,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
                $.alert("批量审核成功","",function(){
                	PageCurrent = 1;
                	initTable();
	                initPage();
                });
			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});

}

//批量导入
function BatchImportBtn() {

}

//搜索按钮
function searchBtn() {
	PageCurrent = 1;
    activityName = $("#royalty-header-name").val();
	createName = $("#royalty-header-person").val();
	status = $("#royalty-select-state").val();
	type = $('#royalty-select-type').val();
	
	initTable();
	initPage();
}

//选择时间
var dateLongRangePickerOptionObj = {
	minDate: '2015/01/01 00:00:00', //最小时间
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
	separator: '-',
	defaultDate: new Date(),
	locale: {
		applyLabel: '确定',
		clearLabel: '取消',
		fromLabel: '起始时间',
		toLabel: '结束时间',
		daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
		monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		firstDay: 1
	}
}

$('input[name="daterange"]').daterangepicker(dateLongRangePickerOptionObj, function(start, end, label) {
	createTimeStart  = start == null ? "" : (start.format('YYYY-MM-DD')).toString();
	createTimeEnd = end == null ?"" :(end.format('YYYY-MM-DD')).toString();
	console.log(createTimeStart, createTimeEnd)

})

function hideOrShow(){
	if($("#searchBoxCointer").css("display")=="none"){
		$("#searchBoxCointer").show();
		$("#hideOrShow").html("收起  <i class='icon-angle-down'></i>")
	}else{
		$("#searchBoxCointer").hide();
		$("#hideOrShow").html("展开  <i class='icon-angle-up'></i>")
	}	
}

function allSelect(){
	var obj = document.getElementsByName("mycheckboxNext");
	var checkboxs = getCheckbox(obj);
	if(checkboxs.length == obj.length){
		$("input[name='mycheckboxNext']").prop("checked", false);  
	}else{
		$("input[name='mycheckboxNext']").prop("checked", true);   

	}
}
