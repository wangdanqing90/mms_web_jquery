var checkVal = 1;
var indexof = $(".organizeInput").val();
var indexPerson = $('.personInput').val();
var personVal = '';
var id = "";
var search = "";
let transferInfo = {}; //转移人的信息
let saveInfo = {}; //接收人信息
var transferList = [];
var saveList = [];
var num = 1;

var sourceOrgIds = []; //业绩转移人id集合
var receivedOrgId = []; //业绩接收人id集合
var orderTypes = []; //订单类型
var startTime = ''; //开始时间
var endTime = ''; //结束时间
var length;
var orgName = '';
var orgList = [];

$('#create-organize-li').hide();
//focus显示下拉框：查询或组织选择
$('#orgName').on('focus', function() {
	$('#create-organize-li').show();
	$('#changeSpan .personInput').val('')
})

$(function() {
	//checkbox 的样式
	var flag = 1;
	$("input[type='checkbox']").click(function() {
		if(flag == 1) {
			$("input[type='checkbox']").css("background", "url(../../../img/performance/sel@2x.png) no-repeat");
			flag = 0;
		} else {
			$("input[type='checkbox']").css("background", "url(../../../img/performance/sel@2x.png) no-repeat");
			flag = 1;
		}
	})

	$('.addTransfer').attr('disabled', true)
	$('.addSave').attr('disabled', true)
	$('.addTransfer').css({
		'opacity': "0.5",
		'color': "white"
	})
	$('.addSave').css({
		'opacity': "0.5",
		'color': "white"
	})

	searchType(checkVal)

	$('input:radio[name="searchRadio"]').click(function() {
		checkVal = $('input:radio[name="searchRadio"]:checked').val();
		searchType(checkVal)
	})

})

//判断查询类型   visibility
function searchType(checkVal) {
	//根据阻止查询
	if(checkVal == '1') {
		$('.addTransfer').attr('disabled', true)
		$('.addSave').attr('disabled', true)
		$('.addTransfer').css({
			'opacity': "0.5",
			'color': "white"
		})
		$('.addSave').css({
			'opacity': "0.5",
			'color': "white"
		})
		$('#transfer-tbody').empty();
		$('#save-tbody').empty()
		$('#search-organize').show();
		$('#changeSpanPerson').addClass('hide');
		$('#changeSpan').show()
		//数据也得清空
		transferList = [];
		saveList = [];
		//重置下拉人员
		$('#create-person-li').empty();
		$('#create-personDetail-li').empty();
		$('#create-person-li').hide();
		$('#create-personDetail-li').addClass('hide')
		$('.organizeInput').val('');

		$('.personInput').val('');

		$('input[name="daterange"]').val('');
		orderType()
		searchOrganize(indexof);

	} else { //根据人员查询
		$('.addTransfer').attr('disabled', true)
		$('.addSave').attr('disabled', true)
		$('.addTransfer').css({
			'opacity': "0.5",
			'color': "white"
		})
		$('.addSave').css({
			'opacity': "0.5",
			'color': "white"
		})
		$('#transfer-tbody').empty()
		$('#save-tbody').empty()
		$('.dataSave').show();
		$('.dataTransfer').show();

		//数据也得清空
		transferList = [];
		saveList = [];

		//重置
		$('#create-person-li').empty();
		$('#create-personDetail-li').empty();
		$('#create-person-li').hide();
		$('#create-personDetail-li').hide();
		$('.personInput').val('');

		$('#search-organize').hide();
		$('#changeSpan').hide();
		$('#changeSpanPerson .personInput').val('');
		$('#changeSpanPerson').removeClass('hide')
		indexPerson = $('#changeSpanPerson .personInput').val();
		$('input[name="daterange"]').val('');
		orderType()
	}
}

function searchDetailperson() {
	indexPerson = $('#changeSpanPerson .personInput').val()
	searchPerDetail(indexPerson)
}

// 根据组织查询
function searchOrganize(indexof) {
	console.log(indexof)
	var url = '/api/mms-api/performance/searchOrg';
	orgName = indexof;
	var param = {
		orgName: orgName
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
				$("#create-organize-li").empty();
				var html = data.data;

				var inpval = $(".organizeInput").val();
				for(var i = 0; i < html.length; i++) {
					var text = html[i].name;
					var dataObj = html[i];
					orgList.push(html[i])
					$("#create-organize-li").append("<li  onclick='searchPerson(" + JSON.stringify(dataObj) + ")'>" + text + "</li>");

				}
				$("#create-organize-li").removeClass('hide')
				$(".organizeInput").bind("input", function() {
					$('#changeSpan .personInput').val('')
					var inpval = $(".organizeInput").val()

					//判断输入框是否有值
					if(inpval) {
						$("#create-organize-li").empty();
						$('#create-organize-li').show();
						var a = [];
						var b = [];
						for(var i = 0; i < html.length; i++) {
							var indexof = (html[i].name).indexOf(inpval);
							if(indexof > -1) {
								a.push(html[i].name);
								b.push(html[i])
							} else {

							}
						}
						//循环显示符合条件的值
						for(var i = 0; i < a.length; i++) {
							var text = a[i]
							var dataObj = b[i]
							$("#create-organize-li").append("<li  onclick='searchPerson(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
						}

					} else {
						//没有值 全部显示数据
						$('#changeSpan .personInput').val('')
						$('#create-person-li').empty();
						$('#create-person-li').html('');
						$('#create-person-li').hide();
						for(var i = 0; i < orgList.length; i++) {
							var text = orgList[i].name;
							var dataObj = orgList[i];
							$("#create-organize-li").append("<li  onclick='searchPerson(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
						}
					}
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

//根据组织查询-人员查询
function searchPerson(obj) {
	var val = obj.name;
	$('#create-organize-li').hide()
	$(".organizeInput").val(val)

	var url = `/api/mms-api/performance/${obj.id}/childSales`;
	$.ajax({
		type: "post",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				var html = data.data;
				if(html.length > 0) {
					$("#create-person-li").empty();
					$('#create-person-li').removeClass('hide')
					$('#create-person-li').show();

				} else {
					$("#create-person-li").empty();
					$("#create-person-li").removeClass('hide')
					$('#create-person-li').show();
					$('#create-person-li').append('<li style="text-align:center;">暂无数据</li>');
					return false;
				}
				var inpval = $("#changeSpan .personInput").val();
				for(var i = 0; i < html.length; i++) {
					var text = html[i].salesName;
					var dataObj = html[i];

					$('#create-person-li').addClass('showul');
					$('#create-person-li').show()
					$("#create-person-li").append("<li class='personli' id='" + html[i].id + "' onclick='getTransferInfo(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
				}
				$("#create-person-li li").click(function() {
					var val = $(this).text();
					$("#changeSpan .personInput").val(val)
					search = val;
					$('.addTransfer').attr('disabled', false)
					$('.addSave').attr('disabled', false)
					$('.addTransfer').css('opacity', '1')
					$('.addSave').css('opacity', '1')
				});

				$("#changeSpan .personInput").bind("input", function() {
					if(!$('.organizeInput').val()) {
						$("#create-organize-li").empty();
						$('#create-organize-li').show();
						return false;
					}
					var inpval = $("#changeSpan .personInput").val()

					//判断输入框是否有值
					if(inpval) {
						$("#create-person-li").empty();
						$('#create-person-li').show();
						var a = [];
						var b = [];
						for(var i = 0; i < html.length; i++) {
							var text = html[i].salesName;
							var indexof = text.indexOf(inpval);
							if(indexof > -1) {
								$("#create-person-li").empty();
								a.push(text);
								b.push(html[i])
							} else {
								$("#create-person-li").empty();
								$('#create-person-li').show();
								$('#create-person-li').append('<li style="text-align:center;">暂无数据</li>')
							}
						}
						//循环显示符合条件的值
						for(var i = 0; i < a.length; i++) {
							var text = a[i]
							var dataObj = b[i];
							$("#create-person-li").append("<li class='personli' id='" + html[i].id + "' onclick='getTransferInfo(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
						}
					} else {
						//没有值 全部显示数据
						$("#create-person-li").empty();
						$('#create-person-li').show();
					}
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

//根据个人信息查询
function searchPerDetail(indexPerson) {
	search = indexPerson
	var url = '/api/mms-api/performance/searchSales';
	var param = {
		search: search
	}
	if(search == '') {
		$("#create-personDetail-li").empty()
		$('#create-personDetail-li').removeClass('hide')
		$('#create-personDetail-li').show();
		$("#create-personDetail-li").append('<li style="text-align:center;">暂无数据</li>')
		return false;
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
				var html = data.data;
				if(html.length > 0) {
					$("#create-personDetail-li").empty();
					$('#create-personDetail-li').removeClass('hide')
					$('#create-personDetail-li').show();

					var inpval = $("#changeSpanPerson .personInput").val();
					for(var i = 0; i < html.length; i++) {
						var text = html[i].salesName + `(${html[i].orgName})`
						var dataObj = html[i]
						$("#create-personDetail-li").append("<li id='" + html[i].id + "' onclick='getTransferInfo(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
					}
					$('#create-personDetail-li').addClass('showul');
					$("#changeSpanPerson .personInput").bind("input", function() {
						var inpval = $("#changeSpanPerson .personInput").val()
						//判断输入框是否有值
						if(inpval) {
							$("#create-personDetail-li").empty();
							$('#create-personDetail-li').show();
							html = '';
							var a = [];
							var b = [];
							for(var i = 0; i < html.length; i++) {
								var text = html[i].salesName + `(${html[i].orgName})`
								var indexof = text.indexOf(inpval);
								if(indexof > -1) {
									a.push(text);
									b.push(html[i])
								} else {

								}
							}
							//循环显示符合条件的值
							for(var i = 0; i < a.length; i++) {
								var text = a[i]
								var dataObj = b[i]
								$("#create-personDetail-li").append("<li id='" + html[i].id + "' onclick='getTransferInfo(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
							}
						} else {
							//没有值 全部显示数据
							$("#create-personDetail-li").empty();
							$('#create-personDetail-li').hide();
							$('#changeSpanPerson .personInput').val('')
							for(var i = 0; i < html.length; i++) {
								var text = html[i].salesName + `(${html[i].orgName})`
								var dataObj = html[i];
								$("#create-personDetail-li").append("<li id='" + html[i].id + "' onclick='getTransferInfo(" + JSON.stringify(dataObj) + ")'>" + text + "</li>")
							}
						}
					})
				} else {
					$('#create-personDetail-li').empty();
					$('#create-personDetail-li').removeClass('hide')
					$('#create-personDetail-li').show();
					$("#create-personDetail-li").append('<li style="text-align:center;">暂无数据</li>')
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

//获取业绩转移人或接收人信息
function getTransferInfo(obj) {
	$('.addTransfer').attr('disabled', false)
	$('.addSave').attr('disabled', false)
	$('.addTransfer').css('opacity', '1')
	$('.addSave').css('opacity', '1')
	var val = obj.salesName;
	$('#create-organize-li').hide()
	$('#create-person-li').empty();
	$('#create-person-li').hide();
	$(".personInput").val(val)

	var id = obj.id
	var url = `/api/mms-api/performance/${id}/getTransferInfo`;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$('.addTransfer').data(data.data);
				$('.addSave').data(data.data);
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

function has(arr, param) {
	return arr.some(function(item) {
		return item.id == param.id
	})
}

//添加 转移人
function addTransfer() {
	$(".organizeInput").val('');
	$("#create-organize-li").empty();
	searchOrganize()
	$("#create-person-li").empty();
	$('#create-person-li').hide();
	$('#create-personDetail-li').empty();
	$('#create-personDetail-li').hide();
	$('.personInput').val('')
	$('.addTransfer').attr('disabled', true)
	$('.addSave').attr('disabled', true)
	$('.addTransfer').css({
		'opacity': "0.5",
		'color': "white"
	})
	$('.addSave').css({
		'opacity': "0.5",
		'color': "white"
	})
	transferInfo = $('.addTransfer').data();
	if(transferInfo == null) {
		return false
	}
	var param = {
		id: transferInfo.id,
		orgName: transferInfo.orgName, //组织名字
		salesName: transferInfo.salesName, //人员姓名
		salesMobile: transferInfo.salesMobile //人员手机号
	};

	const length = transferList.length;
	if(length == 0) {
		transferList.push(param);
		num += 1;
	} else {
		if(has(transferList, param)) {
			$.alert('业绩转移人已存在');
		} else {
			transferList.push(param);
			num += 1;
		}
	}
	if(transferList.length > 0) {
		$('.dataTransfer').hide()
		var html = "";
		$.each(transferList, function(index, item) {
			html += `<tr dataId="${item.id}">
						<td>
							<input type="checkbox" name="transferCheck"  class="transferCheck margin-top-0" id="" value="" />
						</td>
						<td>${(index+1)}</td>
						<td>${item.salesName}</td>
						<td>${item.salesMobile}</td>
						<td>${item.orgName}</td>
						<td>
							<button class='deleteBtn' onclick='deleteTransfer(this)'></button>
						</td>
					</tr>`
		})
		$('#transfer-tbody').empty().append(html);
	} else {
		$('.dataTransfer').show()
	}

}

//添加 接受人
function addSave() {
	$(".organizeInput").val('');
	searchOrganize()
	$("#create-person-li").empty();
	$('#create-person-li').hide();
	$('#create-personDetail-li').empty();
	$('#create-personDetail-li').hide();
	saveInfo = $('.addSave').data()
	$('.personInput').val('')
	$('.addTransfer').attr('disabled', true)
	$('.addSave').attr('disabled', true)
	$('.addTransfer').css({
		'opacity': "0.5",
		'color': "white"
	})
	$('.addSave').css({
		'opacity': "0.5",
		'color': "white"
	})
	if(saveInfo == null) {
		return false
	}
	if(saveList.length == 1) {
		$.alert('业绩接受人唯一');
		return false;
	} else {
		var param = {
			id: saveInfo.id,
			orgName: saveInfo.orgName, //组织名字
			salesName: saveInfo.salesName, //人员姓名
			salesMobile: saveInfo.salesMobile //人员手机号
		};
		const length = saveList.length;
		if(length == 0) {
			saveList.push(param);
		} else {
			if(has(saveList, param)) {
				$.alert('业绩接收人已存在');
			} else {
				saveList.push(param);
				num += 1;
			}
		}

		if(saveList.length > 0) {
			$('.dataSave').hide();
			var html = "";
			$.each(saveList, function(index, item) {
				html += `<tr dataId="${item.id}">
							<td>${item.salesName}</td>
							<td>${item.salesMobile}</td>
							<td>${item.orgName}</td>
							<td>
								<button class='deleteBtn' onclick='deleteSave(this)'></button>
							</td>
						</tr>`
			})
			$('#save-tbody').empty().append(html);
		} else {
			$('.dataSave').show()
		}
	}
}

//删除 转移人
function deleteTransfer(obj) {
	var num = $(obj.parentNode.parentNode).attr('dataId')
	var html = '';
	transferList = removeElement(transferList, num)

	if(transferList.length > 0) {
		$('.dataTransfer').hide();
		$.each(transferList, function(index, item) {
			html += `<tr dataId="${item.id}">
					<td>
						<input type="checkbox" name="transferCheck"  class="transferCheck" id="" value="" />
					</td>
					<td>${(index+1)}</td>
					<td>${item.salesName}</td>
					<td>${item.salesMobile}</td>
					<td>${item.orgName}</td>
					<td>
						<button class='deleteBtn' onclick='deleteTransfer(this)'></button>
					</td>
				</tr>`
		})
		$('#transfer-tbody').empty().append(html);
	} else {
		$('#transfer-tbody').empty()
		$('.dataTransfer').show()
	}
}

function removeElement(arr, num) {
	var result = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].id != num) {
			result.push(arr[i]);
		}
	}
	return result;
}

//逐一删除行
function deleteRow(obj) {
	var index = $(obj.parentNode).rowIndex;
	var table = document.getElementById("table");
	table.deleteRow(index);
}

//删除 接收人
function deleteSave(obj) {
	var index = obj.parentNode.parentNode.rowIndex;
	var table = obj.closest('table');
	table.deleteRow(index);
	console.log(index);
	saveList = [];

}
var flag = false;
//全选，批量操作
function checkAll() {
	var count = 0;
	$('input[name="transferCheck"]').each(function() {
		if($(this).attr('checked') != 'checked') { // 判断一组复选框是否有未选中的  
			count += 1;
			flag = false;
		} else {
			flag = true;
		}
	});
	if(flag) {
		if(count > 0) {
			console.log(1)
			$('#transfer-tbody input:checkbox').attr('checked', true)
			flag = true
		} else {
			console.log(2)
			$('#transfer-tbody input:checkbox').attr('checked', false)
			flag = false
		}
	} else {
		console.log(3)
		$('#transfer-tbody input:checkbox').attr('checked', true)
		flag = true
	}
}

//时间选择
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
	format: 'YYYY/MM/DD HH:mm:ss', //控件中from和to 显示的日期格式MM/DD/YYYY
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

$('input[name="daterange"]').daterangepicker(dateLongRangePickerOptionObj, function(start, end, label) {
	startTime = start == null ? "" : (start.format('YYYY-MM-DD HH:mm:ss')).toString();
	endTime = end == null ? "" : (end.format('YYYY-MM-DD HH:mm:ss')).toString();
	console.log($(this).start)
	console.log(startTime, endTime)

})

//订单类型- 渲染
function orderType() {
	$('.orderBox-content').empty()
	var url = '/api/mms-api/performance/getOrderTypes'
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				var html = '';
				$.each(data.data, function(index, item) {
					html += `<div class="checkbox order">
				   <label style="line-height: 17px;">
				      <input type="checkbox" name="orderType" style="margin-right:8px;" code="${item.code}" onclick=""  id=""  android:button="@null" /> ${item.desc}
				   </label>
				</div>`
				});
				$('.orderBox-content').append(html);
				$('.transferReset').attr('disabled', false)
				$('input[name="searchRadio"]').attr('disabled', false)
			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//提交  提交业绩转移
function submit() {
	receivedOrgId = $('#save-tbody tr').attr('dataId')

	//选择订单类型
	var text = $('input[name="orderType"]:checked').map(function(i, ele) {
		return $(ele).attr('code')
	}).get().join(',')
	orderTypes = text
	var check = $('input[name="transferCheck"]:checked').map(function(i, ele) {
		if($(ele).prop('checked')) {
			return $(ele).parent().parent().attr('dataId');
		}
	}).get()
	sourceOrgIds = check;

	var param = {
		sourceOrgIds: sourceOrgIds.join(','),
		receivedOrgId: parseInt(receivedOrgId),
		startTime: startTime,
		endTime: endTime,
		orderType: (orderTypes).toString()
	}
	if(param.sourceOrgIds == '' || param.sourceOrgIds == null) {
		$.alert('请选择业绩转移人！');
		return false;
	} else if(receivedOrgId == '' || receivedOrgId == undefined) {
		$.alert('请选择业绩接收人！');
		return false;
	} else if(param.startTime == '' || param.startTime == undefined) {
		$.alert('请选择业绩转移时间段！');
		return false;
	} else if(param.orderType == '' || param.orderType == null) {
		$.alert('请选择订单类型！');
		return false;
	} else if(sourceOrgIds.indexOf(receivedOrgId) > -1) {
		$.alert('业绩接收人和业绩转移人不能为同一人！');
		return false;
	} else {
		var url = '/api/mms-api/performance/submitTransfer';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: param,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					$.alert('操作成功', '', reset);

				} else {
					$.alert(data.message);
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	}

}
//重置
function reset() {
	location.reload();
}