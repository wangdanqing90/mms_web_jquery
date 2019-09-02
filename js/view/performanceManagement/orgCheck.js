var PageCurrent = 1;
var page_status = false;
var pageCount = 0;
var startTime = ''
var endTime = ''

var createTimeStart = startTime;
var createTimeEnd = endTime;
var createName = '';
var status = '';
var orgName = '';

$(function() {
	initTable();
	initPage();
})

//搜索按钮
function searchBtn() {
	createName = $("#royalty-header-person").val();
	status = $('#royalty-select-state').val();
	orgName = $('#royalty-header-orgName').val();
	createTimeStart = startTime;
	createTimeEnd = endTime;
	PageCurrent = 1;
	initTable();
	initPage();
}


//初始化表格列表
function initTable() {
//	var createTimeStart = startTime;
//	var createTimeEnd = endTime;
//	var createName = $("#royalty-header-person").val();
//	var status = $('#royalty-select-state').val();
//	var orgName = $('#royalty-header-orgName').val();

	var params = {
		status: status,
		createTimeStartStr: createTimeStart,
		createTimeEndStr: createTimeEnd,
		createName: createName,
		orgName: orgName,
		pageCurrent: PageCurrent,
		pageSize: 10
	};

	var url = "/api/mms-api/orgRate/checkList";
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
					var html = '';
					$.each(data.data.list, function(i,item){
						$.each(item.orgRates, function(i,obj){
							html += `<tr id="${obj.id}">
									<td>${item.code}</td>
									<td>${item.name}</td><td class='color-red'>${obj.profitRate * 1000}‰</td>
									<td class=''>${obj.createByName}</td>`
									if(obj.state == "ONCHECK") {
										html += `<td class='color-red'>待审</td>
										<td>${obj.createTime}</td>
										<td>
											<button class='button-blue-small padding-left-0' onclick='review(this)'>通过</button>
											<button class='button-blue-small' onclick='reback(this)'>驳回</button>
											<button class='button-blue-small' onclick='discard(this)'>废弃</button>
										</td>
									</tr>`
									} else if(obj.state == 'PASS') {
										html += `<td class='color-red'>通过</td>
										<td>${obj.createTime}</td>
										<td>
											<button class='button-blue-small padding-left-0' disabled onclick='review(this)'>通过</button>
											<button class='button-blue-small' disabled onclick='reback(this)'>驳回</button>
											<button class='button-blue-small' disabled onclick='discard(this)'>废弃</button>
										</td>
									</tr>`;
									}else if(obj.state == 'REFUSED'){
										html += `<td class='color-red'>驳回</td>
										<td>${obj.createTime}</td>
										<td>
											<button class='button-blue-small padding-left-0' disabled onclick='review(this)'>通过</button>
											<button class='button-blue-small' disabled onclick='reback(this)'>驳回</button>
											<button class='button-blue-small' disabled onclick='discard(this)'>废弃</button>
										</td>
									</tr>`;
									}else if(obj.state == 'INVALID'){
										html += `<td class='color-red'>废弃</td>
										<td>${obj.createTime}</td>
										<td>
											<button class='button-blue-small padding-left-0' disabled onclick='review(this)'>通过</button>
											<button class='button-blue-small' disabled onclick='reback(this)'>驳回</button>
											<button class='button-blue-small' disabled onclick='discard(this)'>废弃</button>
										</td>
									</tr>`;
									}
						})
						
					})
					$("#royalty-tbody").append(html);
					
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

//复核
function review(obj) {
	var id = $(obj).parent().parent().attr("id");
	$.confirm("确定通过么？", null, function (v) {
      if (v == "ok") {
        var param = {
			orgRateId: id,
			status: 'PASS'
		}
		var url = "/api/mms-api/orgRate/updateStatus";
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data:param,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					$.alert('操作成功！', '', function(){
						location.reload()
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
    })
}
//驳回
function reback(obj){
	var id = $(obj).parent().parent().attr("id");
	$.confirm("确定驳回么？", null, function (v) {
      if (v == "ok") {
        var param = {
			orgRateId: id,
			status: 'REFUSED'
		}
		var url = "/api/mms-api/orgRate/updateStatus";
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data:param,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					$.alert('操作成功！', '', function(){
						location.reload()
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
    })
	
}

//废弃
function discard(obj) {
	var id = $(obj).parent().parent().attr("id");
	var txt = "确定废弃么";
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var param = {
				orgRateId: id,
				 status: 'INVALID'
			}
			var url = "/api/mms-api/orgRate/updateStatus";
			$.ajax({
				type: "post",
				url: url,
				async: true,
				data:param,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert('操作成功！', '', function(){
							location.reload()
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
	});
}
//翻页
function initPage() {
	var params = {
		status: status,
		createTimeStartStr: createTimeStart,
		createTimeEndStr: createTimeEnd,
		createName: createName,
		orgName: orgName,
		pageCurrent: PageCurrent,
		pageSize: 10
	};
	var url = "/api/mms-api/orgRate/checkList";
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
	startTime = start == null ? "" : (start.format('YYYY-MM-DD')).toString();
	endTime = end == null ? "" : (end.format('YYYY-MM-DD')).toString();
	console.log(startTime, endTime)

})

