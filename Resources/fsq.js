var FOURSQModule = {};

var clib = require('common');
clib.initCoords();

exports.init = function(clientId, redirectUri) {
	FOURSQModule.clientId = clientId;
	FOURSQModule.redirectUri = redirectUri;
	FOURSQModule.ACCESS_TOKEN = null;
	FOURSQModule.xhr = null;
	FOURSQModule.API_URL = "https://api.foursquare.com/v2/";
};

exports.logout = function() {
	showAuthorizeUI(String.format('https://foursquare.com/oauth2/authorize?response_type=token&client_id=%s&redirect_uri=%s', FOURSQModule.clientId, FOURSQModule.redirectUri));
	return;
};

/**
 * displays the familiar web login dialog we all know and love
 *
 * @params authSuccess_callback method called when successful
 *
 */
exports.login = function(authSuccess_callback) {
	if (authSuccess_callback != undefined) {
		FOURSQModule.success_callback = authSuccess_callback;
	}
	showAuthorizeUI(String.format('https://foursquare.com/oauth2/authenticate?response_type=token&client_id=%s&redirect_uri=%s', FOURSQModule.clientId, FOURSQModule.redirectUri));
	return;
};

exports.callMethod = function(method, success, error) {
	// get the login information and let it roll!!
	try {

		if (FOURSQModule.xhr == null) {
			FOURSQModule.xhr = Ti.Network.createHTTPClient();
		}

		FOURSQModule.xhr.open("GET", FOURSQModule.API_URL + method + "?oauth_token=" + FOURSQModule.ACCESS_TOKEN);

		FOURSQModule.xhr.onerror = function(e) {
			Ti.API.error("FOURSQModule ERROR " + e.error);
			Ti.API.error("FOURSQModule ERROR " + FOURSQModule.xhr.location);
			if (error) {
				error(e);
			}
		};

		FOURSQModule.xhr.onload = function(_xhr) {
			Ti.API.debug("FOURSQModule response: " + FOURSQModule.xhr.responseText);
			if (success) {
				success(FOURSQModule.xhr);
			}
		};

		FOURSQModule.xhr.send();
	} catch(err) {
		Ti.UI.createAlertDialog({
			title : "Error",
			message : String(err),
			buttonNames : ['OK']
		}).show();
	}
};

var toast = Ti.UI.createNotification({
	message : 'Loading...',
	opacity : 0.85,
    duration: Ti.UI.NOTIFICATION_DURATION_LONG
});

/**
 * code to display the familiar web login dialog we all know and love
 */
function showAuthorizeUI(pUrl) {
	window = Ti.UI.createWindow({
		modal : true,
		fullscreen : false,
		width : '100%',
		navBarHidden : true
	});
	var transform = Ti.UI.create2DMatrix().scale(0);
	view = Ti.UI.createView({
		top : ((Ti.Platform.displayCaps.platformHeight -
				(Ti.Platform.displayCaps.platformHeight * 9 / 10)
				) / 2),
		width : '90%',
		height : '90%',
		backgroundColor : 'white',
		borderColor: '#aaa',
		borderRadius: 15,
		borderWidth: 1,
		zIndex: -1,
		transform : transform
	});
	window.open();

	webView = Ti.UI.createWebView({
		top : 0,
		height : '100%',
		width : '100%',
		url : pUrl,
		//backgroundColor : 'black',
		//autoDetect : [Ti.UI.AUTODETECT_NONE]
	});
	Ti.API.debug('Setting:[' + Ti.UI.AUTODETECT_NONE + ']');

	webView.addEventListener('beforeload', function(e) {
		toast.show();

		if (e.url.indexOf('http://www.foursquare.com/') != -1) {
			Ti.API.debug(e);
			authorizeUICallback(e);
			webView.stopLoading = true;
		}
	});

	webView.addEventListener('load', authorizeUICallback);
	view.add(webView);
	window.add(view);

	var animation = Ti.UI.createAnimation();
	animation.transform = Ti.UI.create2DMatrix();
	animation.duration = 500;
	view.animate(animation);
}

/**
 * unloads the UI used to have the user authorize the application
 */
function destroyAuthorizeUI() {
	Ti.API.debug('destroyAuthorizeUI');
	// if the window doesn't exist, exit
	if (window == null) {
		Ti.API.debug('destroyAuthorizeUI:webView is NULL');
		return;
	}

	// remove the UI
	try {
		Ti.API.debug('destroyAuthorizeUI:webView.removeEventListener');
		webView.removeEventListener('load', authorizeUICallback);
		Ti.API.debug('destroyAuthorizeUI:window.close()');
		window.close();
	} catch(ex) {
		Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
	}
}

/**
 * fires event when login fails
 * <code>app:4square_access_denied</code>
 *
 * fires event when login successful
 * <code>app:4square_token</code>
 *
 * executes callback if specified when creating object
 */
function authorizeUICallback(e) {
	toast.hide();

	Ti.API.debug('authorizeUILoaded ' + e.url);
	Ti.API.debug(e);

	if (e.url.indexOf('#access_token') != -1) {
		var token = e.url.split("=")[1];
		FOURSQModule.ACCESS_TOKEN = token;
		Ti.App.fireEvent('app:4square_token', {
			'data' : token
		});

		if (FOURSQModule.success_callback != undefined) {
			FOURSQModule.success_callback({
				'access_token' : token,
			});
		}
		destroyAuthorizeUI();

	} else if ('http://foursquare.com/' == e.url) {
		Ti.App.fireEvent('app:4square_logout', {});
		destroyAuthorizeUI();
	} else if (e.url.indexOf('#error=access_denied') != -1) {
		Ti.App.fireEvent('app:4square_access_denied', {});
		destroyAuthorizeUI();
	}
}

// チェックインをする関数
// callback : コールバック関数
// venue : {venueId : 'べニューID', venueName : 'べニューの名前'}
exports.checkIn = function(callback, venue) {
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		if (callback) {
			callback(resp.response.checkin.id);
		}
	};

	xhr.open('POST', 'https://api.foursquare.com/v2/checkins/add');
	xhr.send({
		'venueId' : venue.venueId,
		'shout' : venue.venueName + ' of the Dead!',
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// 自分の友達を取得する関数
// callback : コールバック関数
exports.getFriendList = function(callback) {

	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		var data = [];

		// 返すデータを作る
		for (var i = 0; i < resp.response.friends.count; i++) {
			var offset = resp.response.friends.items[i];
			var obj = {
				'id' : offset.id,
				'name' : offset.firstName + ' ' + offset.lastName,
				'photo' : offset.photo
			}
			data.push(obj);
		}
		callback(data);
	};

	xhr.open('GET', 'https://api.foursquare.com/v2/users/self/friends');
	xhr.send({
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// 自分の情報を取得する関数
// callback : コールバック関数
exports.getMyProfile = function(callback) {

	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		var param = {
			'id' : resp.response.user.id,
			'name' : resp.response.user.firstName,
			'photo' : resp.response.user.photo
		};
		if(resp.response.user.lastName != undefined){
			param.name = param.name + ' ' + resp.response.user.lastName;
		}
		callback(param);
	};

	xhr.open('GET', 'https://api.foursquare.com/v2/users/self');
	xhr.send({
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// ユーザの情報を取得する関数
// callback : コールバック関数
exports.getUserProfile = function(userId, callback) {

	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		var param = {
			'id' : resp.response.user.id,
			'name' : resp.response.user.firstName,
			'photo' : resp.response.user.photo
		};
		if(resp.response.user.lastName != undefined){
			param.name = param.name + ' ' + resp.response.user.lastName;
		}
		//alert(resp.response.user.firstName + ' ' + resp.response.user.lastName);
		callback(param);
	};

	xhr.open('GET', 'https://api.foursquare.com/v2/users/' + userId);
	xhr.send({
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// 友達が最近チェックインした場所を取得する関数
// callback : コールバック関数
exports.getCheckinRecent = function(callback) {

	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		var entries = [];
		var recentLength = clib.jsonLength(resp.response.recent);

		// 返すデータを作る
		for (var i = 0; i < recentLength; i++) {

			var entry = resp.response.recent[i];
			var name = entry.user.firstName;
			if(entry.user.lastName != undefined){
				name = name + ' ' + entry.user.lastName;
			}
			var entry_data = {
				'checkinId' : entry.id,
				'createdAt' : entry.createdAt,
				'user' : {
					'id' : entry.user.id,
					'name' : name,
					'photo' : entry.user.photo
				},
				'venue' : {
					'id' : entry.venue.id,
					'name' : entry.venue.name,
					'address' : entry.venue.location.state + 
								entry.venue.location.city + 
								' ' + 
								entry.venue.location.address,
					'icon' : entry.venue.categories[0].icon
				},
				'source' :{
					'name' : entry.source.name,
					'url' : entry.source.url
				}
			};
			//alert(entry_data.venue);
			entries.push(entry_data);
		}
		callback(entries);
	}
	xhr.open('GET', 'https://api.foursquare.com/v2/checkins/recent');
	xhr.send({
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// 現在地を取得して配列で返す関数
// callback : コールバック関数
exports.getMyPlace = function(callback) {
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		//alert(clib.currPos.latitude + ',' + clib.currPos.longitude);
		var venuesLength = clib.jsonLength(resp.response.venues);
		//alert(venuesLength);
		var data_array = [];

		for (var i = 0; i < venuesLength; i++) {
			data_array.push({
				id : resp.response.venues[i].id,
				name : resp.response.venues[i].name,
				icon : resp.response.venues[i].categories[0].icon
			});
		}
		callback(data_array);
	};

	xhr.open('GET', 'https://api.foursquare.com/v2/venues/search');
	xhr.send({
		'll' : clib.currPos.latitude + ',' + clib.currPos.longitude,
		'intent' : 'browse',
		'radius' : '1000',
		'limit' : 30,
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// 現在地を取得して配列で返す関数
// callback : コールバック
exports.getMyPlaceExplore = function(callback) {
	var xhr = Ti.Network.createHTTPClient();

	xhr.onerror = function(e) {
		Ti.API.info("ERROR " + e.error);
		alert(e.error);
	};
	xhr.onload = function() {
		var resp = JSON.parse(this.responseText);
		//alert(clib.currPos.latitude + ',' + clib.currPos.longitude);
		var numResults = resp.numResults;
		var data_array = [];

		for (var i = 0; i < numResults; i++) {
			data_array.push({
				id : resp.response.groups[0].items[i].venue.id,
				name : resp.response.groups[0].items[i].venue.name,
				icon : resp.response.groups[0].items[i].venue.categories[0].icon,
				lat : resp.response.groups[0].items[i].venue.location.lat,
				lng : resp.response.groups[0].items[i].venue.location.lng
			});
		}
		callback(data_array);
	};

	xhr.open('GET', 'https://api.foursquare.com/v2/venues/explore');
	xhr.send({
		'll' : clib.currPos.latitude + ',' + clib.currPos.longitude,
		'radius' : '1000',
		'limit' : 30,
		'oauth_token' : FOURSQModule.ACCESS_TOKEN
	});
};

// 画像をアップロードする関数
// checkinId : チェックインID
exports.uploadImg = function(checkinId) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'nishiyama_ramen.jpg');

	var xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(20000);
	xhr.open('POST', 'https://api.foursquare.com/v2/photos/add');
	xhr.setRequestHeader("enctype", "multipart/form-data");
	xhr.send({
		'checkinId' : checkinId,
		'oauth_token' : FOURSQModule.ACCESS_TOKEN,
		'photo' : file.read() // f is a photo file
	});
};
