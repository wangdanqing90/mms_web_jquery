var pageIndex_one = 1;
var total=100;
var page_status = true;

$(function(){
//	initTable()
	initPage();
})

//初始化表格列表
//function initTable() {
//	$.ajax({
//		type: "get",
//		url: ",
//		async: true,
//		contentType: "application/json",
//		dataType: "json",
//		success: function(data) {
//			if(data.statusCode == 200) {
//				$("#role-tbody").empty();
//				if(data.data.pagination.list.length > 0) {
//					$(".emptyTable").addClass("hide");
//
//					var html = '';
//					$.each(data.data.pagination.list, function(i,item) {
//						html += `<tr>
//									<td>组织编码</td>
//									<td>组织名称</td>
//									<td>联系方式</td>
//									<td>组织地址组织地址组织地址</td>
//									<td>
//										<button class='button-green' onclick="modifyOrganization(this)">修改</button>
//										<button class='button-red' onclick='deleteOrganization(false)'>删除</button>
//									</td>
//								</tr>`
//						
//					});
//					$("#role-tbody").append(html);
//				}else{
//					$(".emptyTable").removeClass("hide");
//				}
//	
//			} else {
//				$.alert(data.message);
//			}
//		},
//		error: function(error) {
//			console.log(error);
//		}
//	});
//}


//翻页
function initPage() {
  page_status = true;
  $(".M-box3").show();
  $(".M-box3").pagination({
    pageCount: Math.ceil(total / 10),
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
     /* pageIndex_one = api.getCurrent();
      initList();*/
    }
  });  
}

//新建组织
function createNew(){
	$("#model-create").modal("show");
	$("#model-create").modal("show").on('hidden.bs.modal', function(e) {
		//清空form表单
		document.getElementById("model-create-form").reset();
		$("#model-create .form-error").addClass("hide")
	});
}

//新建表单验证
//$("#model-add-userName").bind("input propertychange", checkCreateInform);


function checkCreateInform() {
//	var userName = $("#model-add-userName").val();
//	var pass = $("#model-add-pass").val();
//	var phoneNo = $("#model-add-phone").val();
//	var salesNo = $("#model-add-salesNo").val();
//	if($.isNullOrBlank(userName) || $.isNullOrBlank(pass) || $.isNullOrBlank(phoneNo) || $.isNullOrBlank(salesNo)) {
//		$("#model-add .form-error").removeClass("hide")
//		$("#model-add .form-error").text("请填写完整用户信息");
//		return false;
//	} else {
//		$("#model-add .form-error").addClass("hide")
//		return true;
//	}
}

//确认 新建组织
function createNewCallback(){
	
}

//修改组织
function modify(){
	//清空form表单
	document.getElementById("create-organize-form").reset();
	$("#create-organize-form .form-error").addClass("hide")

	$(".outerCointer").addClass("hide")
	$("#create-organize").removeClass("hide")
}
//取消修改组织按钮
function cancleBtn() {
	$(".outerCointer").addClass("hide");
	$("#table-info").removeClass("hide");
	
}
//确认修改组织按钮
function createOKBtn() {
	var roleName = $("#model-add-roleName").val();
	var roleRemark = $("#model-add-roleRemark").val();

	if(checkAddInform()) {
		
		$(".outerCointer").addClass("hide")
		$("#treebox").removeClass("hide")
		/*var param = {
			roleName: "roleName",
			roleRemark: roleRemark
		};
		$.ajax({
			type: "post",
			url: "/api/mms-api/roleManage/addNew",
			async: true,
			data: JSON.stringify(param),
			contentType: "application/json",
			dataType: "json",
			success: function(data) {
				if(data.statusCode == 200) {
					$("#model-add").modal("hide")
				} else {
					$.alert(data.message);
				}
			},
			error: function(error) {
				console.log(error);
			}
		});*/
	}

}
// 修改校验
function checkAddInform() {
	var name = $("#create-organize-name").val();
	var code = $("#create-organize-code").val();
	if($.isNullOrBlank(name)) {
		$("#create-organize .form-error").removeClass("hide")
		$("#create-organize .form-error").text("请填写组织名称");
		return false;
	} else if($.isNullOrBlank(code)) {
		$("#create-organize .form-error").removeClass("hide")
		$("#create-organize .form-error").text("请填写组织编码");
		return false;
	} else {
		$("#create-organize.form-error").addClass("hide")
		return true;
	}
}




//删除组织
function deleteOrganization(){
	
}
