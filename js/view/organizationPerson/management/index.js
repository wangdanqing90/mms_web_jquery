// 初始化分页用的
var pageStatus = true;
var pageCurrent = 1;
var salesName = "",
	phoneNo = "",
	salesCode = "",
	salesOrgName = "";
	var salesId='';
	
console.log(user);
(function(){			
	getManageList()	
})()


function getManageList(flag){
	if(flag){
		pageStatus=true;
		$(".M-box3").hide();
		pageCurrent=1;
		salesName = $('.s-name').val();
		phoneNo = $('.s-phone').val();
		salesCode = $('.s-sales').val();
		salesOrgName = $('.s-salesOrgName').val();		
	}
	
	var param = {		
		salesName : salesName,
		phoneNo : phoneNo,
		salesCode : salesCode,
		salesOrgName: salesOrgName,
		pageCurrent :pageCurrent,
		pageSize : 6
	}	

	
	$.ajax({
		type:"post",
		url:"/api/mms-api/sales/querySales",
		async:true,
		data:param,		
		success:function(data){
			if((data.statusCode == 200) && (data.data.list.length > 0)){
				var html = '';
				if(pageStatus){ initPage(data.data.pageCount)}
				$.each(data.data.list,function(index,item) {
					item.status = item.status.substr(0,1);
					var statusText = item.status == "Z"?"在职":"已离职";
					var color_Class = item.status == "Z"?"button-blue-small":"button-gray-small"
					item.graUniversity = item.graUniversity == null ? "":item.graUniversity;
					item.salesOrgName =  item.salesOrgName == null ? "":item.salesOrgName;
					html +='<tr>'
						html +='<td>'+item.salesCode+'</td>';
						html +='<td>'+item.salesName+'</td>';
						html +='<td>'+item.salesNum+'</td>';
						html +='<td>'+item.phoneNo+'</td>'
						html +='<td>'+item.salesOrgName+'</td>';
						html +='<td>'+item.customCount+'</td>';
						html +='<td>'+statusText+'</td>';
						html +='<td >';
								//html +='<button class="button-green" onclick="management(this)">编码管理</button>';
								html +='<button class="button-blue-small padding-left-0" onclick="details(this,\''+item.salesId+'\')">详情</button>';
								html +='<button class="button-blue-small" onclick="update(this,\''+item.salesId+'\')">修改</button>';
								html +='<button class="'+color_Class+'" onclick="leave(this,\''+item.salesId+'\',\''+item.status +'\')">离职</button>';
						html +='</td>';
					html +='</tr>';										
				});	
				$('.emptyTable').addClass("hide");
				$('#role-tbody').empty().append(html);
			}else{
				$('#role-tbody').empty();
				$('.emptyTable').removeClass("hide");
			}
		},
		error:function(error){
			console.log("错误信息是" + error.message);
		}
	});
	
	
}
// 分页初始化
function initPage(pageCount){
	if(pageCount == undefined){return false;}
	$(".M-box3").show();
	$(".M-box3").pagination({
			pageCount:pageCount,
			jump: true,
			coping: true,
			keepShowPN: true,
			mode: "fixed",			
			homePage: "首页",
			endPage: "尾页",
			prevContent: "上一页",
			nextContent: "下一页",
			callback: function(api) {				
					pageStatus = false;					
					pageCurrent = api.getCurrent();
					getManageList();							
			}
	});	
}



/* 跳转编码管理*/
function management(ele) {
	$('#manage').addClass("active").siblings("div").removeClass("active");
}
/*详情*/
function details(ele,id) {
	$('#deatil').addClass("active").siblings("div").removeClass("active");	
	initUserInfoDetail(id);
}
/* 修改 */
function update(ele,id) {
	$('#update').addClass("active").siblings("div").removeClass("active");	
	initUserInfoUpdate(id);
}
/* 离职 */
function leave(ele,id,status) {
	if(status == "L"){ return false;}
	$.confirm("确认更改在职状态?","营销管理平台",function(e){
		if(e == "cancel"){
			return false;
		}
		var param = {
			salesId : id,
			status : "L"
		}
		$.ajax({
			type:"post",
			url:"/api/mms-api/sales/modifyStatus",
			async:true,
			data:param,
			dataType:'json',
			contentType:"application/x-www-form-urlencoded",	
			success:function(data){
				if(data.statusCode == 200){
					getManageList();
				}else{
					$.alert(data.message);
				}
			},
			error:function(error){
				console.log("离职状态修改信息"+ error);
				
			}
		});
	})	
}
function imPort() {
	$('#input-file-select').val("");  
	$('.file-name').empty();  
	$('#import').addClass("active").siblings("div").removeClass("active");
}
// 新增
function addNew(){
	initAdd();
	$('#add').addClass("active").siblings("div").removeClass("active");
}
// 导出
function exPort(){	 
	window.open("/api/mms-api/sales/export?access_token="+user.token+"&access_id="+user.salesId );
}
