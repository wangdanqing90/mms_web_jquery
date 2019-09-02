var checkVal = 1;

$(function() {
	initTree();
	
	searchType(checkVal)
	$('input:radio[name="searchRadio"]').click(function(){
		checkVal = $('input:radio[name="searchRadio"]:checked').val();
		searchType(checkVal)
	})
})

function initTree() {
	var html = '<li><div class="close_menu" id="menu1"><span  onclick="addMenu(this)"></span><a title="一级菜单" onclick="detail()">一级菜单</a></div><ul></ul></li>';
	$("#tree_ul").append(html);
}
function addMenu(obj) {
	if($(obj).parent().next().children().length == 0) {
		var html = '<div class="close_menu" ><span onclick="addMenu(this)"></span><a title="二级菜单">二级菜单</a></div><ul></ul>'
		$(obj).parent().next().append(html);
		var html = '<div class="close_menu" ><span onclick="addFile(this)" ></span><a title="二级菜单">二级菜单</a></div><ul></ul>'
		$(obj).parent().next().append(html);
	}
}

function addFile(obj) {
	if($(obj).parent().next().children().length == 0) {
		var html = "<li><a title='最后一层'>最后一层1111</a></li>";
		$(obj).parent().next().append(html);
	}
}

//详细信息
function detail() {
	roleId = "1d4041bff32a4be194a1de4dcd154567";
	var roleName = "";
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
	           $(".outerCointer").addClass("hide");
	           $("#detail-inform").removeClass("hide");
				$("#detail-tbody").empty();
				if(data.data.pagination.list.length > 0) {
					$.each(data.data.pagination.list, function(index, item) {
						var html = "<tr funcId=" + "11" + "><td>"+"111"+"</td><td>"+"王光亮"+"</td><td>" + "13811111111" + "</td><td>"+"<span>理财</span><span>基金</span>"+"</td>";
						html += "<td><button class='button-green' onclick='deleteSourse(this)'>移除</button></td></tr>";
						$("#detail-tbody").append(html);
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


//判断查询类型
function searchType(checkVal){	
	if(checkVal == '1'){
		$('#new-org').show();
        $('#new-person').hide();
	}else{
		$('#new-org').hide();
        $('#new-person').show();
	}
}

//取消按钮
function cancleBtn() {
	$(".outerCointer").addClass("hide");
	$("#treebox").removeClass("hide");
	
}

//新建按钮
function newBtn(){
	$(".outerCointer").addClass("hide");
	$("#newCointer").removeClass("hide");
}
