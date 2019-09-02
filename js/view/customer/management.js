var pageIndex_one = 1;
var total=100;
var page_status = false;

$(function() {
	initTable();
	initPage();
})

//初始化表格列表
function initTable() {
	$("#management-tbody").empty();
	
	var html = "<tr><td>" + "1111111111111111" + "</td><td>" + "name" + "</td><td>" + "biaoshi" + "</td>" ;
	$("#management-tbody").append(html);

	var html = "<tr><td>" + "1111111111111111" + "</td><td>" + "name" + "</td><td>" + "biaoshi" + "</td>" ;
	$("#management-tbody").append(html);
}


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


