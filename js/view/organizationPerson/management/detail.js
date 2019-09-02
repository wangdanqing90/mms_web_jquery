



function initUserInfoDetail(id){
	if(!$.isLogin()){location.href = '/view/sign/sign.html';}
	var userInfo = $.getUser(id);
	if(userInfo == null){return false;}	
	$(".detail .usernumber").val(userInfo.salesCode);
	$(".detail .userid").val(userInfo.salesNum);
	$('.detail .username').val(userInfo.salesName);
	$('.detail .profess').val(userInfo.positionName);
	var text = userInfo.status == "Z" ? "在职" : "离职";
	$('.detail .position_status').val(text);
	$('.detail .email').val(userInfo.email);
	$('.detail .phone').val(userInfo.phoneNo);
	$('.detail .idType').val(userInfo.idType);
	$('.detail .idCard').val(userInfo.idNumber);
	$('.detail .age').val(userInfo.age);
	$('.detail .entryDate').val(userInfo.entryDate);
	$('.detail .graUniversity').val(userInfo.graUniversity);
	$('.detail .maxEducation').val(userInfo.maxEducationName);
	$('.detail .maxDegree').val(userInfo.maxDegree);
	$('.detail .awardExperie').val(userInfo.awardExperie);
	$('.detail .photoAddress').val(userInfo.photoAddress);
	$('.detail .qrcode').val(userInfo.qrCode);
	$('.detail .adeptDomain').val(userInfo.adeptDomain);
}

