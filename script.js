var map;
var marker;

//the initialize function wraps the entire program and allows it to be called in the google maps event listener at the bottom so it runs on load
initialize = () => {

    /*set up the map options from the google maps API centering the map at a latitude of zero and longitude of zero
        takes parameters of the element where the map should be displayed and the options for the map*/
    var mapOptions = {
        zoom: 2.5,
        center: new google.maps.LatLng(0, 0),
    };
        map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    
    setLocation = () => {
        fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then((resp) => resp.json())
        .then(function(data) {
        
        let lat = data.latitude.toFixed(4)
        let long = data.longitude.toFixed(4)

        let latLong = new google.maps.LatLng(lat, long)

        updateLatLong(lat, long);

        if(marker != undefined) {
            marker.setPosition(latLong)
        } else {
            marker = new google.maps.Marker ({
            position: latLong,
            icon: "./smallspaceshuttle.png",
            map: map,
        })
        }

      //Use reverse geocoding to display an address from current latitude and longitude
      geocodeLatLng = (geocoder) => {
        var geocoder = new google.maps.Geocoder;
          
        var geoLatLng = {lat: parseFloat(data.latitude), lng: parseFloat(data.longitude)}

        //initiate request to the geocoding service and pass it a location parameter set to geoLatLang
        geocoder.geocode({'location': geoLatLng}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                  //use the first returned address from geocoder to get the most precise address and format it
                  document.getElementById('address').innerHTML = results[0].formatted_address   
              } else {
                document.getElementById('address').innerHTML = 'No results found';
              }
            } else if (status === 'ZERO_RESULTS'){
                document.getElementById('address').innerHTML = "No address found in this location"
              
            } else {
                //alert any fails and their status
                document.getElementById('address').innerHTML = `Geocoder failed due to: ${status}`
            }
          });
        }
    })
    .catch(function(error) {
      console.log(JSON.stringify(error));
    });
    }

    setInterval(function() {
        setLocation()
    }, 1000)
  }

    document.getElementById('getAddressButton').addEventListener('click', function() {
      geocodeLatLng();
    });

    updateLatLong = (lat, long) => {
      document.getElementById('lat').innerHTML = `latitude: ${lat}`
      document.getElementById('lng').innerHTML = `longitude: ${long}`
    }

  //load the map on window load
  google.maps.event.addDomListener(window, 'load', initialize);
