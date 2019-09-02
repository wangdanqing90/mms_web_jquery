var PageCurrent = 1;
var page_status = false;
var pageCount = 0;
var roleId;
var selectId; //选择的机构id
var selectName; //选择的机构名字
var isChangeOrg = false; //新增组织为false修改组织信息时为true

var selectPersonIds = []; //转移时 选的人id
var selectPersonNames = [];
var targetOrgId; //转移时 目标组织id
var targetOrgName;
var tempObj;
var isOrg;//导入excell为组织还是人员
var tempPerSalesIds=[];



$(function() {
	initTree();
	/*alert($("#content-wrapper-out").height())*/
})

function initTree() {
	$("#tree_ul").empty();
	addMenuInit();
}

//创建树原点
function addMenuInit() {
	var url = "/api/mms-api/salesOrg/treeList" + "?parentId=";
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$.each(data.data, function(index, data) {
					var html = '<li><div class="close_menu" id=' + data.id + '><span onclick="addMenu(this)"></span><a title=' + data.name + ' onclick="modifyRole(this)">' + data.name + '</a></div><ul></ul></li>'
					
					$("#tree_ul").append(html);
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

//点开下一级菜单
function addMenu(obj) {
	if($(obj).parent().next().children().length == 0) {
		var parentId = $(obj).parent().attr("id");
		var url = "/api/mms-api/salesOrg/treeList" + "?parentId=" + parentId;
		$.ajax({
			type: "get",
			url: url,
			async: true,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					$.each(data.data, function(index, data) {
						if(data.type == "ORG") { //组织
							var html = '<li><div class="close_menu" id=' + data.id + '><span onclick="addMenu(this)"></span><a title=' + data.name + ' onclick="modifyRole(this)">' + data.name + '</a></div><ul></ul></li>'
							$(obj).parent().next().append(html);
						} else if(data.type == "PERSON") { //人
							var html = '<li class="person"><span></span><a title=' + data.salesName + '>' + data.salesName + '</a></li>';
							$(obj).parent().next().append(html);
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
}

//详细信息
function modifyRole(obj) {
	tempObj = obj;
	var title = $(tempObj).attr("title")
	selectName = title;
	$("#create-inform-name").text(title);
	var id = $(tempObj).parent().attr("id");
	selectId = id;
	modifyRoleCallBack();
}

function modifyRoleCallBack() {
	$.ajax({
		type: "get",
		url: "/api/mms-api/salesOrg/" + selectId + "/childList",
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$(".outerCointer").addClass("hide");
				$("#create-inform").removeClass("hide");
				$("#modal-role-tbody").empty();
				if(data.data.length > 0) {
					$.each(data.data, function(index, item) {
							if(item.type == "ORG") { //组织
								var html = "<tr id=" + item.id + " title=" + item.name + "><td>" + item.name + "(" + item.code + ")</td>";
								if(item.onCheck == true) {//审核中
									html += "<td><button class='button-blue-small' disabled onclick='forbiddenOrg(this)'>禁用</button><button class='button-blue-small margin-left-20' disabled onclick='openOrg(this)'>启用</button></td></tr>";
								}
								else if(item.status == "OPENED") {
									html += "<td><button class='button-blue-small' onclick='forbiddenOrg(this)'>禁用</button><button class='button-blue-small margin-left-20' disabled onclick='openOrg(this)'>启用</button></td></tr>";
								} else {
									html += "<td><button class='button-blue-small ' disabled onclick='forbiddenOrg(this)'>禁用</button><button class='button-blue-small margin-left-20'  onclick='openOrg(this)'>启用</button></td></tr>";
								}
								$("#modal-role-tbody").append(html);
							} else { //人员
								var html = "<tr id=" + item.id + " title=" + item.salesName + "><td>" + item.salesName + "(" + item.salesNo + ")</td>";
								html += "<td><button class='button-blue-small' ";
								if(item.onCheck == true) {//审核中
									html += "disabled onclick='authorizeSourse(this)'>负责人</button><button class='button-blue-small margin-left-20' disabled onclick='deleteSourse(this)'>删除</button></td></tr>";
								}
								else if(item.admin) { //已是负责人
									html += " onclick='unAuthorizeSourse(this)'>取消负责人</button><button class='button-blue-small margin-left-20' onclick='deleteSourse(this)'>删除</button></td></tr>";
								} else { //不是负责人
									html += " onclick='authorizeSourse(this)'>负责人</button><button class='button-blue-small margin-left-20' onclick='deleteSourse(this)'>删除</button></td></tr>";
								}

								$("#modal-role-tbody").append(html);
							}						
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

//取消负责人按钮
function unAuthorizeSourse(obj) {
	var id = $(obj).parent().parent().attr("id");
	var url = "/api/mms-api/salesOrg/" + id + "/cancelAdmin";
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$.alert(data.message, "", function() {
					modifyRoleCallBack();
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

//负责人按钮
function authorizeSourse(obj) {
	var id = $(obj).parent().parent().attr("id");
	var url = "/api/mms-api/salesOrg/" + id + "/updateToAdmin";
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$.alert(data.message, "", function() {
					modifyRoleCallBack();
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

//人员删除按钮
function deleteSourse(obj) {
	var title = $(obj).parent().parent().attr("title")
	var id = $(obj).parent().parent().attr("id");
	var txt = "确定删除" + title + "么？"
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var url = "/api/mms-api/salesOrg/" + id + "/delete";
			$.ajax({
				type: "get",
				url: url,
				async: true,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert(data.message, "", function() {
							modifyRoleCallBack();
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

//组织禁用按钮
function forbiddenOrg(obj) {
	var title = $(obj).parent().parent().attr("title")
	var id = $(obj).parent().parent().attr("id");
	var txt = "确定禁用" + title + "么？"
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var url = "/api/mms-api/salesOrg/" + id + "/invalid";
			$.ajax({
				type: "get",
				url: url,
				async: true,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert(data.message, "", function() {
							modifyRoleCallBack();
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

//组织启用按钮
function openOrg(obj) {
	var title = $(obj).parent().parent().attr("title")
	var id = $(obj).parent().parent().attr("id");
	var txt = "确定启用" + title + "么？"
	$.confirm(txt, null, function(v) {
		if(v == "ok") {
			var url = "/api/mms-api/salesOrg/" + id + "/open";
			$.ajax({
				type: "get",
				url: url,
				async: true,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert(data.message, "", function() {
							modifyRoleCallBack();
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

//转移按钮
function transferBtn() {
	$("#transfer-search").val("");
	transferSearchBtn();

	var url = "/api/mms-api/salesOrg/" + selectId + "/childSales";
	$.ajax({
		type: "get",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$(".outerCointer").addClass("hide");
				$("#transfer").removeClass("hide");
				$("#transfer-tbody").empty();
				if(data.data.length > 0) {
					$.each(data.data, function(index, item) {					
						var html = "<tr id=" + item.id + " name=" + item.salesName + "><td><label class='checkBox'><input type='checkbox' name='mycheckboxNext'></label></td><td>" + item.salesName + "</td><td>" + "50" + "</td>";
						html += "<td><button class='button-blue-small' onclick='transferDelete(this)'>删除</button></td></tr>";
						$("#transfer-tbody").append(html);
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

function transferDelete(obj) {
	$(obj).parent().parent().remove();
}

function transferSearchBtn() {
	var search = $("#transfer-search").val();
	var params = {
		search: search
	};
	var url = "/api/mms-api/salesOrg/" + selectId + "/getOrgs";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		data: params,
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$("#transfer-li").empty();
				if(data.data.length > 0) {
					$.each(data.data, function(index, item) {
						var li = "<li  id=" + item.id + " name=" + item.name + " onclick='transferSelect(this)'>" + item.name + "(" + item.code + ")</li>";
						$("#transfer-li").append(li);
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

function transferSelect(obj) {
	$(obj).parent().find("li").removeClass("li-select");
	$(obj).addClass("li-select");

	$("#transfer-search").val($(obj).attr("name"));
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

//转移人员第二步
function transferNextBtn() {
	var obj=$("#transfer-tbody input[name=mycheckboxNext]")
	var checkboxs = getCheckbox(obj);
	if(checkboxs.length == 0) {
		$.alert("请选择人员");
		return;
	}

	var targetOrg = $("#transfer-li .li-select");
	if(targetOrg.length == 0) {
		$.alert("请选择组织");
		return;
	} else {
		targetOrgId = $(targetOrg).attr("id");
		targetOrgName = $(targetOrg).attr("name");
	}

	selectPersonIds = [];
	selectPersonNames = [];
	$.each(checkboxs, function(index, item) {
		selectPersonIds.push($(item).parent().parent().parent().attr("id"));
		selectPersonNames.push($(item).parent().parent().parent().attr("name"));
	})

	$("#model-transfer").modal("show")
	$("#modal-transfer-tbody").empty();
	$.each(selectPersonNames, function(index, item) {
		var html = "<tr><td>" + (index+1) + "</td><td>" + item + "</td>";
		html += "<td>" + selectName + "</td><td>" + targetOrgName + "</td></tr>";
		$("#modal-transfer-tbody").append(html);
	})
}

//确认转移
function transferOKBtn() {
	$("#model-transfer").modal("hide");
	var ids = selectPersonIds.join(',')
	var params = {
		ids: ids,
		targetOrgId: targetOrgId
	}
	var url = "/api/mms-api/salesOrg/transferSales";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		data: params,
		dataType: "json",
		success: function(data) {
			if(data.statusCode == 200) {
				$.alert(data.message, "", function() {
										location.reload();
									});
			} else if(data.statusCode == 301) {
				$.confirm("点击确定调整业绩归属", null, function(v) {
					if(v == "ok") {
						var url = "/api/mms-api/salesOrg/confirmMerge";
						$.ajax({
							type: "post",
							url: url,
							async: true,
							contentType: "application/x-www-form-urlencoded",
							data: params,
							dataType: "json",
							success: function(data) {
								if(data.statusCode == 200) {
									$.alert(data.message, "", function() {
										location.reload();
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
			} else {
				$.alert(data.message);
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
}

//添加人员按钮
function personBtn() {
	$("#create-person-name").val("");
	searchBtn();

	$(".outerCointer").addClass("hide")
	$("#create-person").removeClass("hide")
}

//刷新人员列表
function searchBtn() {
	var url = "/api/mms-api/salesOrg/" + selectId + "/getSales";
	var search = $("#create-person-name").val();
	var params = {
		search: search
	};
	$.ajax({
		type: "post",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		data: params,
		success: function(data) {
			if(data.statusCode == 200) {
				$("#create-person-li").empty();
				$.each(data.data, function(index, data) {
					var li = "<li salesId=" + data.salesId + " name=" + data.name +" mobile=" + data.mobile+ " onclick='personSelect(this)'>" + data.name + "(" + data.mobile + ")</li>";
					$("#create-person-li").append(li);
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

function personSelect(obj) {
	$(obj).parent().find("li").removeClass("li-select");
	$(obj).addClass("li-select");

	var name = $(obj).attr("name");
	$("#create-person-name").val(name);
	
	checkPersons(obj);
}

//从左边ul加入到右边ul
function checkPersons(obj){	
	var salesid=$(obj).attr("salesid")
	if( tempPerSalesIds.indexOf(salesid)==-1){
		tempPerSalesIds.push(salesid)
		
		var li = "<li salesId=" + salesid  + " >" +"<label class='checkBox' style='float:left;'><input type='checkbox' name='mycheckboxNext'></label>"+ $(obj).attr("name") + "(" + $(obj).attr("mobile") + ") <button class='button-blue-small' onclick='removeli(this)'>删除</button></li>";
		$("#create-person-li-2").append(li);
	}
}

//删除右边的一个li
function removeli(obj){
	var salesid=$(obj).parent().attr("salesid");	
	var index = tempPerSalesIds.indexOf(salesid); 
    if (index > -1) { 
    	$(obj).parent().remove();
        tempPerSalesIds.splice(index, 1); 
    } 
}

//确定加入人员按钮
function personOKBtn() {
	var obj=$("#create-person-li-2 input[name=mycheckboxNext]")
	var checkboxs = getCheckbox(obj);
	
	if(checkboxs.length == 0) {
		$.alert("请选择人员");
		return;
	}

	var str=""
	$.each(checkboxs, function(index, item) {
		if(index == 0){
			str+=$(item).parent().parent().attr("salesid");
		}else{
			str+=","
			str+=$(item).parent().parent().attr("salesid");
		}
	})
		
	var params = {
				salesIds:str,
				parentOrgId: selectId
	};

	var url = "/api/mms-api/salesOrg/addRef";
	$.ajax({
			type: "post",
			url: url,
			async: true,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			data:params,
			success: function(data) {
				if(data.statusCode == 200) {
					$.alert(data.message, "", function() {
							location.reload();
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

//添加组织按钮false 修改组织true
function orgainizeBtn(index) {
	//清空form表单
	document.getElementById("create-organize-form").reset();
	$("#create-organize-form .form-error").addClass("hide")

	$(".outerCointer").addClass("hide");
	$("#create-organize").removeClass("hide");
	if(index == false) { //添加组织
		isChangeOrg = false;
        $("#addBtn").text("添加")
	} else { //修改组织
		isChangeOrg = true;
		$("#addBtn").text("修改")
		//回填信息
		var url = "/api/mms-api/salesOrg/" + selectId + "/editInfo";
		$.ajax({
			type: "get",
			url: url,
			async: true,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					$("#create-organize-name").val(data.data.name);
					$("#create-organize-code").val(data.data.code);
					$("#create-organize-describe").val(data.data.remark);
					$("#create-organize-area").val(data.data.address);
					$("#create-organize-contact").val(data.data.phone);
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

//确认创建组织按钮
function createOKBtn() {
	var roleName = $("#create-organize-name").val();
	var remark = $("#create-organize-describe").val();
	var address = $("#create-organize-area").val();
	var phone = $("#create-organize-contact").val();
	checkAddInform().then(function(ResultJson) {

		$("#create-organize .form-error").addClass("hide");
		if(isChangeOrg) { //修改组织

			var url = "/api/mms-api/salesOrg/edit";
			var search = $("#create-person-name").val();
			var params = {
				name: roleName,
				remark: remark,
				address: address,
				phone: phone,
				id: selectId
			};
			$.ajax({
				type: "post",
				url: url,
				async: true,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				data: params,
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert(data.message, "", function() {
							location.reload();
						});
					} else {
						$.alert(data.message);
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		} else { //添加组织
			var url = "/api/mms-api/salesOrg/addNew";
			var search = $("#create-person-name").val();
			var params = {
				name: roleName,
				remark: remark,
				address: address,
				phone: phone,
				parentId: selectId
			};
			$.ajax({
				type: "post",
				url: url,
				async: true,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				data: params,
				success: function(data) {
					if(data.statusCode == 200) {
						$.alert(data.message, "", function() {
							location.reload();
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

	}).catch(function(data) {
		$("#create-organize .form-error").removeClass("hide");
		$("#create-organize .form-error").text(data)
	});

}

//取消按钮
function cancleBtn() {
	$(".outerCointer").addClass("hide");
	$("#create-inform").removeClass("hide");

}
//返回首页
function cancleHomeBtn() {
	$(".outerCointer").addClass("hide");
	$("#treebox").removeClass("hide");
}

//创建和修改组织，检测名字
function checkAddInform() {
	return new Promise(function(resolve, reject) {
		var name = $("#create-organize-name").val();
		if($.isNullOrBlank(name)) {
			reject("请填写组织名称");
		} else {
			var params;
			if(isChangeOrg == false) { //新增
				params = {
					name: name,
				};
			} else {
				params = { //修改
					name: name,
					id: selectId
				};
			}
			var url = "/api/mms-api/salesOrg/checkName";
			$.ajax({
				type: "post",
				url: url,
				async: true,
				contentType: "application/x-www-form-urlencoded",
				dataType: "json",
				data: params,
				success: function(data) {
					if(data.statusCode == 200) {
						if(data.data == true) {
							resolve(true);
						} else {
							reject("组织名称不通过");
						}
					} else {
						$.alert(data.message);
						reject("组织名称不通过");
					}
				},
				error: function(error) {
					reject("组织名称不通过");
				}
			});
		}
	})
}

/*组织结构模板下载*/
function orgDownloadBtn(){
    window.location.href="/api/mms-api/salesOrg/export";
}
/*人员归属模板下载*/
function perDownloadBtn(){
	location.href="/api/mms-api/salesOrg/salesOrgRefTemplateDownload";
}
/*组织结构模板导入按钮*/
function orgImportBtn() {
	isOrg=true;
	fileclear();
	$("#model-upload").modal("show");
}

/*人员归属批量导入*/
function perImportBtn(){
	isOrg=false;
	fileclear();
	$("#model-upload").modal("show");
}

function upload() {　
	document.getElementById("fileId").click();
}

function fileclear() {
	
	$(".file-input-name").text("");
	document.getElementById("fileId").value="";
}

function filechange() {
	
	$(".file-input-name").text("");
}

/*组织结构导入和人员归属导入*/
function check() {
	var objFile = document.getElementById("fileId");
	if(objFile.value == "") {
		alert("不能为空");
		return;
	}

	var files = $('#fileId').prop('files'); //获取到文件列表
	if(files.length == 0) {
		alert('请选择文件');
	} else {
		var formData = new FormData();
		var name = $("#fileId").val();
		formData.append("file", document.getElementById("fileId").files[0]);
		formData.append("name", name);
		var url;
		if(isOrg){
			url = "/api/mms-api/salesOrg/importOrgs";
		}else{
			url = "/api/mms-api/salesOrg/importOrgSalesRef";
		}
		
		
		$.ajax({
			type: "post",
			url: url,
			async: true,
			contentType: false,
			dataType: "json",
			processData: false,
			data: formData,
			success: function(data) {
				$("#model-upload").modal("hide");
				if(data.statusCode == 200) {
					alert(data.message);
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

function allSelect(){
	var obj = document.getElementsByName("mycheckboxNext");
	var checkboxs = getCheckbox(obj);
	if(checkboxs.length == obj.length){
		$("input[name='mycheckboxNext']").prop("checked", false);  
	}else{
		$("input[name='mycheckboxNext']").prop("checked", true);   

	}
}