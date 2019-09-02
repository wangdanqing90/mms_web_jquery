var isSearch = false;
var pageCurrent = 1;
var page_status = false;
var pageCount = 0;
var pageSize = 10;



//搜索条件
var productName = '';
var interestRate = '';
var minInvestAmountLower = '';
var minInvestAmountUpper = '';
var outerSystem = '';
var isManual = '';
var status= '';
//起息范围
var valueStartDate = '';
var valueEndDate = '';
//创建日期
var createStartDate = '';
var createEndDate = '';

//起息范围，临时存储
var valueStartDateTemp = '';
var valueEndDateTemp  = '';
//创建日期，临时存储
var createStartDateTemp  = '';
var createEndDateTemp  = '';


$(function() {
   //初始化创建时间为最近七天
	var curDate = new Date();
	createStartDate=$.getFormatDate(new Date(curDate.getTime() - 24*60*60*7000));
	createEndDate = $.getFormatDate(curDate) ;
	createStartDateTemp=$.getFormatDate(new Date(curDate.getTime() - 24*60*60*7000));
	createEndDateTemp = $.getFormatDate(curDate) ;
	$('input[name="createDate"]').val(createStartDate+" - "+createEndDate)
	
	
	initSelect();
	initTable();
	initPage();
})

//时间选择
var myDate=new Date() 
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
	valueEndDateTemp = end == null ?"" : (end.format('YYYY-MM-DD')).toString();
})

$('input[name="createDate"]').daterangepicker(dateLongRangePickerOptionObj, function(start, end, label) {
	createStartDateTemp  = start == null ? "" :(start.format('YYYY-MM-DD')).toString();
	createEndDateTemp = end == null ?"" :(end.format('YYYY-MM-DD')).toString();
})

//初始下拉框
function initSelect() {
	var url = "/api/mms-api/order/getEnums"
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				data.data;
				$.each(data.data.outerSystemList, function(i, item) {
					$("#select-outerSystem").append("<option value='" + item.code + "'>" + item.desc + "</option>");
				})
			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
	
	
	var url = "/api/mms-api/product/getProductEnums"
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				data.data;
				$.each(data.data.statusList, function(i, item) {
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
	var url = "/api/mms-api/product/list"
	$.ajax({
		type: "get",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				$("#products-tbody").empty();
				if(data.data.list.length > 0) {
					$(".emptyTable").addClass("hide");
					var html = '';
					var detail = '';
					$.each(data.data.list, function(i, item) {						
					    html += '<tr id='+item.id +' onclick="jump(this)"><td>'+($.checkNUll(item.createDate)).substring(0,10)+"</td><td>";
						html +=$.checkNUll(item.productCode)+"</td><td>";
						html +=$.checkNUll(item.productName)+"</td><td>";
						if(!$.isNullOrBlank(item.interestRate)){
							html +=$.checkNUll(item.interestRate)+"%</td><td>";
						}else{
							html +="</td><td>";
						}
						html +=$.checkNUll(item.totalAmount)+"</td><td>";
						html +=($.checkNUll(item.raiseStartDate)).substring(0,10)+"</td><td>";
						html +=($.checkNUll(item.raiseEndDate)).substring(0,10)+"</td><td>";
						html +=$.checkNUll(item.durationDays)+"</td><td>";
						html +=($.checkNUll(item.valueDate)).substring(0,10)+"</td><td>";
						html +=($.checkNUll(item.repayDate)).substring(0,10)+"</td><td>";
						html +=$.checkNUll(item.minInvestAmount)+"</td><td>";
						html +=$.checkNUll(item.maxInvestAmount)+"</td><td>";
						html +=$.checkNUll(item.repayMethod)+"</td><td>";
						html +=$.checkNUll(item.riskType)+"</td><td>";
						html +=$.checkNUll(item.outerSystem)+"</td>";								
						if(!item.isManual) {
							html += "<td>非补录</td><td>";
						} else {
							html += "<td>补录</td><td>";
						}						
						html +=$.checkNUll(item.status)+"</td></tr>";
						
					});
					$("#products-tbody").append(html);
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
	interestRate = $('.interestRate').val();
	minInvestAmountLower = $('.minMonely').val();
	minInvestAmountUpper = $('.maxMonely').val();
	outerSystem = $('#select-outerSystem').val();
	isManual = $("#select-isManual").val();
	status = $('#select-status').val();
	
	
	valueStartDate = valueStartDateTemp;
    valueEndDate = valueEndDateTemp;

    createStartDate = createStartDateTemp;
    createEndDate = createEndDateTemp;
	
	var daysvalue = $.DateDiff(valueStartDate,valueEndDate);
	var dayscreate = $.DateDiff(createStartDate,createEndDate);
	if(daysvalue>180||dayscreate>60){
		$.alert("起息范围间隔不得大于180天，创建日期间隔不得大于60天。");
		return;
		
	}
	

    refreshTable();
    initPageSearch();
}

function refreshTable() {
	var param = {
		valueStartDate: valueStartDate,
		valueEndDate: valueEndDate,
		productName: productName,
		interestRate: interestRate,
		createStartDate: createStartDate,
		createEndDate: createEndDate,
		minInvestAmountLower: minInvestAmountLower,
		minInvestAmountUpper: minInvestAmountUpper,
		outerSystem: outerSystem,
		isManual: isManual,
		status: status,
		pageSize: pageSize,
		pageCurrent: pageCurrent
	}

	var url = "/api/mms-api/product/search"
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200)) {
				$("#products-tbody").empty();
				if(data.data.list.length > 0) {
					$(".emptyTable").addClass("hide");
					var html = '';
					var detail = '';
						$.each(data.data.list, function(i, item) {						
					    html += '<tr id='+item.id +' onclick="jump(this)"><td>'+($.checkNUll(item.createDate)).substring(0,10)+"</td><td>";
						html +=$.checkNUll(item.productCode)+"</td><td>";
						html +=$.checkNUll(item.productName)+"</td><td>";
						if(!$.isNullOrBlank(item.interestRate)){
							html +=$.checkNUll(item.interestRate)+"%</td><td>";
						}else{
							html +="</td><td>";
						}
						html +=$.checkNUll(item.totalAmount)+"</td><td>";
						html +=($.checkNUll(item.raiseStartDate)).substring(0,10)+"</td><td>";
						html +=($.checkNUll(item.raiseEndDate)).substring(0,10)+"</td><td>";
						html +=$.checkNUll(item.durationDays)+"</td><td>";
						html +=($.checkNUll(item.valueDate)).substring(0,10)+"</td><td>";
						html +=($.checkNUll(item.repayDate)).substring(0,10)+"</td><td>";
						html +=$.checkNUll(item.minInvestAmount)+"</td><td>";
						html +=$.checkNUll(item.maxInvestAmount)+"</td><td>";
						html +=$.checkNUll(item.repayMethod)+"</td><td>";
						html +=$.checkNUll(item.riskType)+"</td><td>";
						html +=$.checkNUll(item.outerSystem)+"</td>";						
						if(!item.isManual) {
							html += "<td>非补录</td><td>";
						} else {
							html += "<td>补录</td><td>";
						}						
						html +=$.checkNUll(item.status)+"</td></tr>";
						
					});
					$("#products-tbody").append(html);
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
	var url = "/api/mms-api/product/list"
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
		valueStartDate: valueStartDate,
		valueEndDate: valueEndDate,
		productName: productName,
		interestRate: interestRate,
		createStartDate: createStartDate,
		createEndDate: createEndDate,
		minInvestAmountLower: minInvestAmountLower,
		minInvestAmountUpper: minInvestAmountUpper,
		outerSystem: outerSystem,
		isManual: isManual,
		status: status,
		pageSize: pageSize,
		pageCurrent: pageCurrent
	}

	var url = "/api/mms-api/product/search"
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

//跳转到产品修改
function jump(obj){
	var id = $(obj).attr("id");
	location.href="../../view/product/productUpdate.html?id="+id;
	
}

