var PageCurrent = 1;
var page_status = false;
var pageCount = 0;
var roleId;
var roleName = "";
var temp_status=false;
var lastFather = true;

$(function() {
	initTable();
	initPage();
})

//递归遍历n维数组
function eachNavList(origin,ele,html) {
	// 数组为空直接跳出循环
	var _ele = $(ele);
	if((origin.length <= 0)){
		return false;
	}	
	$.each(origin,function(index,item) {
		var Class = item.funcLevel == 2 ? "padding-left-40" : item.funcLevel == 3 ? "padding-left-80":"";
		if(item.childFunc == null){//最后一层
			html = "<tr funcId="+item.funcId+" ><td   class='text-left  " + Class + "'  >" + item.funcName + "</td>";
			if(item.checked =="已授权"){
			html += "<td>" + item.checked + "</td><td><button class='button-model-red' onclick='forbidSourse(this)'>禁止</button></td></tr>";
			}else{
			html += "<td>" + item.checked + "</td><td><button class='button-model-blue' onclick='authorizeSourse(this)'>授权</button></td></tr>";
			}
			_ele.append(html);
		}else{//非最后一层	
			html = "<tr style='font-weight:bold' funcId="+item.funcId+"><td class='text-left  " + Class + "' ><img src='../../img/wenjianjia.png'>" + item.funcName + "</td>";
			html += "<td></td><td></td></tr>";
			_ele.append(html);
			eachNavList(item.childFunc,_ele)
		}				
	});	
}


//初始化表格列表
function initTable() {
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + PageCurrent + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#role-tbody").empty();

				if(data.data.pagination.list.length > 0) {
					$(".emptyTable").addClass("hide");
					$.each(data.data.pagination.list, function(index, item) {
							var html = "<tr roleId="+ item.roleId+" roleName="+item.roleName+" roleDisableTag="+item.roleDisableTag +  "><td>" + item.roleId + "</td><td>" + item.roleName + "</td><td>" + item.roleRemark + "</td>";
							if(item.roleDisableTag == "启用") {
								html += "<td><span class=''>" + item.roleDisableTag + "</span></td>";
							} else {
								html += "<td><span class=''>" + item.roleDisableTag + "</span></td>";
							}
							html += "<td><button class='button-blue-small' onclick='modifyRole(this)'>修改</button></td></tr>";
							$("#role-tbody").append(html);
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

//修改角色按钮，弹出模态框
function modifyRole(obj) {
	$("#model-change").modal("show");
	$("#model-change #model-change-roleName").html($(obj).parent().parent().attr("roleName"));

	$("#model-change #model-change-state").html($(obj).parent().parent().attr("roledisabletag"));
	if($(obj).parent().parent().attr("roledisabletag") == "禁用"){
		$("#role-status-img").attr("src","../../img/Slide1.png")
        temp_status =false;
		
	}else{
		$("#role-status-img").attr("src","../../img/Slide.png")
	    temp_status=true;
	}
	
	roleId = $(obj).parent().parent().attr("roleId");
	var roleName = $("#search-input").val();
	var param = {};
	$.ajax({
		type: "get",
		url: "/api/mms-api/roleManage/" + roleId + "/edit",
		async: true,
		data: param,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#modal-role-tbody").empty();
				if(data.data.pagination.list.length > 0) {
					$("#role-tbody .emptyTable").addClass("hide");
					eachNavList(data.data.pagination.list,"#modal-role-tbody");
				} else {
					$("#role-tbody .emptyTable").removeClass("hide");
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

//新增角色按钮，弹出模态框
function addNewUser(obj) {
	$("#model-add").modal("show").on('hidden.bs.modal', function(e) {
		//清空form表单
		document.getElementById("model-add-form").reset();
		$("#model-add .form-error").addClass("hide")
	});
}
//新增角色表单验证
$("#model-add-roleName").bind("input propertychange", checkAddInform);

function checkAddInform() {
	var roleName = $("#model-add-roleName").val();
	if($.isNullOrBlank(roleName)) {
		$("#model-add .form-error").removeClass("hide")
		$("#model-add .form-error").text("请填写角色");
		return false;
	} else {
		$("#model-add .form-error").addClass("hide")
		return true;
	}
}
//新增角色
function addNewUserCallback() {
	var roleName = $("#model-add-roleName").val();
	var roleRemark = $("#model-add-roleRemark").val();

	if(checkAddInform()) {
		var param = {
			roleName: roleName,
			roleRemark: roleRemark
		};
		$.ajax({
			type: "post",
			url: "/api/mms-api/roleManage/addNew",
			async: true,
			data: param,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					location.reload();
				} else {
					alert(data.message);
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	}


}

//翻页
function initPage() {
	
	var url = "/api/mms-api/roleManage/roleList" + "?roleName=" + roleName + "&pageCurrent=" + 1 + "&pageSize=" + 10;
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				pageCount = data.data.pagination.pageCount;

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


//授权资源组按钮
function authorizeSourse(obj) {
	var funcId = $(obj).parent().parent().attr("funcId");
	$.ajax({
		type: "get",
		url: "/api/mms-api/roleManage/"+roleId+"/addAuthority/"+funcId,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#model-change").modal("hide");
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

//禁止资源组按钮(取消授权)
function forbidSourse(obj) {
  var funcId = $(obj).parent().parent().attr("funcId");
	$.ajax({
		type: "get",
		url: "/api/mms-api/roleManage/"+roleId+"/cancelAuthority/"+funcId,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#model-change").modal("hide");
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

function confirmRole(){
	if(temp_status == true){
		 var a = confirm("确定禁用么？") 
          if (a == true) 
            forbidRole();

	}else{
		 var a = confirm("确定启用么？") 
          if (a == true) 
            startUsingRole();
	}	
	
	
	/*if(temp_status == true){
		 confirm("确定禁用么？", null, function (v) {
          if (v == "ok") {
            forbidRole();
          }
        });
	}else{
		 confirm("确定启用么？", null, function (v) {
          if (v == "ok") {
            startUsingRole();
          }
        });
	}	*/
}

//禁用按钮
function forbidRole() {
    $.ajax({
		type: "get",
		url: "/api/mms-api/roleManage/"+roleId+"/roleDisable",
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
                $("#model-change").modal("hide").on('hidden.bs.modal', initTable);
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//启用按钮
function startUsingRole() {	
	$.ajax({
		type: "get",
		url: "/api/mms-api/roleManage/"+roleId+"/roleEnable",
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
                $("#model-change").modal("hide").on('hidden.bs.modal', initTable);
			} else {
				alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//搜索按钮
function searchBtn() {
	roleName = $("#search-input").val()
	
	initTable();
	initPage();
}