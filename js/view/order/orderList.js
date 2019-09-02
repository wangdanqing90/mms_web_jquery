var isSearch = false;
var pageCurrent = 1;
var page_status = false;
var pageCount = 0;
var pageSize = 10;

//搜素条件
var productName = '';
var minInvestAmountLower = '';
var minInvestAmountUpper = '';
var outerSystem = '';
var isManual = '';
var outerSystem = '';
var customerName = '';
var phone = '';
var accountPhone = '';
var identityNo = '';
var salesName = '';
var salesNo = '';
var status = '';
//订单时间范围
var orderStartTime = '';
var orderEndTime = '';
//起息日范围
var valueStartDate = '';
var valueEndDate = '';
//兑付日范围
var repayStartDate = '';
var repayEndDate = '';

//订单时间范围临时
var orderStartTimeTemp = '';
var orderEndTimeTemp = '';
//起息日范围临时
var valueStartDateTemp = '';
var valueEndDateTemp = '';
//兑付日范围临时
var repayStartDateTemp = '';
var repayEndDateTemp = '';


$(function() {
	//初始化订单时间为最近七天
	var curDate = new Date();
	orderStartTime=$.getFormatDate(new Date(curDate.getTime() - 24*60*60*7000));
	orderEndTime = $.getFormatDate(curDate) ;
	orderStartTimeTemp=$.getFormatDate(new Date(curDate.getTime() - 24*60*60*7000));
	orderEndTimeTemp = $.getFormatDate(curDate) ;
	$('input[name="orderDate"]').val(orderStartTime+" - "+orderEndTime)

	
	initSelect();
	initTable();
	initPage();
})

//时间选择
var dateLongRangePickerOptionObj = {
	minDate: '2015/01/01 00:00:00', //最小时间
	startDate: moment().add('days', -7),
	endDate: moment(),
	showDropdowns: true,
	showWeekNumbers: false, //是否显示第几周
	//dateLimit: {days: 31}, //起止时间的最大间隔
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
	autoUpdateInput:true,
	locale: {
		applyLabel: '确定',
		clearLabel: '清除',
		fromLabel: '起始时间',
		toLabel: '结束时间',
		daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
		monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		firstDay: 1
	}
}


$('input[name="valueDate"]').daterangepicker(dateLongRangePickerOptionObj, function(start, end, label) {
	valueStartDateTemp = start == null ? "" :(start.format('YYYY-MM-DD')).toString();
	valueEndDateTemp = end == null ?"" :(end.format('YYYY-MM-DD')).toString();
})

$('input[name="orderDate"]').daterangepicker(dateLongRangePickerOptionObj, function(start, end, label) {
	orderStartTimeTemp = start == null ? "" :(start.format('YYYY-MM-DD')).toString();
	orderEndTimeTemp = end == null ?"" :(end.format('YYYY-MM-DD')).toString();
})

$('input[name="repayDate"]').daterangepicker(dateLongRangePickerOptionObj, function(start, end, label) {
	repayStartDateTemp = start == null ? "" :(start.format('YYYY-MM-DD')).toString();
	repayEndDateTemp = end == null ?"" :(end.format('YYYY-MM-DD')).toString();
})



//初始订单补录下拉框
function initSelect() {
	var url = "/api/mms-api/order/getEnums";
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				$.each(data.data.outerSystemList, function(i, item) {
					$("#select-outerSystem").append("<option value='" + item.code + "'>" + item.desc + "</option>");
				})
				$.each(data.data.orderStatusList, function(i, item) {
					$("#select-status").append("<option value='" + item.code + "'>" + item.desc + "</option>");
				})
			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//初始化表格列表
function initTable() {
	var param = {
		pageCurrent: pageCurrent,
		pageSize: pageSize
	}
	var url = "/api/mms-api/order/list";
	$.ajax({
		type: "get",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				$("#order-tbody").empty();
				if(data.data.list.length > 0) {
					$(".emptyTable").addClass("hide");
					var html = '';
					var detail = '';
					$.each(data.data.list, function(i, item) {
					    html += "<tr><td>";
						html += $.checkNUll(item.outerId)+"</td><td>";
						html += $.checkNUll(item.orderTime)+"</td><td>";
						html += $.checkNUll(item.customerName)+"</td><td>";
						html += $.checkNUll(item.phone)+"</td><td>";
						html += $.checkNUll(item.identityNo)+"</td><td>";
						html += $.checkNUll(item.bankName)+"</td><td>";
						html += $.checkNUll(item.bankCardNo)+"</td><td>";
						html += $.checkNUll(item.orderAmount)+"</td><td>";
						html += $.checkNUll(item.outerSystem)+"</td><td>";
						html += $.checkNUll(item.productCode)+"</td><td>";
						html += $.checkNUll(item.productName)+"</td><td>";
						html += $.checkNUll(item.durationDays)+"</td><td>";
						html += $.checkNUll(item.interestRate);
						if(!$.isNullOrBlank(item.interestRate)){
							html +="%";
						}
						html +="</td><td>";
						html += ($.checkNUll(item.valueDate)).substring(0,10)+"</td><td>";
						html += $.checkNUll(item.expectReturn)+"</td><td>";
						html += ($.checkNUll(item.repayDate)).substring(0,10)+"</td>";
						if(!item.isManual) {
							html += "<td>非补录</td><td>";
						} else {
							html += "<td>补录</td><td>";
						}
						html += $.checkNUll(item.salesName)+"</td><td>";
						html += $.checkNUll(item.salesNo)+"</td><td>";
						html += $.checkNUll(item.status)+"</td></tr>";             
					});
				    $("#order-tbody").append(html);
				} else {
					$(".emptyTable").removeClass("hide");
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

//搜索按钮，重建table
function searchTable() {
	productName = $('.proName').val();
	minInvestAmountLower = $('.minMonely').val();
	minInvestAmountUpper = $('.maxMonely').val();
	outerSystem = $('.outerSystem').val();
	isManual = $("#select-isManual").val();
	outerSystem = $("#select-outerSystem").val();
	customerName = $('.customerName').val();
	phone = $('.phone').val();
	accountPhone = $('.accountPhone').val();
	identityNo = $('.identityNo').val();
	salesName = $('.salesName').val();
	salesNo = $('.salesNo').val();
	status=$("#select-status").val();
	
	
	orderStartTime = orderStartTimeTemp;
    orderEndTime = orderEndTimeTemp;

    valueStartDate = valueStartDateTemp;
    valueEndDate = valueEndDateTemp;

    repayStartDate = repayStartDateTemp;
    repayEndDate = repayEndDateTemp;

   
    var daysorder = $.DateDiff(orderStartTime,orderEndTime); 
    var daysvalue = $.DateDiff(valueStartDate,valueEndDate);	
	var daysrepay = $.DateDiff(repayStartDate,repayEndDate);
	if(daysorder>60||daysvalue>180||daysrepay>180){
		$.alert("订单时间间隔不得大于60天，起息日间隔不得大于180天，兑付日间隔不得大于180天。");
		return;
		
	}


	refreshTable();
	initPageSearch();
}

function refreshTable() {
	var param = {
		pageSize: pageSize,
		pageCurrent: pageCurrent,
		orderStartTime: orderStartTime,
		orderEndTime: orderEndTime,
		productName: productName,
		isManual: isManual,
		outerSystem: outerSystem,
		valueStartDate: valueStartDate,
		valueEndDate: valueEndDate,
		repayStartDate: repayStartDate,
		repayEndDate: repayEndDate,
		customerName: customerName,
		phone: phone,
		accountPhone: accountPhone,
		identityNo: identityNo,
		salesName: salesName,
		salesNo: salesNo,
		status:status
	}

	var url = "/api/mms-api/order/search"
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				$("#order-tbody").empty();
				if(data.data.list.length > 0) {
					$(".emptyTable").addClass("hide");
					var html = '';
					var detail = '';
					$.each(data.data.list, function(i, item) {
					    html += "<tr><td>";
						html += $.checkNUll(item.outerId)+"</td><td>";
						html += $.checkNUll(item.orderTime)+"</td><td>";
						html += $.checkNUll(item.customerName)+"</td><td>";
						html += $.checkNUll(item.phone)+"</td><td>";
						html += $.checkNUll(item.identityNo)+"</td><td>";
						html += $.checkNUll(item.bankName)+"</td><td>";
						html += $.checkNUll(item.bankCardNo)+"</td><td>";
						html += $.checkNUll(item.orderAmount)+"</td><td>";
						html += $.checkNUll(item.outerSystem)+"</td><td>";
						html += $.checkNUll(item.productCode)+"</td><td>";
						html += $.checkNUll(item.productName)+"</td><td>";
						html += $.checkNUll(item.durationDays)+"</td><td>";
						html += $.checkNUll(item.interestRate);
						if(!$.isNullOrBlank(item.interestRate)){
							html +="%";
						}
						html +="</td><td>";
						html += ($.checkNUll(item.valueDate)).substring(0,10)+"</td><td>";
						html += $.checkNUll(item.expectReturn)+"</td><td>";
						html += ($.checkNUll(item.repayDate)).substring(0,10)+"</td>";
						if(!item.isManual) {
							html += "<td>非补录</td><td>";
						} else {
							html += "<td>补录</td><td>";
						}
						html += $.checkNUll(item.salesName)+"</td><td>";
						html += $.checkNUll(item.salesNo)+"</td><td>";
						html += $.checkNUll(item.status)+"</td></tr>";
					});
					$("#order-tbody").append(html);
				} else {
					$(".emptyTable").removeClass("hide");
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

//搜索
function searchBtn() {
	pageCurrent = 1;
	searchTable();
}

//初始化的翻页，因为初始化和搜索的接口不一样
function initPage() {
	var param = {
		pageCurrent: pageCurrent,
		pageSize: pageSize
	}
	var url = "/api/mms-api/order/list"
	$.ajax({
		type: "get",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
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
						pageCurrent = api.getCurrent();
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

//搜索的翻页，因为初始化和搜索的接口不一样
function initPageSearch() {
	var param = {
		pageSize: pageSize,
		pageCurrent: pageCurrent,
		orderStartTime: orderStartTime,
		orderEndTime: orderEndTime,
		productName: productName,
		isManual: isManual,
		outerSystem: outerSystem,
		valueStartDate: valueStartDate,
		valueEndDate: valueEndDate,
		repayStartDate: repayStartDate,
		repayEndDate: repayEndDate,
		customerName: customerName,
		phone: phone,
		accountPhone: accountPhone,
		identityNo: identityNo,
		salesName: salesName,
		salesNo: salesNo,
		status:status
	}

	var url = "/api/mms-api/order/search"
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
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
						pageCurrent = api.getCurrent();
						refreshTable();
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

function hideOrShow(){
	if($("#searchBoxCointer").css("display")=="none"){
		$("#searchBoxCointer").show();
		$("#hideOrShow").html("收起  <i class='icon-angle-down'></i>")
	}else{
		$("#searchBoxCointer").hide();
		$("#hideOrShow").html("展开  <i class='icon-angle-up'></i>")
	}	
}
