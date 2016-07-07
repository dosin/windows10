
(function(window){

	var urls = [
		"images/wallpapers/BathurstBay_ZH-CN15704350271_1920x1080.jpg",
		"images/wallpapers/DiaDosNamorados_ZH-CN10966266512_1920x1080.jpg",
		"images/wallpapers/KientzheimVineyards_ZH-CN9908740039_1920x1080.jpg",
		"images/wallpapers/MarrakeshMarket_EN-US10582051456_1920x1080.jpg",
		"images/wallpapers/QuaiBranlyMuseum_ZH-CN10941225231_1920x1080.jpg",
		"images/wallpapers/ReichstagDome_ZH-CN9358724121_1920x1080.jpg",
		"images/wallpapers/SchonbrunnPalace_ZH-CN11907034371_1920x1080.jpg",
		"images/wallpapers/TerracesSunrise_ZH-CN11993554223_1920x1080.jpg",
	]

	function getRandomUrl(){
		return urls[Math.floor(Math.random()*urls.length)];
	}

	function copyArray(arr){
		var temp = [];
		for (var i = 0; i < arr.length; i++) {
			temp[i] = Number(arr[i]);
		}
		return temp;
	}

	function darken(color,percent){
		var temp = copyArray(color);
		for (var i = 0; i < temp.length; i++) {
			if (i === 3) break;
			temp[i] = parseInt(temp[i]*(1+Math.abs(percent)/100));
		}
		return temp;
	}

	function lighten(color,percent){
		var temp = copyArray(color);
		for (var i = 0; i < temp.length; i++) {
			if (i === 3) break;
			temp[i] = parseInt(temp[i]*(1-Math.abs(percent)/100));
		}
		return temp;
	}

	function changeAlpha(color,alpha) {
		color[3] = alpha;
	}

	function color2rgba(color){
		return "rgba("+color.join(", ")+")";
	}

	// 图片完全加载完毕后才能取出color值，所以在此函数的回调函数中改变主题
	function setColor(url,fn){
		var n = 5, // 在400,400位置取nxn像素的点，取平均值
			canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d"),
			image = new Image;
		image.src = url;
		image.onload = function(){
			canvas.width = image.width;
			canvas.height = image.height;
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
			// 把a通道0-255换算成0-1
			color[3] = parseInt(color[3]/255*10)/10;
			// 如果颜色浅，加深
			if (color[0]+color[1]+color[2] > 450) {
				color[0] /= 2;
				color[1] /= 2;
				color[2] /= 2;
			}
			if (fn) {
				fn(color);
			}
		}
	}

	var changeTheme = function(){
		var url = getRandomUrl();
		setColor(url,function(color){
			changeAlpha(color,0.9);
			var lightColor = color2rgba(lighten(color,10));
			var darkColor = color2rgba(lighten(color,80));
			$("body").css({
				"background": "url("+url+")",
				"background-size": "cover"
			});
			$(".taskbar-container").css("background",color2rgba(color));
			$(".start-menu,.cortana-menu-left,.notify-panel-bottom .button.active").css("background",lightColor);
			$(".notification-container").find("[class$=-panel]").css("background",lightColor);
			$(".notification-container").find("[class$=-panel-setting] a").css("color",darkColor);
		});
	}

	window.changeTheme = changeTheme;

})(window);
