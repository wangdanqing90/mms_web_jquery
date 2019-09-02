var orgId; //选择的组织id
var orgRateId; //提成id

$(function() {
	initTree();
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
					var html = '<li><div class="close_menu" id=' + data.id + '><span onclick="addMenu(this)"></span><a title=' + data.name + " code="+data.code+' onclick="modifyRole(this)">' + data.name + '</a></div><ul></ul></li>'
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
							var html = '<li><div class="close_menu" id=' + data.id + '><span onclick="addMenu(this)"></span><a title=' + data.name + " code="+data.code+' onclick="modifyRole(this)">' + data.name + '</a></div><ul></ul></li>'
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
	orgId = $(obj).parent().attr("id")
	$("#products-id").val($(obj).attr("code"));
	$("#products-name").val($(obj).attr("title"));
	
	
	$(".outerCointer").addClass("hide");
	$("#add-org").removeClass("hide");
	$("#products-per").val("");
	$("#addBtn").removeClass("hide");
}

function validate(num) {
	var reg = /^\d+(?=\.{0,1}\d+$|$)/
	if(reg.test(num)) return true;
	return false;
}

function addBtn() {
	if(!validate($("#products-per").val())) {
		alert("请输入正确的通用提成");
		return;
	}
	var rate = ($("#products-per").val()) / 1000;
	var params = {
		orgId: orgId,
		rate: rate
	}

	var url = "/api/mms-api/orgRate/add";
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		data: params,
		success: function(data) {
			if(data.statusCode == 200) {
				$.alert("操作成功", "", function() {
					cancleBtn();
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

//取消按钮
function cancleBtn() {
	$(".outerCointer").addClass("hide");
	$("#treebox").removeClass("hide");

}

/*提成导入*/
function importBtn() {
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
	$(".file-input-name").remove();
}

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
		var url = "/api/mms-api/salesOrg/importOrgs";
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