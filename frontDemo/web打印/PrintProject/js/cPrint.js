var pageW = 210; //页面宽
var pageH = 297; //单页面高
var pageMarginTop = 25.4;//页面上边距
var pageMarginBottom = 25.4;//页面下边距
var pageMarginLeft = 19.1;//页面左边距
var pageMarginRigt = 19.1;//页面右边距
// 页边距普通:25.4 31.8;  适中:25.4 19.1; 窄:12.7 12.7; 宽:25.4 50.8

var contentW = pageW-pageMarginLeft-pageMarginRigt;//放置正文的区域宽
var contentH = pageH - pageMarginTop - pageMarginBottom;//放置正文的区域单页高

var headerTop = 12;//页眉顶部距离
var headerMarginLeft = 15;//页眉左侧距离
var headerTextAlign = "left";//页眉位置，left、center、right
var footerBottom = 6;//页脚底部距离
var footerMarginLeft = 0;//页脚左侧距离
var footerTextAlign = "center";//页脚位置，left、center、right

var originalHTML;//缓存原始页面内容
$(function() {
	//拦截Ctrl+P
	$(document).keydown((e)=>{ if(e.keyCode==80 && e.ctrlKey){c_Print(); return false;}});
	//设置body
	$("body").css("width", pageW+"mm");
	var tmpDiv = $("<div id='tmpDiv'></div>");
	$("body").children().wrapAll(tmpDiv);
	$("body").prepend(initPrintArea());
	$("#PrintContentArea").append($("#tmpDiv"));
	
	initToolBar();//初始化快捷工具条，不需要注释掉\删掉即可
	initToolFuc();//初始化快捷条工具条功能

	//表格处理
	tableReRender();
});

//重新生成打印区域内容
function refreshPrintContentArea(){
	originalHTML = $("#tmpDiv").clone(true);
	$("#PrintArea").remove();
	$("body").prepend(initPrintArea());
	$("#PrintContentArea").append(originalHTML);
}

//打印
function c_Print() {
	setPageSettings();
	refreshPrintContentArea();
	//在点打印之前来加页码，以便之前的所有排版设计定型后
	//用不用回不回调，影响不大
	add_H_F(()=>{
		window.print();
		location.reload(true);
	});
}

//初始化快捷工具条
function initToolBar(){
	var toolbar = $("<div id='printToolBar'></div>");
	var toolBarHtml = "<div>" +
			"<button class='printBtn' onclick='c_Print()'>打印</button>" +
			"<span class='spiner'/>"+
			"<div id='pageSetting'><span class='settingTitle'>页面设置</span>"+
				"<div>"+
					"<input type='radio' class='radio' name='pageOrient' value='Landscape'/> 横向"+
					"<input type='radio' class='radio' name='pageOrient' value='Portrait' checked/> 纵向"+
				"</div>"+
				"<div id='pageOrientTip' class='tipMsg'><div>297mm × 210mm</div><div style='margin-top:-5px;color:red'>*打印时设置方向为【纵向】</div></div>"+
			"</div>"+
			"<span class='spiner short'/>"+
			"<div id='pageMarginSetting'><span class='settingTitle'>页边距</span>"+
				"<div>"+
					"<input type='radio' class='radio' name='pageMargins' value='1' checked> 普通"+
					"<input type='radio' class='radio' name='pageMargins' value='2'> 适中"+
					"<input type='radio' class='radio' name='pageMargins' value='3'> 窄"+
					"<input type='radio' class='radio' name='pageMargins' value='4'> 宽"+
				"</div>"+
				"<div>左:<input id='marginL' class='inpt' value='31.8' style='width:30px;' />mm, 右:<input id='marginR' class='inpt' value='31.8' style='width:30px;' />mm</div>"+
				"<div>上:<input id='marginU' class='inpt' value='25.4' style='width:30px;' />mm, 下:<input id='marginB' class='inpt' value='25.4' style='width:30px;' />mm</div>"+
			"</div>"+
			"<span class='spiner short'/>"+
			"<div id='pageHFSetting'>"+
				"<div><span class='settingTitle'>页眉</span><input type='radio' class='radio' name='h_textAlign' value='center'> 居中"+
				"<input type='radio' class='radio' name='h_textAlign' value='left' checked> 居左 <input type='radio' class='radio' name='h_textAlign' value='right'> 居右</div>"+
				"<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  左:<input id='h_marginL' class='inpt' value='15' style='width:30px;' />mm, 上:<input id='h_marginU' class='inpt' value='12' style='width:30px;' />mm</div>"+
				"<div class='spinerPortrait'/>"+
				"<div><span class='settingTitle'>页脚</span><input type='radio' class='radio' name='f_textAlign' value='center' checked> 居中"+
				"<input type='radio' class='radio' name='f_textAlign' value='left'> 居左 <input type='radio' name='f_textAlign' class='radio' value='right'> 居右</div>"+
				"<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  左:<input id='f_marginL' class='inpt' value='0' style='width:30px;' />mm, 下:<input id='f_marginB' class='inpt' value='6' style='width:30px;' />mm</div>"+
			"</div>"+
			"<span class='spiner short'/>"+
			"<div id='pageCountSetting'><span class='settingTitle'>页码总数</span>"+
				"<div style='margin-top: 10px;'>"+
					"<input id='customPageCnt' onchange='customPageCntChange()' class='pageCntInpt' value='自动'/>页"+
					"<div id='customPageCntTip' class='tipMsg' style='color:red'></div>"+
				"</div>"+
			"</div>"+
		"</div>";
	toolbar.html(toolBarHtml);
	$("body").prepend(toolbar);
	
	var toolBarPlaceholder = $("<div id='toolBarPlaceholder'></div>");
	$("body").prepend(toolBarPlaceholder);
}

//初始化快捷条工具条功能
function initToolFuc(){
	//页面设置
	$('input[type=radio][name=pageOrient]').change(function() {
		if (this.value == 'Landscape') {//H
			$("#pageOrientTip").html("<div>297mm × 210mm</div><div style='margin-top:-5px;color:red'>*打印时设置方向为【横向】</div>");
			//pageW = 297; pageH = 220.4;
			pageW = 297; pageH = 210;
			$("body").css("width", pageW+"mm");
			var tmp = $("#marginU").val();
			$("#marginU").val($("#marginR").val());$("#marginR").val($("#marginB").val());
			$("#marginB").val($("#marginL").val());$("#marginL").val(tmp);
		}else if (this.value == 'Portrait') {//Z
			$("#pageOrientTip").html("<div>297mm × 210mm</div><div style='margin-top:-5px;color:red'>*打印时设置方向为【纵向】</div>");
			pageW = 210; pageH = 297;
			$("body").css("width", pageW+"mm");
			var tmp = $("#marginU").val();
			$("#marginU").val($("#marginL").val());$("#marginL").val($("#marginB").val());
			$("#marginB").val($("#marginR").val());$("#marginR").val(tmp);
		}
	});
	//页边距
	$('input[type=radio][name=pageMargins]').change(function() {
		var pageOrient = $('input[type=radio][name=pageOrient]:checked').val();
		if(pageOrient == 'Landscape'){//横向
			if (this.value == '1') {
				$("#marginB").val(31.8);$("#marginU").val(31.8);
				$("#marginL").val(25.4);$("#marginR").val(25.4);
			}else if (this.value == '2') {
				$("#marginB").val(19.1);$("#marginU").val(19.1);
				$("#marginL").val(25.4);$("#marginR").val(25.4);
			}else if (this.value == '3') {
				$("#marginB").val(12.7);$("#marginU").val(12.7);
				$("#marginL").val(12.7);$("#marginR").val(12.7);
			}else if (this.value == '4') {
				$("#marginB").val(50.8);$("#marginU").val(50.8);
				$("#marginL").val(25.4);$("#marginR").val(25.4);
			}
		}else if(pageOrient == 'Portrait'){//纵向
			if (this.value == '1') {
				$("#marginL").val(31.8);$("#marginR").val(31.8);
				$("#marginU").val(25.4);$("#marginB").val(25.4);
			}else if (this.value == '2') {
				$("#marginL").val(19.1);$("#marginR").val(19.1);
				$("#marginU").val(25.4);$("#marginB").val(25.4);
			}else if (this.value == '3') {
				$("#marginL").val(12.7);$("#marginR").val(12.7);
				$("#marginU").val(12.7);$("#marginB").val(12.7);
			}else if (this.value == '4') {
				$("#marginL").val(50.8);$("#marginR").val(50.8);
				$("#marginU").val(25.4);$("#marginB").val(25.4);
			}
		}
	});
}

//自定义调整页码
function customPageCntChange(e){
	var pageCnt = $("#customPageCnt").val();
	var ex = /[1-9]+\d*/;
	if(pageCnt != '自动' && !ex.test(pageCnt)){
		$("#customPageCntTip").html("请设置正整数 或 '自动'.");
	}else{
		$("#customPageCntTip").html("");
	}
}

//获取页面设置信息
function setPageSettings(){
	//纸张方向 页边距
	pageMarginTop = $("#marginU").val();
	pageMarginBottom = $("#marginB").val();
	pageMarginLeft = $("#marginL").val();
	pageMarginRigt = $("#marginR").val();
	contentW = pageW-pageMarginLeft-pageMarginRigt;
	contentH = pageH - pageMarginTop - pageMarginBottom;

	//页眉页脚
	var h_textAlign = $('input[type=radio][name=h_textAlign]:checked').val();
	headerTop = $("#h_marginU").val();
	headerMarginLeft = $("#h_marginL").val();
	headerTextAlign = h_textAlign;
	
	var f_textAlign = $('input[type=radio][name=f_textAlign]:checked').val();
	footerBottom =$("#f_marginB").val();
	footerMarginLeft = $("#f_marginL").val();
	footerTextAlign = f_textAlign;
}

//原文中table的处理
function tableReRender() {
	$("table:not(.print-container)").each(function(i){
		$(this).children().wrapAll("<tbody></<tbody>");
		$(this).prepend(
			"<thead>" +
			"	<tr class = 'head-tr'>" +
			"		<td class='head-td' colspan='100'></td>" +
			"	</tr>" +
			"</thead>" +
			"<tfoot >" +
			"	<tr class = 'foot-tr'>" +
			"		<td class='foot-td' colspan='100'></td>" +
			"	</tr>" +
			"</tfoot>"
		);
	});
}

// 初始化打印区域
function initPrintArea(){
	var html = 
	"<div id='PrintArea' style='width: "+contentW+"mm; "+" padding:0mm " + pageMarginRigt + "mm 0mm " + pageMarginLeft + "mm;'>" +
		"<header style='width: "+contentW+"mm; height: "+pageMarginTop+"mm; line-height:"+pageMarginTop+"mm;'>"+
			"<h5></h5>"+
		"</header>"+
		"<footer style='width: "+contentW+"mm; height: "+pageMarginBottom+"mm; line-height:"+pageMarginBottom+"mm;'>"+
			"<h5></h5>"+
		"</footer>"+
		"<table style='width: 100%;' class='print-container'>"+
			"<thead class='print-header'>"+
				"<tr>"+
					"<td class='print-header-cell' style='height: "+pageMarginTop+"mm;'>"+
						"<div class='header-info'>"+
						"</div>"+
					"</td>"+
				"</tr>"+
			"</thead>"+
			"<tfoot class='print-footer'>"+
				"<tr>"+
					"<td class='print-footer-cell' style='height: " + pageMarginBottom + "mm;border:1px solid green !important'>"+
						"<div class='footer-info'>"+
						"</div>"+
					"</td>"+
				"</tr>"+
			"</tfoot>"+
			"<tbody class='print-content'>"+
				"<tr>"+
					"<td id='PrintContentArea' class='print-content-cell'>"+
					"</td>"+
				"</tr>"+
			"</tbody>"+
		"</table>"+
	"</div>";
	
	return $(html);
}

//最终把正真的页眉、页脚加上
function add_H_F(callback){
	var PAGE_H_F_Html = "<div class='PAGE_H_F' id='PAGE_H_F'></div>";
	$("body").prepend(PAGE_H_F_Html);
	
	var headerText = "";
	if($(".title").length == 0 || $(".title").html().length <= 0){
		var docTitle = $("title");
		if(docTitle.length > 0 && docTitle.html().length > 0){
			headerText = docTitle.html();
		}
	}else{
		headerText = $(".title").html();
	}
	var footerText = "";
	var pageCnt = $("#customPageCnt").val();
	debugger
	var ex = /[1-9]+\d*/;
	if(pageCnt == '自动' || !ex.test(pageCnt)){
		pageCnt = getPageCnt();
	}
	var fineTune = 0.185;
	var pageOrient = $('input[type=radio][name=pageOrient]:checked').val();
	if(pageOrient == 'Portrait'){//纵向
		fineTune= -0.13;
	}
	`<div class='content' id='content' style='width: 210mm; height: 297.13mm;'>
	 <span class='PAGE_H' style='text-align:left; width: 195mm; top:0mm; padding-top:12mm; padding-left: 15mm;'>
	页眉（自动读取作为页眉，还可带样式哟！）
	<p>--------------------------------------------------------</p>
    </span> 
    <span class='PAGE_F' style='text-align:center; width: 210mm; bottom:0mm; padding-bottom:6mm; padding-left: 0mm;'>-第1页-</span>

    </div>`
	
	for(var i=1; i<=pageCnt; i++){
		footerText = "-第"+i+"页-";
		var PAGE_H_F_Idx = "<div class='content' id='content' style='width: "+pageW+"mm; height: "+(pageH-fineTune)+"mm;'>"+
		" <span class='PAGE_H' style='text-align:"+headerTextAlign+"; width: "+(pageW-headerMarginLeft)+"mm; top:0mm; padding-top:"+headerTop+"mm; padding-left: "+headerMarginLeft+"mm;'>"+headerText+"</span>"+
		" <span class='PAGE_F' style='text-align:"+footerTextAlign+"; width: "+(pageW-footerMarginLeft)+"mm; bottom:0mm; padding-bottom:"+footerBottom+"mm; padding-left: "+footerMarginLeft+"mm;'>"+footerText+"</span>"+
		"</div>"
		
		$("#PAGE_H_F").append(PAGE_H_F_Idx);
	}
	
	callback && callback(true);
}

//获取页面页数
function getPageCnt(){
	var cnt = 0;
	// 外宽度默认包括元素的内边距(padding)、边框(border)，但不包括外边距(margin)部分的宽度。
	// 可以指定参数为true，以包括外边距(margin)部分的宽度。
	var printAreaHeight = $("#PrintArea").outerHeight(true);
	var titleClassHeight = 0;
	if($(".title").length > 0){
		titleClassHeight = $(".title").outerHeight(true);
	}
	
	printAreaHeight = px2mm(printAreaHeight - titleClassHeight);
	//有 7mm 误差吗(待测试)  误差修正? 解决方案，发现不准时：手动输入实际页码
	var cnt = Math.ceil(printAreaHeight / (pageH-pageMarginTop-pageMarginBottom+7));
	
	return cnt;
}

//根据DPI 像素转为 mm
function px2mm(px) {
	var dpi = getDPI();
	// 1 英寸=2.54 厘米
	var mm = parseFloat(px) * 25.4 / dpi[0];//只计算x轴的dPI
	return mm;
}

//获取DPI
function getDPI() {
	var arrDPI = new Array();
	if (window.screen.deviceXDPI != undefined) { //ie 9
		arrDPI[0] = window.screen.deviceXDPI;
		arrDPI[1] = window.screen.deviceYDPI;
	} else { //chrome firefox
		var tmpNode = document.createElement("DIV");
		tmpNode.style.cssText = "width:1in; height:1in; position:absolute; left:0px; top:0px; z-index:99; visibility:hidden;";
		document.body.appendChild(tmpNode);
		arrDPI[0] = parseInt(tmpNode.offsetWidth);
		arrDPI[1] = parseInt(tmpNode.offsetHeight);
		tmpNode.parentNode.removeChild(tmpNode);
	}
	return arrDPI;
}
