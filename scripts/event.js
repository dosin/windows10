
$(function(){
	changeTheme();
})

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
