var pageCurrent = 1;
var page_status = false;
var pageCount = 0;
var salesId;
var salesName = '';
var phoneNo = '';

$(function() {
	initTable();
	initPage();
	
})

//初始化表格列表
function initTable() {
	var param = {
		salesName : salesName,
		phoneNo : phoneNo,
		salesCode : "",
		status: "",
		pageSize:10,
		pageCurrent: pageCurrent
	}
	var url = "/api/mms-api/sales/querySales"
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if((data.statusCode == 200) ) {				
				$("#role-tbody").empty();
				if(data.data.list.length > 0) {
					$(".emptyTable").addClass("hide");
					var html = '';
					$.each(data.data.list, function(i,item) {
						var roleNameList = [];
						if(item.roles != null){
							$.each(item.roles, function(index,obj){
								roleNameList.push(obj.roleName)
							})
						}else{
							roleNameList = [];
						}
						html += "<tr salesId=" + item.salesId + "><td>" + item.salesCode + "</td><td>" + item.salesName + "</td><td>" + item.phoneNo + "</td><td class='zubiaoshi'>" + roleNameList + "</td>"
						if(item.status == "Z") {
							html += "<td ><span class=''>在职</span></td><td><button class='button-blue-small ' onclick=modifyUser(this)>修改</button><button class='button-blue-small margin-left-10' onclick=resetPassWord(this)>重置密码</button>"
						}else{
							html += "<td ><span class='unEmpolyee'>已离职</span></td><td><button class='button-blue-small' onclick=modifyUser(this)>修改</button></td>"
						}
					});
					$("#role-tbody").append(html);
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

//修改角色按钮，弹出模态框
function modifyUser(obj) {
	salesId = $(obj).parent().parent().attr("salesId");
	var result = $.getUser(salesId);
	if(result == null) {return false};
	var salesName = result.salesName;
	var param = {
		salesId: salesId
	}
	
	$.ajax({
		type: "post",
		url:"/api/mms-api/sales/queryRoles",
		async: true,
		data:param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			$('#username').html(salesName);
			if((data.statusCode == 200)) {
				$("#model-change").modal("show");
				$("#modal-role-tbody").empty();	
				var html = '';
				$.each(data.data.data, function(i,item) {
					if(item.userRefStatus == 1){
						html += "<tr roleId='" + item.roleId + "'><td>"+item.roleName+" </td><td>已授权</td>"
						html += "<td><button class='button-model-red' disabled onclick='authorizeSourse(this)'>授权</button><button class='button-model-blue' onclick='forbidSourse(this)'>禁止</button></td></tr>"
					}else{
						html += "<tr roleId='" + item.roleId + "'><td>"+ item.roleName + "</td><td>未授权</td>"
						html += "<td><button class='button-model-blue' onclick='authorizeSourse(this)'>授权</button><button class='button-model-red' disabled onclick='forbidSourse(this)'>禁止</button></td></tr>"
					}
				})
				$("#modal-role-tbody").append(html);
			} else {
				$("#model-change").modal("hide");
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//搜索
function searchBtn(){
	salesName = $('#search-input').val();
	phoneNo = $('#phoneNum').val();
	initTable();
	initPage();
}

//翻页
function initPage() {
	var param = {
		salesName :salesName,
		phoneNo : phoneNo,
		salesCode : "",
		status: "",
		pageSize:10,
		pageCurrent: pageCurrent
	}
	var url = "/api/mms-api/sales/querySales"
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

//授权资源组按钮
function authorizeSourse(obj) {
	var roleId = $(obj).parent().parent().attr("roleId");
	var param = {
		salesId: salesId
	};
	$.ajax({
		type: "post",
		url: "/api/mms-api/sales/roleAdd/" + roleId,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#model-change").modal("hide").on('hidden.bs.modal', initTable);
				$.alert("操作成功");
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//禁止资源组按钮
function forbidSourse(obj) {
   var roleId = $(obj).parent().parent().attr("roleId");
   var param = {
   	salesId: salesId
   }
	$.ajax({
		type: "post",
		url: "/api/mms-api/sales/roleCancel/"+roleId,
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#model-change").modal("hide").on('hidden.bs.modal', initTable);
				$.alert("操作成功");
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}




function confirmRole(flag){
	$("#model-change").modal("hide");
	if(flag == false){
		 $.confirm("确定禁用么？", null, function (v) {
          if (v == "ok") {
            forbidRole();
          }
        });
	}else{
		 $.confirm("确定启用么？", null, function (v) {
          if (v == "ok") {
            startUsingRole();
          }
        });
	}	
}

//密码重置
function resetPassWord(obj){
	 $.confirm("确定重置密码吗？", null, function (v) {
      if (v == "ok") {
        reset(obj);
      }
    });
}

//密码重置实现
function reset(obj){
	var salesId = $(obj).parent().parent().attr("salesId");
	var param = {
		salesId: salesId
	};
	$.ajax({
		type: "post",
		url: "/api/mms-api/sales/resetPassword",
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$.alert("操作成功");
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}





