

exports.createUserSummary = function(data) {
	// トカゲの王サーバからJSONをもらう
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};

	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		exports.userSummary = {
			userId : data.id,
			checkinCount : resp.count
		};
	};

	xhr.setTimeout(20000);
	xhr.open('GET', "http://tkoal.dip.jp/qr/searchHistoryByUserId");
	xhr.send({
		'user_id' : data.id
	});
};

// 4sqのユーザIDをキーにトカゲの王サーバからアプリ内のチェックインデータを取得する関数
exports.getCheckinHistoryByUserId = function(userId, callback) {
	// トカゲの王サーバからJSONをもらう
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};

	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		//alert(resp);
		callback(resp);
	};

	xhr.setTimeout(20000);
	xhr.open('GET', "http://tkoal.dip.jp/qr/searchHistoryByUserId");
	xhr.send({
		'user_id' : userId
	});
};

// 4sqのユーザIDの配列を受け取りトカゲの王サーバから
exports.getCheckinHistoryByIdArray = function(userIds, callback) {
	// トカゲの王サーバからJSONをもらう
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};

	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		//alert(resp);
		callback(resp);
	};

	xhr.setTimeout(20000);
	xhr.open('GET', "http://tkoal.dip.jp/qr/searchHistoryByUserIds");
	xhr.send({
		'user_ids' : JSON.stringify(userIds)
	});
};

exports.getCheckinHistoryByIdOne = function(checkinId, callback) {
	// トカゲの王サーバからJSONをもらう
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};

	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		//alert(resp);
		callback(resp);
	};

	xhr.setTimeout(20000);
	xhr.open('GET', "http://tkoal.dip.jp/qr/searchHistoryByCheckinId");
	xhr.send({
		'checkin_id' : checkinId
	});
};

