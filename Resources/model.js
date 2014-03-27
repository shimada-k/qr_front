// タイムライン用のオブジェクトセッティング配列
var Timeline = {
	'photo' : {
		'backgroundImage' : '',
		'top' : 10,
		'left' : 20,
		'width' : 130,
		'height' : 130,
		'borderRadius' : 10,
		'clickName' : 'photo'
	},
	'name' : {
		'color' : 'black',
		'font' : {
			'fontSize' : 32,
			'fontWeight' : 'bold',
			'fontFamily' : 'Arial'
		},
		'left' : 200,
		'top' : 10,
		'height' : 45,
		'width' : 300,
		'clickName' : 'user',
		'text' : ''
	},
	'checkinPlace' : {
		'color' : 'black',
		'font' : {
			'fontSize' : 30,
			'fontFamily' : 'Arial'
		},
		'left' : 200,
		'top' : 60,
		'height' : 40,
		'width' : 400,
		'clickName' : 'user',
		'text' : ''
	},
	'pfIcon' : {
		'backgroundImage' : '',
		'top' : 100,
		'left' : 200,
		'width' : 35,
		'height' : 35,
		'clickName' : 'photo'
	},
	'checkinTime' : {
		'color' : 'black',
		'font' : {
			'fontSize' : 25,
			'fontFamily' : 'Arial'
		},
		'left' : 240,
		'top' : 100,
		'height' : 35,
		'width' : 600,
		'clickName' : 'user',
		'text' : ''
	}
};

// venue選択画面用のオブジェクトセッティング配列
var VenueSelect = {
	'icon' : {
		'backgroundImage' : '',
		'top' : 10,
		'left' : 20,
		'width' : 80,
		'height' : 80,
		'clickName' : 'photo'
	},

	'name' : {
		'color' : '#576996',
		'font' : {
			'fontSize' : 25,
			'fontWeight' : 'bold',
			'fontFamily' : 'Arial'
		},
		'left' : 120,
		'top' : 40,
		'height' : 30,
		'width' : 400,
		'clickName' : 'user',
		'text' : ''
	}
};

// 詳細画面用のオブジェクトセッティング配列
var Detail = {
	'photo' : {
		'borderColor' : 'black',
		'borderWidth' : 1,
		'backgroundImage' : '',
		'top' : 20,
		'left' : 20,
		'width' : 160,
		'height' : 160,
		'borderRadius' : 10,
		'clickName' : 'photo'
	},

	'checkinCount' : {
		'color' : 'black',
		'backgroundColor' : '#e8e3e1',
		'font' : {
			'fontSize' : 28,
			'fontFamily' : 'Arial'
		},
		'left' : 200,
		'top' : 80,
		'height' : 35,
		'width' : '60%',
		'clickName' : 'user',
		'text' : ''
	},

	'detailBase' : {
		'borderColor' : 'black',
		'borderWidth' : 1,
		'backgroundColor' : 'white',
		'bottom' : 30,
		'width' : '92%',
		'height' : '50%',
	},

	'icon' : {
		'backgroundImage' : '',
		'top' : 10,
		'left' : 20,
		'width' : 80,
		'height' : 127,
		'clickName' : 'photo'
	},

	'nomuraSan' : {
		'bottom' : 100,
		'left' : 20,
		'color' : '#707070',
		'font' : {
			'fontStyle' : 'bold',
			'fontSize' : 30,
			'fontFamily' : 'Arial'
		},
		'width' : '90%',
		'height' : '40%',
		'text' : 'foursquareからのチェックインです'
	},

	'qr_contents' : {
		//'borderColor' : 'black',
		//'borderWidth' : 1,
		'color' : '#576996',
		'font' : {
			'fontSize' : 30,
			'fontWeight' : 'bold',
			'fontFamily' : 'Arial'
		},
		'left' : 140,
		'top' : 10,
		'height' : '50%',
		'width' : '70%',
		'clickName' : 'user',
		'text' : ''
	},

	'address' : {
		//'borderColor' : 'black',
		//'borderWidth' : 1,
		'color' : 'black',
		'font' : {
			'fontSize' : 25,
			'fontFamily' : 'Arial'
		},
		'left' : 10,
		'top' : 130,
		'height' : '40%',
		'width' : '100%',
		'clickName' : 'user',
		'text' : ''
	},

	'name' : {
		'color' : 'black',
		'font' : {
			'fontSize' : 35,
			'fontWeight' : 'bold',
			'fontFamily' : 'Arial'
		},
		'left' : 200,
		'top' : 20,
		'height' : 45,
		'width' : 300,
		'clickName' : 'user',
		'text' : ''
	},
};

var Annotation = {
	'friends' : {
		'image' : 'images/pin_friend.png',
		'latitude' : null,
		'longitude' : null,
		'title' : '',
		'subtitle' : '',
		'pincolor' : Ti.Map.ANNOTATION_RED,
		'animate' : true,
		'myid' : 1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
	}
};

var View = {
	'mdwin' : {
		//'modal' : true,
		'fullscreen' : false,
		'width' : '100%',
		'height' : '100%',
		'backgroundColor' : 'black',
		'opacity' : 0.7,
		'navBarHidden' : true
	},
	'closeLabel' : {
		'image' : 'images/close_button.png',
		'top' : 8,
		'right' : 10,
		'height' : 50
	},
	'table' : {
		'timeline' : {
			'borderColor' : '#8a9799',
			'borderWidth' : 1,
			'backgroundColor' : 'white',
			'width' : Ti.Platform.displayCaps.platformWidth - 30,
			'top' : Ti.Platform.displayCaps.platformHeight / 3,
			'data' : null,
			'filterAttribute' : 'filter'
		},
		'checkin' : {
			'top' : 100,
			'data' : null,
			'filterAttribute' : 'filter',
			'backgroundColor' : 'white'
		}
	},
	'container' : {
		'detail' : {
			'top' : (Ti.Platform.displayCaps.platformHeight - ((Ti.Platform.displayCaps.platformHeight * 6) / 10)) / 2,
			'borderRadius' : 5,
			'border' : 10,
			'borderColor' : '#aaa',
			'borderWidth' : 5,
			'backgroundColor' : '#e8e3e1',
			'width' : '80%',
			'height' : '40%',
			//'opacity' : 1.0,
			//'zindex' : -1,
			'transform' : null
		},

		'venueSelect' : {
			'top' : 100,
			'borderRadius' : 10,
			'border' : 10,
			'borderColor' : '#aaa',
			'borderWidth' : 5,
			'backgroundColor' : 'white',
			'width' : '90%',
			'height' : '90%',
			'zindex' : -1,
			'transform' : null
		}
	}
};

exports.Timeline = Timeline;
exports.VenueSelect = VenueSelect;
exports.Detail = Detail;
exports.View = View;
exports.Annotation = Annotation;
