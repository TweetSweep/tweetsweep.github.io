var mapCenter
var polygonThere = false;
var mapPolygon;
var oneOverlay;

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

function clearOverlays() {
  for (var i = 0; i < markerGroup.length; i++ ) {
    markerGroup[i].setMap(null);
  }
  markerGroup.length = 0;
}

function checkDatabase() {
	database.once('value', function(snapshot) {
		var dataSnap = snapshot.val();

		console.log("checking");

		clearOverlays();

		for (var property in dataSnap) {
			if (dataSnap[property].coordinates != undefined) {
				var twt = "https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F" + dataSnap[property].link.substring(20, dataSnap[property].link.indexOf("/status")) + "%2Fstatus" + "%2F" + dataSnap[property].link.substring(dataSnap[property].link.indexOf("/status") + 8);
				var myMarker = map.drawOverlay({
					lat: dataSnap[property].coordinates.coordinates[1],
					lng: dataSnap[property].coordinates.coordinates[0],
					mylink: dataSnap[property].link,
					user: dataSnap[property].link.substring(20, dataSnap[property].link.indexOf("/status")),
					id: dataSnap[property].link.substring(dataSnap[property].link.indexOf("/status") + 8),
					content: '<iframe border=0 frameborder=0 height=500 width=375 src="'+twt+'"></iframe>',
				});

				markerGroup.push(myMarker);
			}
		}
	});
};

checkLocation();
checkDatabase();
