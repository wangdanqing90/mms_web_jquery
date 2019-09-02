/*creat by maybe
 * time 2019-2-28
 * 公共变量,方法
*/

var user = $.cookie("user");
$(function(){
	if((user == undefined) || (user == "")){location.href = '/view/sign/sign.html';}
	user = JSON.parse(user);
	
})
// 返回到默认的页面通用函数
function blackIndex() {
	$('.tab-content .tab-pane:first').addClass("active").siblings(".tab-pane").removeClass("active");
}

