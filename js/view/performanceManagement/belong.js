var PageCurrent = 1;
var page_status = false;
var pageCount = 0;
var OrderPageCurrent = 1;
var Orderpage_status = false;
var OrderpageCount = 0;
var roleId;

$(function() {
	initTable();
	initPage();
})

//初始化表格列表
function initTable() {
	var roleName = $("#search-input").val()
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + PageCurrent + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/json",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#belong-tbody").empty();

				if(data.data.pagination.list.length > 0) {
					$(".emptyTable").addClass("hide");
					$.each(data.data.pagination.list, function(index, item) {
							var html = "<tr roleId="+ item.roleId+" roleName="+item.roleName+"><td>" + item.roleId + "</td><td>" + item.roleName + "</td><td>"+"13911111111"+"</td><td>" + "东方路门店（11111）" + "</td>";							
							html += "<td><button class='button-green' onclick='detail(this)'>组织详情</button><button class='button-green' onclick='change(this)'>订单调整</button></td></tr>";
							$("#belong-tbody").append(html);
						})
					}
					else {
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



//翻页
function initPage() {
	var roleName = $("#search-input").val()
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + 1 + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/json",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				pageCount = data.data.pagination.pageCount;

				page_status = true;
				$("#box").show();
				$("#box").pagination({
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

//搜索按钮
function searchBtn() {
	initTable();
	initPage();
}

//组织详情
function detail(obj){
	var roleName = $("#search-input").val()
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + PageCurrent + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/json",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$(".outerCointer").addClass("hide")
				$("#belong-person").removeClass("hide")
				
				$("#belong-person-tbody").empty();
					$.each(data.data.pagination.list, function(index, item) {
							var html = "<tr roleId="+ item.roleId+" roleName="+item.roleName+"><td>" + item.roleId + "</td><td>" + item.roleName + "</td><td>"+"13911111111"+"</td><td>" + "东方路门店（11111）" + "</td>";							
							html += "<td><button class='button-green' onclick='changeDefault(this)'>默认设置</button></td></tr>";
							$("#belong-person-tbody").append(html);
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

/*默认设置*/
function changeDefault(obj){
	
}

/*返回*/
function backClick(){
	$(".outerCointer").addClass("hide")
	$("#belong-table").removeClass("hide")
}


//订单调整
function change(obj){
	$(".outerCointer").addClass("hide");
	$("#belong-order").removeClass("hide");		
	initOrderTable();
	initOrderPage();
}

function initOrderTable(){
	var roleName = $("#search-input").val()
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + OrderPageCurrent + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/json",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#belong-order-tbody").empty();
					$.each(data.data.pagination.list, function(index, item) {
							var html = "<tr roleId="+ item.roleId+" roleName="+item.roleName+"><td>" + item.roleId + "</td><td>" + item.roleName + "</td><td>"+"13911111111"+"</td><td>" + "东方路门店（11111）" + "</td>";							
							html += "<td><button class='button-green' onclick='changeOrder(this)'>修改业绩归属</button></td></tr>";
							$("#belong-order-tbody").append(html);
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

//翻页
function initOrderPage() {
	var roleName = $("#search-input").val()
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + 1 + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/json",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				OrderpageCount = data.data.pagination.pageCount;

				Orderpage_status = true;
				$("#boxOrder").show();
				$("#boxOrder").pagination({
					pageCount: OrderpageCount,
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
						OrderPageCurrent = api.getCurrent();
						initOrderTable();
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

function changeOrder(){
	
}

