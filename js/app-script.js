var mapCenter
var polygonThere = false;
var mapPolygon;
var oneOverlay;
var overlayExist = 0;

var markerGroup = [];

var config = {
	'apiKey': "AIzaSyCK1lD1GXri_mI-1KeNk2-1cMcxZxKTKkU",
  	'authDomain': "tweetsweep-d70a2.firebaseapp.com",
	'databaseURL': 'https://tweetsweep-d70a2.firebaseio.com',
	'storageBucket': "tweetsweep-d70a2.appspot.com",
};

firebase.initializeApp(config);

var database = firebase.database().ref();

var map = new GMaps({
	el: '#map',
	lat: 40.71,
	lng: -74.0059
});

function checkLocation() {
	GMaps.geolocate({
		success: function(position) {

			mapCenter = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}

	    	map.setCenter(mapCenter);
			checkDatabase();
		},
	  	error: function(error) {
			mapCenter = {
				lat: -12,
				lng: -77
			}

	    	map.setCenter(mapCenter);
		},
	  	not_supported: function() {
			mapCenter = {
				lat: -12,
				lng: -77
			}

	    	map.setCenter(mapCenter);
		}
	});
};

function checkDatabase() {
	database.on('value', function(snapshot) {
		var dataSnap = snapshot.val();

		console.log(dataSnap);

		if (overlayExist == 1){

			markerGroup.splice(0,markerGroup.length);
			console.log(markerGroup.length)
		}

		for (var property in dataSnap) {
			if (dataSnap[property].coordinates != undefined) {
				var twt = "https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F" + dataSnap[property].link.substring(20, dataSnap[property].link.indexOf("/status")) + "%2Fstatus" + "%2F" + dataSnap[property].link.substring(dataSnap[property].link.indexOf("/status") + 8);
				var myMarker = map.addMarker({
					lat: dataSnap[property].coordinates.coordinates[1],
					lng: dataSnap[property].coordinates.coordinates[0],
					animation: google.maps.Animation.DROP,
					mylink: dataSnap[property].link,
					user: dataSnap[property].link.substring(20, dataSnap[property].link.indexOf("/status")),
					id: dataSnap[property].link.substring(dataSnap[property].link.indexOf("/status") + 8),
					chosenString: twt,
					click: function() {
						$("#tweets").empty();
						$("#tweets").append('<iframe border=0 frameborder=0 height=500 width=375 src="'+this.chosenString+'"></iframe>');

					}
				});

				markerGroup.push(myMarker);
			}
		}

		overlayExist = 1;
	});
};

checkLocation();
