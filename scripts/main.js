var fulltheface = ( function(){

	var fulltheface = {

		geolocation: null,
		bar: null,

		fourSquareParams: {
			url: 'https://api.foursquare.com/v2/venues/search',
			latLng: '',
			categoryId: '4d4b7105d754a06376d81259',
			radius: 1000,
			intent: 'checkin',
			clientId: 'JARRHCLHU51VHNCIMABLY40NP0JGQWWHY51PXAAZNGB44QTZ',
			clientSecret: 'CLVMZGZC0WSJSFYE5YR5TEM4PDIUWCLJDMBIVE2WHDGDMKVH',
			versioning: '20121022'
		},

		init: function(){

			if( navigator.geolocation != undefined ){
				// mostra botao e seta evento
				$('#button').click( function( event ){
					event.preventDefault()
					fulltheface.letsFullTheFace()
				}).show()

			} else {
				// seta msgs de erro
				this.showError( 'Sem suporte' )
			}

			return this
		},

		letsFullTheFace: function(){

			navigator.geolocation.getCurrentPosition( function( position ){

				fulltheface.geolocation = position
				fulltheface.fourSquareParams.latLng = position.coords.latitude +','+ position.coords.longitude
				fulltheface.searchBar()

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

				fulltheface.showError( msg )
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

					if( data.meta.code == 200 ){

						var nearest = null
						var distance = 10 * fulltheface.fourSquareParams.radius
						var venues = data.response.venues

						for( i = 0; i < venues.length; i++ ){
							if( venues[ i ].location.distance < distance ){
								distance = venues[ i ].location.distance
								nearest = venues[ i ]
							}
						}

						fulltheface.bar = nearest
						fulltheface.showMap()

					} else {

						fulltheface.showError( 'Foursquare está indisponível' )
					}

				}, error: function( xhr, status, error ){

					fulltheface.showError( 'erro: ' + status )
				}
			})
		},

		showMap: function(){

			var mapCenter = new google.maps.LatLng( this.geolocation.coords.latitude, this.geolocation.coords.longitude )

			var map = new google.maps.Map( $('#map')[0], {
				zoom: 15,
				center: mapCenter,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			})

			new google.maps.Marker({
				position: mapCenter,
				map: map
			})

			var barLocation = new google.maps.LatLng( this.bar.location.lat, this.bar.location.lng )

			new google.maps.Marker({
				position: barLocation,
				map: map
			})

			$('#map').show()
		},

		showError: function( msg ){

		}
	}

	return fulltheface.init()

})()