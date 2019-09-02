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
//										<button class='button-green' onclick="modifyRole(this)">修改</button>
//										<button class='button-red' onclick='deleteUser(this)'>删除</button>
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

//
