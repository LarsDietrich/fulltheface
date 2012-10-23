var fulltheface = ( function(){

	var fulltheface = {

		geolocation: null,
		bar: null,
		barLocation: null,
		map: null,

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
				this.showError( 'Seu navegador não tem suporte a Geolocalização =(' )
			}

			return this
		},

		letsFullTheFace: function(){

			$('#button').fadeOut( 600 )
			$('#spinner').fadeIn( 100 )

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
						msg = 'Localização indisponível'
						break;
					case error.PERMISSION_DENIED:
						msg = 'Permissão negada'
						break;
					case error.UNKNOWN_ERROR:
						msg = 'Erro desconhecido'
						break;
				}

				fulltheface.showError( 'Erro ao tentar obter geolocalização: '+ msg )
			})
		},

		searchBar: function(){

			url = this.fourSquareParams.url +
			      '?ll=' + this.fourSquareParams.latLng +
			      '&categoryId=' + this.fourSquareParams.categoryId +
			      '&radius=' + this.fourSquareParams.radius +
			      '&intent=' + this.fourSquareParams.intent +
			      '&client_id=' + this.fourSquareParams.clientId +
			      '&client_secret=' + this.fourSquareParams.clientSecret +
			      '&v=' + this.fourSquareParams.versioning

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

					fulltheface.showError( 'Erro: ' + status )
				}
			})
		},

		showMap: function(){

			this.geolocation = new google.maps.LatLng( this.geolocation.coords.latitude, this.geolocation.coords.longitude )

			this.map = new google.maps.Map( $('#map')[0], {
				zoom: 10,
				center: this.geolocation,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			})

			new google.maps.Marker({
				position: this.geolocation,
				map: this.map,
				title: 'Você está aqui'
			})

			this.barLocation = new google.maps.LatLng( this.bar.location.lat, this.bar.location.lng )

			var barMarker = new google.maps.Marker({
				position: this.barLocation,
				icon: 'images/marker-duff.png',
				map: this.map,
				title: this.bar.name
			})

			new google.maps.InfoWindow({
				content: this.getBarDetails()
			}).open( this.map, barMarker )

			this.fitMap()
			// this.setDirections()

			// console.log(this.bar)
			$('#spinner').fadeOut( 600 )
			$('#map').show()
		},

		fitMap: function(){

			var latMin = Math.min( this.geolocation.lat(), this.barLocation.lat() )
			var latMax = Math.max( this.geolocation.lat(), this.barLocation.lat() )

			var lngMin = Math.min( this.geolocation.lng(), this.barLocation.lng() )
			var lngMax = Math.max( this.geolocation.lng(), this.barLocation.lng() )

			this.map.fitBounds( new google.maps.LatLngBounds(
				new google.maps.LatLng( latMin, lngMin ),
				new google.maps.LatLng( latMax, lngMax )
			) )
		},

		setDirections: function(){

			var directionsService = new google.maps.DirectionsService()
			var directionsDisplay = new google.maps.DirectionsRenderer()

			directionsDisplay.setMap( this.map )

			var request = {
				origin: this.geolocation,
				destination: this.barLocation,
				travelMode: google.maps.TravelMode.WALKING
			}

			directionsService.route( request, function( result, status ){

				if( status == google.maps.DirectionsStatus.OK )
					directionsDisplay.setDirections( result )
			})
		},

		getBarDetails: function(){

			if( this.bar != null ){

				var categories = []

				for( i = 0; i < this.bar.categories.length; i++ )
					categories.push( this.bar.categories[ i ].name )

				categories = categories.join( ', ' )

				var iconSrc = this.bar.categories[0].icon.prefix + 'bg_64' + this.bar.categories[0].icon.suffix

				return '<div id="bar-content">' +
				           '<div class="top">' +
				               '<img src="' + iconSrc + '" />' +
				               '<h2>' + this.bar.name + '</h2>' +
				               '<h4>' + categories + '</h4>' +
				           '</div>' +
				           '<ul class="info">' +
				               '<li><span class="">' + this.bar.hereNow.count + '</span> pessoas aqui, <span class="">' + this.bar.likes.count + '</span> likes</li>' +
				               '<li>' + this.bar.location.address + '</li>' +
				               '<li class="small">A ' + this.bar.location.distance + ' metros <a href="#" onclick="fulltheface.setDirections()">Obter direções</a></li>' +
				           '</ul>' +
				       '</div>'
			}

			return '<div id="bar-content">Sem informações do bar.</div>'
		},

		showError: function( msg ){

			$('#spinner').fadeOut( 600 )
			$('#error').html( msg ).fadeIn( 600 )
		}
	}

	return fulltheface.init()

})()