/* jsonデータの長さを計算する 関数 */
exports.jsonLength = function(data) {
	var i = 0;
	var key;
	for (key in data) {
		i++;
	}/* keyと言う文字は任意の変数名 */

	return i;
};

// UnixタイムをDateタイムに変換する関数
exports.unixtimeToDate = function(ut) {
	var tD = new Date(ut * 1000);
	tD.setTime(tD.getTime() + (60 * 60 * 1000 * 9));
	
	return tD;
};

// 現在のunixタイムを取得する関数
function time_t(){
    return Math.floor((new Date)/1000);
}

// unixタイムから現在時刻との差を返す
// 当日なら何時間前・何分前を返す
// 当日でないなら何日前かを返す
// UnixタイムをDateタイムに変換する関数
exports.relativeTimeFromUtime = function(ut) {
	var daySecond = 24 * 60 * 60;
	var hourSecond = 60 * 60;
	var sub = time_t() - ut;

	if(sub < daySecond){	// 今日
		if(sub < hourSecond){ //　１時間以内
			if(sub < 60){ // 1分以内
				return sub + '秒前';
			}
			else {
				return Math.floor(sub / 60) + '分前';
			}
		}
		else{
			return Math.floor(sub / hourSecond) + '時間前';
		}
	}
	else{　// 何日か前
		return Math.floor(sub / daySecond) + '日前';
	}
};

function getCurrentPositionCallback(e) {
	// エラー時はコールバック関数の引数のerrorプロパティがセットされる
	if (e.error) {
		Titanium.API.error(e.error);
		return;
	}
	// 一旦別の変数に渡してると呼び出し側でpropatyエラー
	exports.currPos = {
		latitude : e.coords.latitude,
		longitude : e.coords.longitude
	};
}

exports.initCoords = function() {
	Titanium.Geolocation.getCurrentPosition(getCurrentPositionCallback);
};

