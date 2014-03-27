var scanditsdk = require("com.mirasense.scanditsdk");
var picker = scanditsdk.createView({
	'width' : Ti.Platform.displayCaps.platformWidth,
	'height' : Ti.Platform.displayCaps.platformHeight
});

exports.scan_obj = picker;

//
// GENERIC ALERT
//
var a = Ti.UI.createAlertDialog({
	'title' : 'スキャン結果'
});

exports.scaned_dialog = a;

exports.init = function(clientId, cameraId) {

	picker.init(clientId, cameraId);

	picker.setSuccessCallback(successCallback);
	picker.setCancelCallback(cancelCallback);
	picker.showToolBar(true);
	picker.setQrEnabled(true);
};

exports.scan = function() {
	picker.startScanning();
};

function successCallback(e) {
	//alert("success (" + e.symbology + "): " + e.barcode);
	a.message = e.barcode;
	a.buttonNames = ['OK', '再試行'];
	a.cancel = 1;
	a.show();
}

function cancelCallback(e) {
	alert("canceled");
}
