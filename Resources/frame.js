/*
 * ボタン、タイトルバーを定義しているファイル。定義のみ。ロジックはapp.jsへ
 */

var createBaseFrame = function() {

	// this sets the background color of the master UIView (when there are no windows/tab groups on it)
	Ti.UI.setBackgroundColor('#000');

	var FSQModule = require('fsq');
	var TkoalModule = require('tkoal');

	var redirect_uri = 'http://tkoal.dip.jp/qr';
	var client_id = 'MVKZ3Z32JUSWUGPDR1OP0HRPXAA2CDQQCE45U5UOY1RN3RKS';

	/* Frousuareの初期化 */

	FSQModule.init(client_id, redirect_uri);

	FSQModule.login(loginSuccess, function(e) {
		Ti.UI.createAlertDialog({
			title : "LOGIN FAILED",
			message : e,
			buttonNames : ['OK']
		}).show();
	});

	function loginSuccess(e) {
		FSQModule.callMethod("users/self", onSuccess_self, function(e) {
			Ti.UI.createAlertDialog({
				title : "users/self: METHOD FAILED FAILED",
				message : e,
				buttonNames : ['OK']
			}).show();
		});
	};

	function onSuccess_self(xhr) {
		Ti.App.fireEvent("4sqr_login_success", {});
		Ti.API.info(" checkins response-> " + xhr.responseText);
		var respJSON = JSON.parse(xhr.responseText);
		Ti.API.info(" Name      -> " + respJSON.response.user.firstName + " " + respJSON.response.user.lastName);
		Ti.API.info(" Email     -> " + respJSON.response.user.contact.email);
		Ti.API.info(" Badges    -> " + respJSON.response.user.badges.count);
		Ti.API.info(" Checkins  -> " + respJSON.response.user.checkins.count);
	};

	/* QRコードモジュールの初期化 */
	var QRModule = require('qr');

	// ウィンドウの定義
	var win = Ti.UI.createWindow({
		'backgroundColor' : '#fff'
	});

	// コンテンツ表示部の定義
	var contents_container = Ti.UI.createView({
		'top' : Ti.Platform.displayCaps.platformHeight / 12,
		'backgroundColor' : '#e8e3e1',
		'width' : Ti.Platform.displayCaps.platformWidth,
		'height' : Ti.Platform.displayCaps.platformHeight - (Ti.Platform.displayCaps.platformHeight / 12),
	});

	win.add(contents_container);

	/* タイトル表示部の定義 */

	var header_view = Ti.UI.createImageView({
		'image' : 'images/top_banner.png',
		'top' : 0,
		'width' : Ti.Platform.displayCaps.platformWidth,
		'height' : Ti.Platform.displayCaps.platformHeight / 12,
	});

	win.add(header_view);

	/*
	 * 各ボタンの定義
	 * ボタンとは言いつつもButton.backgroundImageが効かなかったのでImageViewで代用
	 */
	var buttonMyPage = Ti.UI.createImageView({
		'image' : 'images/icon_home.png',
		'height' : Ti.Platform.displayCaps.platformHeight / 12,
		'width' : Ti.Platform.displayCaps.platformHeight / 12,
		'top' : 0,
		'right' : Ti.Platform.displayCaps.platformHeight / 12,
		'backgroundColor' : 'black',
		'opacity' : 0.85
	});

	win.add(buttonMyPage);

	var buttonQrScan = Ti.UI.createImageView({
		'image' : 'images/icon_camera.png',
		'height' : Ti.Platform.displayCaps.platformHeight / 12,
		'width' : Ti.Platform.displayCaps.platformHeight / 12,
		'top' : 0,
		'right' : 0,
		'backgroundColor' : 'black',
		'opacity' : 0.85
	});

	win.add(buttonQrScan);

	return {
		'win' : win,
		'buttonMyPage' : buttonMyPage,
		'buttonQrScan' : buttonQrScan,
		'contents' : contents_container,
		'FSQModule' : FSQModule,
		'QRModule' : QRModule,
		'TkoalModule' : TkoalModule
	};
}

module.exports = createBaseFrame;
