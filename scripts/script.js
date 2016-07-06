
var wallpapers = [
		{
			url: "BathurstBay_ZH-CN15704350271_1920x1080.jpg",
			width: 1920,
			height: 1080
		},
		{
			url: "KientzheimVineyards_ZH-CN9908740039_1920x1080.jpg",
			width: 1920,
			height: 1080
		},
		{
			url: "MarrakeshMarket_EN-US10582051456_1920x1080.jpg",
			width: 1920,
			height: 1080
		},
		{
			url: "ReichstagDome_ZH-CN9358724121_1920x1080.jpg",
			width: 1920,
			height: 1080
		},
	]
	for (var i = 0; i < wallpapers.length; i++) {
		wallpapers[i].url = "images/wallpapers/" + wallpapers[i].url;
	}
var setColor = function(wallpaper,fn,n){
	n = n || 5;
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var image = new Image;
	image.src = wallpaper.url;
	image.onload = function(){
		canvas.width = wallpaper.width;
		canvas.height = wallpaper.height;
		ctx.drawImage(image,0,0);
		var imageData = ctx.getImageData(400,400,n,n);
		var color = [0,0,0,0];
		for (var i = 0; i < imageData.data.length; i+=4) {
			color[0]+=imageData.data[i];
			color[1]+=imageData.data[i+1];
			color[2]+=imageData.data[i+2];
			color[3]+=imageData.data[i+3];
		}
		for (var i = 0; i < color.length; i++) {
			color[i] = parseInt(color[i]/n/n);
		}
		color[3] = parseInt(color[3]/255);
		if (color[0]+color[1]+color[2] > 450) {
			color[0] /= 2;
			color[1] /= 2;
			color[2] /= 2;
		}
		fn(color);
	}
}

var darken = function(color,percentage){
	var temp = [];
	for (var i = 0; i < color.length; i++) {
		temp[i] = color[i];
	}
	if (percentage > 0) {
		for (var i = 0; i < temp.length; i++) {
			if (i === 3) break;
			temp[i] = parseInt(Number(temp[i])*(1+percentage/100));
		}
	}
	return temp;
}
var lighten = function(color,percentage){
	var temp = [];
	for (var i = 0; i < color.length; i++) {
		temp[i] = color[i];
	}
	if (percentage > 0) {
		percentage = -percentage;
		for (var i = 0; i < temp.length; i++) {
			if (i === 3) break;
			temp[i] = parseInt(Number(temp[i])*(1+percentage/100));
		}
	}
	return temp;
}
var alpha = function(color,opacity) {
	var temp = [];
	for (var i = 0; i < color.length; i++) {
		temp[i] = color[i];
	}
	if (temp.length === 4) {
		temp[3] = opacity;
	}
	return temp;
}

var color2rgba = function(color){
	return "rgba("+color.join(", ")+")";
}

var changeTheme = function(){
	var wallpaper = wallpapers[Math.floor(Math.random()*wallpapers.length)];
	$("body").css({
		"background": "url("+wallpaper.url+")",
		"background-size": "cover"
	});
	setColor(wallpaper,function(color){
		color = alpha(color,.8);
		$(".taskbar-container").css("background",color2rgba(color));
		$(".start-menu").css("background",color2rgba(lighten(color,10)));
		$(".cortana-menu-left").css("background",color2rgba(lighten(color,10)));
		$(".notification-container").find("[class$=-panel]").css("background",color2rgba(lighten(color,10)));
		$(".notify-panel-bottom .button.active").css("background",color2rgba(darken(color,10)));
		$(".battery-panel-setting a,.wifi-panel-setting a").css("color",color2rgba(lighten(color,40)));
	});
}
changeTheme();

// start cortana
$(function(){

	var $icons = $(".taskbar-container").find(".start-icon,.cortana");
	var $cortana = $icons.filter(".cortana");
	var $menus = $(".taskbar-container").find("[class$=-menu]");

	var closeAll = function(){
		$icons.data("on",false);
		$menus.hide();
		$cortana.removeClass("active");
	}
	closeAll();

	$icons.on("click",function(){
		if ($menus.is("animated")) return;
		if ($(this).data("on")) {
			$(this).data("on",false).next().slideUp(100);
			$cortana.removeClass("active");
			return;
		} else {
			closeAll();
			$(this).data("on",true).next().slideDown(100);
			$cortana.addClass("active");
		}
	})
})
// battery wifi volume notify
$(function(){

	var $icons = $(".notification-container").find("[class*=-icon]");
	var $panels = $(".notification-container").find("[class$=-panel]");

	var closeAll = function(){
		$icons.data("on",false);
		$panels.not(".notify-panel").hide();
		$panels.filter(".notify-panel").css("margin-right","-360px");
	}
	closeAll();

	$icons.not(".notify-icon").on("click",function(){
		if ($panels.is("animated")) return;
		if ($(this).data("on")) {
			$(this).data("on",false).parent().next().slideUp(100);
			return;
		} else {
			closeAll();
			$(this).data("on",true).parent().next().slideDown(100);
		}
	})
	$icons.filter(".notify-icon").on("click",function(){
		if ($panels.is("animated")) return;
		if ($(this).data("on")) {
			$(this).data("on",false).parent().next().animate({
				"margin-right": "-360px"
			},100,"swing");
			return;
		} else {
			closeAll();
			$(this).data("on",true).parent().next().show().animate({
				"margin-right": 0
			},100,"swing");
		}
	})
	$(".notify-panel").find(".toggle").on("click",function(){
		if ($(this).text().indexOf("折叠") !== -1) {
			$(this).html("展开 <i class='fa fa-angle-up fa-lg'></i>").parent().animate({
				height: "100px"
			},100)
			if (localStorage) {
				localStorage.toggle = "open";
			}
		} else {
			$(this).html("折叠 <i class='fa fa-angle-down fa-lg'></i>").parent().animate({
				height: "240px"
			},100)
			if (localStorage) {
				localStorage.toggle = "close";
			}
		}
	})

	if (localStorage) {
		if (localStorage.toggle === "open") {
			$(".notify-panel").find(".toggle").html("展开 <i class='fa fa-angle-up fa-lg'></i>")
			.parent().css("height","100px");
		} else {
			$(".notify-panel").find(".toggle").html("折叠 <i class='fa fa-angle-down fa-lg'></i>")
			.parent().css("height","240px");
		}
	}
})


// time
$(function(){
	var prefix = function(t){
		return t < 10 ? "0"+t : t.toString();
	}
	var now = new Date(),
		hour = prefix(now.getHours()),
		minute = prefix(now.getMinutes()),
		year = now.getFullYear(),
		month = now.getMonth()+1,
		day = now.getDate(),
		timer;
	$(".time-clock").text(hour+":"+minute)
	$(".time-date").text(year+"/"+month+"/"+day)
	$(document).hover(function(){
		clearInterval(timer);
		timer = setInterval(function(){
			$(".time-clock").text(hour+":"+minute);
			$(".time-date").text(year+"/"+month+"/"+day);
		},1000);
	},function(){
		clearInterval(timer);
	})
})
