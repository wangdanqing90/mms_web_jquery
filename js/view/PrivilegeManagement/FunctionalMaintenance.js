var currentPage = 1; //当前页
var totalSize = 100; //总页数+1

$(function() {
	initTable();
	initPage();
})

//初始化表格列表
function initTable() {
	$("#role-tbody").empty();
	var html = `<tr>
					<td>1111111111100000011111ID</td>
					<td>11111111111ID</td>
					<td>1111111111111111ID</td>
					<td>上级ID</td>
					<td>beizhu </td>
					<td>zhaungtai</td>
					<td>0</td>
					<td>1 </td>
					<td>string</td>
					<td>1111111111111111ID</td>
					<td>99</td>
					<td><button class='button-green' onclick='modifyRole(this)'>修改</button></td>
				</tr>`;
	$("#role-tbody").append(html);

}

//新增用户
function addNewUser(obj){
	$("#model-add").modal("show");
}


//修改角色按钮，弹出模态框
function modifyRole(obj) {
	$("#model-change").modal("show");
	
	$("#modal-role-tbody").empty();	
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);
	var html = "<tr><td>" + "客户管理" + "</td><td>" + "已授权" + 
		"</td><td><button class='button-green' onclick='authorizeSourse(this)'>授权</button><button class='button-green' onclick='forbidSourse(this)'>禁止</button></td></tr>";
	$("#modal-role-tbody").append(html);


}

//翻页
function initPage() {
	var pageDiv = $("div.page");

	pageDiv.page({
		pageSize: 10,
		total: (Number(currentPage) + totalSize) * 10
	});
	pageDiv.pageSelect(currentPage);
	$("div.page").delegate("a", "click", function() {
		initTable();
	});
}

//授权资源组按钮
function authorizeSourse(){
	
}

//禁止资源组按钮
function forbidSourse(){
	
}



//禁用按钮
function forbidRole(){
	
}

//启用按钮
function startUsingRole(){
	
}
