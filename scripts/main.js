var fulltheface = ( function(){

	var fulltheface = {

		location: null,

		fourSquareParams: {
			url: 'https://api.foursquare.com/v2/venues/search',
			latLng: '',
			categoryId: '4d4b7105d754a06376d81259',
			radius: '1000',
			intent: 'checkin',
			clientId: 'JARRHCLHU51VHNCIMABLY40NP0JGQWWHY51PXAAZNGB44QTZ',
			clientSecret: 'CLVMZGZC0WSJSFYE5YR5TEM4PDIUWCLJDMBIVE2WHDGDMKVH',
			versioning: '20121022'
		},

		init: function(){

			if( navigator.geolocation != undefined ){

				// mostra botao e seta evento

			} else {
				// seta msgs de erro
				this.showError( 'Sem suporte' )
			}

			return this
		},

		letsFullTheFace: function(){

			navigator.geolocation.getCurrentPosition( function( position ){

				this.location = position
				this.searchBar()

			}, function( error ){

				var msg

				switch( error.code ){

					case error.TIMEOUT:
						msg = 'Timeout'
						break;
					case error.POSITION_UNAVAILABLE:
						msg = 'Position unavailable'
						break;
					case error.PERMISSION_DENIED:
						msg = 'Permission denied'
						break;
					case error.UNKNOWN_ERROR:
						msg = 'Unknown error'
						break;
				}

				this.showError( msg )
			})
		},

		searchBar: function(){

			url  = this.fourSquareParams.url
			url += '?ll=' + this.fourSquareParams.latLng
			url += '&categoryId=' + this.fourSquareParams.categoryId
			url += '&radius=' + this.fourSquareParams.radius
			url += '&intent=' + this.fourSquareParams.intent
			url += '&client_id=' + this.fourSquareParams.clientId
			url += '&client_secret=' + this.fourSquareParams.clientSecret
			url += '&v=' + this.fourSquareParams.versioning

			$.ajax({
				url: url,
				type: 'GET',
				async: true,
				dataType: 'jsonp',
				crossDomain: true,
				success: function( data, status, xhr ){

					console.log( data )
					this.showMap()
				},
				error: function( xhr, status, error ){

					this.showError( 'erro: ' + status )
				}
			})
		},

		showMap: function(){

		},

		showError: function( msg ){

		}
	}

	return fulltheface.init()

})()

// var mapCenter = new GLatLng(position.coords.latitude,position.coords.longitude);
					// var mapCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					// var myOptions = {
					//   zoom: 5,
					//   center: mapCenter,
					//   mapTypeId: google.maps.MapTypeId.ROADMAP
					// };
					// // map = new GMap2(document.getElementById("map"));
					// map = new google.maps.Map(document.getElementById("map"), myOptions);
					// // map.setCenter(mapCenter, 15);
					// new google.maps.Marker({
					// 	position: mapCenter,
					// 	map: map
					// })

					// geocoder = new google.maps.Geocoder();
					// geocoder.geocode({ 'latLng': mapCenter}, function(results, status){
					// 	if (status == google.maps.GeocoderStatus.OK) {
					//         // if (results[1]) {
					//         //   map.setZoom(11);
					//         //   marker = new google.maps.Marker({
					//         //       position: latlng,
					//         //       map: map
					//         //   });
					//         //   infowindow.setContent(results[1].formatted_address);
					//         //   infowindow.open(map, marker);
					//         results.pop()
					//         r = results.pop()
					//         console.log(r)
					//         alert(r['address_components'][0]['short_name'])
					//         // }
					//     } else {
					//         alert("Geocoder failed due to: " + status);
					//     }
					// })

					// Start up a new reverse geocoder for addresses?
					// geocoder = new GClientGeocoder();
					// geocoder.getLocations(latitude+','+longitude, addAddressToMap);