/*
 * app.js
 * 主な画面パーツはframe.jsが作成する
 * ロジックを書き込むファイル
 */

var baseFrame = require('frame');
var fParts = new baseFrame();

fParts.win.open();

var clib = require('common');
clib.initCoords();

// コンテンツ表示部のviewの子要素をすべて削除する関数
function contentsCleaner() {
	var viewCount = fParts.contents.children.length;
	for ( i = 0; i < viewCount; i++) {
		fParts.contents.remove(fParts.contents.children[((viewCount - 1) - i)]);
	}
}

var map_container = Ti.UI.createWebView({
	'top' : 0,
	'url' : 'map.html',
	//borderColor : '#8a9799',
	'borderColor' : 'black',
	'borderWidth' : 1,
	'backgroundColor' : '#e8e3e1',
	'width' : Ti.Platform.displayCaps.platformWidth - 30,
	'height' : Ti.Platform.displayCaps.platformHeight / 3,
});

var obj = {
	'latitude' : clib.currPos.latitude,
	'longitude' : clib.currPos.longitude
};

map_container.addEventListener('load', function() {
	map_container.evalJS('initialize(' + JSON.stringify(obj) + ')');
});

Ti.App.addEventListener('4sqr_login_success', function() {
	fParts.FSQModule.getMyProfile(fParts.TkoalModule.createUserSummary);
	myPageHandler();
});

Ti.App.addEventListener('onWebView', function(e) {
	Ti.Platform.openURL(e.message);
});

var objModel = require('model');

// マイページボタンを押されたら呼ばれる処理
fParts.buttonMyPage.addEventListener('click', myPageHandler);

// 自分がチェックインした場所のアノテーションを作成する
function createAnnotationMyself(data) {
	// トカゲの王サーバからJSONをもらう
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};

	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);

		for (var i = 0; i < resp.count; i++) {
			//alert(resp.items[i]);
			date = new Date(resp.items[i].created_at);
			var placeMarker = {
				'latitude' : resp.items[i].latitude,
				'longitude' : resp.items[i].longitude,
				'icon' : 'images/pin_myself.png',
				'title' : resp.items[i].venue_name,
				'subtitle' : clib.relativeTimeFromUtime(Math.floor(date.getTime() / 1000)),
				'scaned_result' : resp.items[i].scaned_result
			}
			map_container.evalJS('setMarkerOne(' + JSON.stringify(placeMarker, i) + ')');
		}
	};

	xhr.setTimeout(20000);
	xhr.open('GET', "http://tkoal.dip.jp/qr/searchHistoryByUserId");
	xhr.send({
		'user_id' : data.id
	});
}

// 友達がチェックインした場所のアノテーションを作成する
// data:友達の名前、ID、アイコンのURLが格納された配列
function createAnnotationFriends(data) {
	var ids = [];
	// 友達のユーザIDが入った配列を作成する
	for (var i = 0; i < data.length; i++) {
		ids.push(data[i].id);
	}

	fParts.TkoalModule.getCheckinHistoryByIdArray(ids, function(historyData) {
		for (var j = 0; j < historyData.count; j++) {

			var placeMarker = {
				'latitude' : historyData.items[j].latitude,
				'longitude' : historyData.items[j].longitude,
				'icon' : 'images/pin_friend.png',
				'title' : historyData.items[j].venue_name,
				'subtitle' : 'THE DEAD BY ' + 
								data[ids.indexOf(historyData.items[j].user_id)].name,
				'scaned_result' : historyData.items[j].scaned_result
			}
			map_container.evalJS('setMarkerOne(' + JSON.stringify(placeMarker, j) + ')');
		}
	});
}

function myPageHandler() {
	contentsCleaner();
	fParts.contents.add(map_container);

	// 自分がチェックインした場所のアノテーションを作成
	fParts.FSQModule.getMyProfile(createAnnotationMyself);
	// 友達がチェックインした場所のアノテーションを作成
	fParts.FSQModule.getFriendList(createAnnotationFriends);

	//mapview.setTop(0);
	//mapview.setHeight(Ti.Platform.displayCaps.platformHeight / 3);
	//mapview.setWidth(Ti.Platform.displayCaps.platformWidth - 30);
	//map_container.add(mapview);

	// タイムラインを描画する処理
	function checkinRecentCallback(entries) {
		var rows = [];

		for (var i = 0; i < entries.length; i++) {

			var row = Ti.UI.createTableViewRow();
			row.selectedBackgroundColor = '#fff';
			row.height = 160;
			row.className = 'datarow';
			row.clickName = 'row';
			row.title = entries[i];

			/* 各オブジェクトを生成する */
			objModel.Timeline.photo.backgroundImage = entries[i].user.photo;
			var photo = Ti.UI.createLabel(objModel.Timeline.photo);

			objModel.Timeline.name.text = entries[i].user.name;
			var name = Ti.UI.createLabel(objModel.Timeline.name);

			objModel.Timeline.checkinPlace.text = entries[i].venue.name;
			var checkinPlace = Ti.UI.createLabel(objModel.Timeline.checkinPlace);

			var checkin_with = '';
			var checkin_icon = '';

			if (entries[i].source.name.indexOf('foursquare', 0) >= 0) {
				checkin_with = clib.relativeTimeFromUtime(entries[i].createdAt) + ' (foursquareから )';
				checkin_icon = 'images/onecolor.png';
			} else if (entries[i].source.name.indexOf('QR CODE OF THE DEAD', 0) >= 0) {
				checkin_with = clib.relativeTimeFromUtime(entries[i].createdAt) + ' (アプリから)';
				checkin_icon = 'images/onecolor_qr.png';
			}

			objModel.Timeline.pfIcon.backgroundImage = checkin_icon;
			var pfIcon = Ti.UI.createLabel(objModel.Timeline.pfIcon);

			objModel.Timeline.checkinTime.text = checkin_with;
			var checkinTime = Ti.UI.createLabel(objModel.Timeline.checkinTime);

			row.add(photo);
			row.filter = name.text;
			row.add(name);
			row.add(checkinPlace);
			row.add(pfIcon);
			row.add(checkinTime);

			rows.push(row);
		}
		objModel.View.table.timeline.data = rows;
		var tableView = Ti.UI.createTableView(objModel.View.table.timeline);

		// タイムラインの行をクリックした時の挙動
		tableView.addEventListener('click', function(e) {
			// recentメソッドの結果
			var data = e.rowData.title;
			//alert(data);

			/* 各オブジェクトを生成する */
			var darkWin = Ti.UI.createWindow(objModel.View.mdwin);

			objModel.View.container.detail.transform = Ti.UI.create2DMatrix().scale(0);
			var detail = Ti.UI.createView(objModel.View.container.detail);

			objModel.Detail.photo.backgroundImage = data.user.photo;
			var photo = Ti.UI.createLabel(objModel.Detail.photo);

			objModel.Detail.name.text = data.user.name;
			var name = Ti.UI.createLabel(objModel.Detail.name);

			var closeLabel = Ti.UI.createImageView(objModel.View.closeLabel);

			fParts.TkoalModule.getCheckinHistoryByUserId(data.user.id, function(resp) {
				// アプリからのチェックインした総数を表示する
				if (resp.count > 0) {
					objModel.Detail.checkinCount.text = '今までに' 
						+ fParts.TkoalModule.userSummary.checkinCount 
						+ '回のDEAD';
					var checkinCount = Ti.UI.createLabel(objModel.Detail.checkinCount);
					detail.add(checkinCount);
				} else {
					objModel.Detail.checkinCount.text = 'まだアプリからのチェックインがありません';
					var checkinCount = Ti.UI.createLabel(objModel.Detail.checkinCount);
					detail.add(checkinCount);
				}

			})
			// トカゲの王サーバに問い合わせる
			fParts.TkoalModule.getCheckinHistoryByIdOne(data.checkinId, function(resp) {

				if (resp.count > 0) {// アプリからのチェックインであれば詳細を表示する

					var detailBase = Ti.UI.createView(objModel.Detail.detailBase);

					if(data.user.id == fParts.TkoalModule.userSummary.userId){
						objModel.Detail.icon.backgroundImage = 'images/pin_myself.png';
					}
					else{
						objModel.Detail.icon.backgroundImage = 'images/pin_friend.png';
					}
					var detailVenueIcon = Ti.UI.createLabel(objModel.Detail.icon);

					objModel.Detail.address.text = data.venue.name + "\n" + data.venue.address;
					var detailAddress = Ti.UI.createLabel(objModel.Detail.address);

					objModel.Detail.qr_contents.text = resp.items[0].scaned_result
					var qrContents = Ti.UI.createLabel(objModel.Detail.qr_contents);

					// QRコードの中身をクリックしたらintentを開く
					qrContents.addEventListener('click', function() {
						Ti.Platform.openURL(resp.items[0].scaned_result);
					});

					detailBase.add(detailAddress);
					detailBase.add(detailVenueIcon);
					detailBase.add(qrContents);
					detail.add(detailBase);
				} else {
					var nomuraSan = Ti.UI.createLabel(objModel.Detail.nomuraSan);
					detail.add(nomuraSan);
				}
			});

			// タイムラインの詳細画面の閉じるボタンを押したときに呼ばれる処理
			closeLabel.addEventListener('click', function() {
				// remove the UI
				try {
					Ti.API.debug('destroyAuthorizeUI:window.close()');

					darkWin.close();
				} catch(ex) {
					Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
				}
			});

			var animation = Ti.UI.createAnimation();
			animation.transform = Ti.UI.create2DMatrix();
			animation.duration = 500;

			detail.animate(animation);
			detail.add(closeLabel);
			detail.add(photo);
			detail.add(name);
			darkWin.add(detail);
			darkWin.open();
		});
		fParts.contents.add(tableView);
	}


	fParts.FSQModule.getCheckinRecent(checkinRecentCallback);
}

// QRコードボタンをクリックしたときに呼ばれる処理
fParts.buttonQrScan.addEventListener('click', function() {
	contentsCleaner();

	fParts.contents.add(fParts.QRModule.scan_obj);
	fParts.QRModule.init("I/EIKEFeEeKG35rPMDH8zB7lpwT4NTfWEN5B6/W2LHg", 0);
	fParts.QRModule.scan();
});

var scaned_dialog = fParts.QRModule.scaned_dialog;

// QRコードを読み取った後のダイアログのボタンを押されたら呼ばれる処理
function getMyPlaceCallback(data) {

	var mdwin = Ti.UI.createWindow(objModel.View.mdwin);

	objModel.View.container.venueSelect.transform = Ti.UI.create2DMatrix().scale(0);
	var venueSelectTable = Ti.UI.createView(objModel.View.container.venueSelect);

	var rows = [];

	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createTableViewRow();
		row.selectedBackgroundColor = '#fff';
		row.height = 100;
		row.className = 'datarow';
		row.clickName = 'row';
		row.title = {
			'venueId' : data[i].id,
			'venueName' : data[i].name,
			'lat' : data[i].lat,
			'lng' : data[i].lng
		};

		objModel.VenueSelect.icon.backgroundImage = data[i].icon;
		var icon = Ti.UI.createLabel(objModel.VenueSelect.icon);

		objModel.VenueSelect.name.text = data[i].name;
		var name = Ti.UI.createLabel(objModel.VenueSelect.name);

		row.add(icon);
		row.add(name);
		row.filter = name.text;
		rows.push(row);
	}

	objModel.View.table.checkin.data = rows;
	var tableView = Ti.UI.createTableView(objModel.View.table.checkin);

	// 近くの場所一覧の行をクリックした時の挙動
	tableView.addEventListener('click', function(e) {
		var venue = e.rowData.title;
		//alert(venue);
		var queryData = {
			'checkinId' : 0,
			'userId' : 0,
			'name' : '',
			'lat' : 0,
			'lng' : 0,
			'scanResult' : scaned_dialog.message
		};
		// 4SQでチェックイン
		fParts.FSQModule.checkIn(function(checkinId) {
			queryData.checkinId = checkinId;
			queryData.lat = venue.lat;
			queryData.lng = venue.lng;
			queryData.name = venue.venueName;

			fParts.FSQModule.getMyProfile(function(data) {
				queryData.userId = data.id;

				// トカゲの王サーバにJSONを送る
				var xhr = Ti.Network.createHTTPClient();
				xhr.onerror = function(e) {
					Ti.API.info("ERROR " + e.error);
					alert(e.error);
				};

				xhr.onload = function() {

					var info = Ti.UI.createAlertDialog({
						'title' : 'info',
						'message' : 'チェックインしました',
						//message : queryData,
						buttonNames : ['OK']
					});

					info.show();

					// チェックインしました。が出たら呼ばれる処理
					info.addEventListener('click', function(e) {
						if (e.index == 0) {// DEAD!
							// チェックインとサーバにJSONを送信し終わったらモーダルウィンドウを閉じる
							if (mdwin == null) {
								Ti.API.debug('destroyAuthorizeUI:webView is NULL');
								return;
							}
							// remove the UI
							try {
								Ti.API.debug('destroyAuthorizeUI:window.close()');
								mdwin.close();
							} catch(ex) {
								Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
							}
						}
					});
				};

				xhr.setTimeout(20000);
				xhr.open('POST', "http://tkoal.dip.jp/qr/test");
				//xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
				xhr.send({
					'checkin_id' : queryData.checkinId,
					'user_id' : queryData.userId,
					'latitude' : queryData.lat,
					'longitude' : queryData.lng,
					'venue_name' : queryData.name,
					'scaned_result' : queryData.scanResult
				});
			});

		}, venue);
	});
	// end of tableView.addEventListener()

	var closeLabel = Ti.UI.createImageView(objModel.View.closeLabel);

	// 近い場所一覧の画面の閉じるボタンを押されたときに呼ばれる処理
	closeLabel.addEventListener('click', function() {
		if (mdwin == null) {
			Ti.API.debug('destroyAuthorizeUI:webView is NULL');
			return;
		}

		// remove the UI
		try {
			Ti.API.debug('destroyAuthorizeUI:window.close()');
			mdwin.close();
		} catch(ex) {
			Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
		}
	});

	var animation = Ti.UI.createAnimation();
	animation.transform = Ti.UI.create2DMatrix();
	animation.duration = 500;
	venueSelectTable.animate(animation);

	venueSelectTable.add(closeLabel);
	venueSelectTable.add(tableView);
	mdwin.add(venueSelectTable);
	mdwin.open();
}

// alert Dialogのボタンが押された時の処理
scaned_dialog.addEventListener('click', function(e) {
	if (e.index == 0) {// DEAD!
		//fParts.FSQModule.getMyPlace(getMyPlaceCallback)；
		fParts.FSQModule.getMyPlaceExplore(getMyPlaceCallback);
	} else {// canceled
		//l.text = 'You clicked ' + e.index;
	}
});

