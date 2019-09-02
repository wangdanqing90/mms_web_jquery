
var pageCurrent = 1;
var page_status = false;
var pageCount = 0;



var phone = '';
var salesCode = '';
var salesName = '';
var startDate = '';
var endDate = '';
		
//		phone: $('.salesCode').val(),
//		salesCode: $('.salesCode').val(),
//		salesName: $('.empolyName').val(),
//		startDate: startDate,
//		endDate: endDate,

$(function() {
	initTable();
	initPage();
	
})

//搜索
function search(){
	phone = $('.salesCode').val();
	salesCode = $('.salesCode').val();
	salesName = $('.empolyName').val();
	
	initTable();
	initPage();
}
function initTable() {
	var param = {
		phone: phone,
		salesCode:salesCode,
		salesName: salesName,
		startDate: startDate,
		endDate: endDate,
		pageSize:10,
		pageCurrent: pageCurrent
	}
	
	var url = "/api/mms-api/sales/getStaffPerformance"
//	if(startDate == '' || endDate == ''){
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: param,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if((data.statusCode == 200) ) {
					var html = ''
					$("#achievement-tbody").empty();
					if(data.data.list.length > 0) {
						$(".emptyTable").addClass("hide");
						$.each(data.data.list, function(i,item) {
								html += `<tr>
											<td>${i+1}</td>
											<td>${item.name}</td>
											<td>${item.salesCode}</td>
											<td>${item.salesName}</td>
											<td>${item.phone}</td>
											<td>${item.totalPerformance}</td>
											<td>${item.expect}</td>
											<td>
												<button class='button-blue-small padding-left-0' onclick='details(this)'>详情</button>
											</td>
										</tr>`
								
							});
							$("#achievement-tbody").append(html);
						
					}else{
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


//tab选择哪一个业绩
$('.achievement-tab .box div').on('click', function(){
	$(this).addClass('active')
	$(this).siblings('div').removeClass('active');
	if($(this).index() == 0){
		$('.tabcontent-first').show();
	}else{
		$('.tabcontent-first').hide();
	}
})

//查看详情
function details(obj){

 	var param = {
 		customerId: pageCurrent
 	}

	var url = "/api/mms-api/sales/getOrderDetails";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(res) {
			if(res.statusCode == 200) {
				if((res.data.date).length == 0){
					return false;
				}else{
					$(".emptyTable").addClass("hide");
					$('.tabcontent-first').addClass('hide');
					$('.pageBox').addClass('hide')
					
					$(".achievementDetails").removeClass('hide');
					$(".achievementDetails").show();
					$('.achDetailsTable').removeClass('hide');
					$('.achDetailsTable').show();
					var html = '';
					$.each(res.data.list, function(index, item) {
							html += `<tr>
										<td>${index+1}</td>
										<td>2019-03-22 12:21:34</td>
										<td>${item.salesName}</td>
										<td>${item.phone}</td>
										<td>${item.totalPerformance}</td>
										<td>i投</td>
										<td>${item.name}</td>
										<td>智能投0912期 | 5.8%</td>
										<td>0.1%</td>
										<td>${item.interestRate}</td>
									</tr>`
							
						})
					$("#achievement-detail-tbody").append(html);
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
	var param = {
		phone: phone,
		salesCode: salesCode,
		salesName: salesName,
		startDate: startDate,
		endDate: endDate,
		pageSize:10,
		pageCurrent: pageCurrent
	}
	
var url = "/api/mms-api/sales/getStaffPerformance"
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
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


//选择时间
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
    format: 'YYYY/MM/DD HH:mm:ss', //控件中from和to 显示的日期格式MM/DD/YYYY
    separator: '-',
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
        startDate = start == null ? "" : (start.format('YYYY-MM-DD HH:mm:ss')).toString();
        endDate = end == null ? "" : (end.format('YYYY-MM-DD HH:mm:ss')).toString();
       
  });
	